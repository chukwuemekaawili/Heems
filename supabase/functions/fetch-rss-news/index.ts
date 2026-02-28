import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleDecoder } from "npm:google-news-url-decoder";
import { corsHeaders } from "../_shared/cors.ts";

const FEEDS = [
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", source: "BBC Health", category: "Innovation" },
    { url: "https://news.google.com/rss/search?q=uk+social+care+home+care+2026&hl=en-GB&gl=GB&ceid=GB:en", source: "UK Care News", category: "Workforce" },
    { url: "https://news.google.com/rss/search?q=CQC+care+quality+UK&hl=en-GB&gl=GB&ceid=GB:en", source: "CQC News", category: "Regulation" },
    { url: "https://news.google.com/rss/search?q=elderly+care+domiciliary+UK&hl=en-GB&gl=GB&ceid=GB:en", source: "Homecare News", category: "Market Outlook" },
    { url: "https://news.google.com/rss/search?q=NHS+care+workers+UK+2026&hl=en-GB&gl=GB&ceid=GB:en", source: "NHS England", category: "Workforce" },
    { url: "https://news.google.com/rss/search?q=skills+for+care+UK&hl=en-GB&gl=GB&ceid=GB:en", source: "Skills for Care", category: "Workforce" },
    { url: "https://news.google.com/rss/search?q=age+uk+care&hl=en-GB&gl=GB&ceid=GB:en", source: "Age UK", category: "Strategy" },
    { url: "https://news.google.com/rss/search?q=cb+insights+digital+health&hl=en-US&gl=US&ceid=US:en", source: "CB Insights", category: "Market Outlook" },
];

function stripHtml(html: string): string {
    if (!html) return "";
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

// ──────────────────────────────────────────────────────────
//  3-STEP IMAGE EXTRACTION PIPELINE
//  Step 1: RSS tags  (media:thumbnail, media:content, enclosure, img in desc)
//  Step 2: og:image  (fetch article URL, scrape <meta property="og:image">)
//  Step 3: null      (frontend shows teal gradient placeholder)
// ──────────────────────────────────────────────────────────

function extractImageFromRSS(itemXml: string, description: string): string | null {
    // Priority 1: High-res content tags first (fixes blurry images)
    const highResPatterns = [
        /<media:content[^>]*url=["']([^"']+)["']/,
        /<enclosure[^>]*url=["']([^"']+(?:\.jpg|\.jpeg|\.png|\.webp|\.gif)[^"']*)["']/i,
        /<enclosure[^>]*type=["']image\/[^"']*["'][^>]*url=["']([^"']+)["']/,
        /<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image\//,
    ];
    for (const re of highResPatterns) {
        const m = itemXml.match(re);
        if (m?.[1]) return m[1];
    }

    // Check for <img src> inside <description> (HTML-encoded or raw)
    const decoded = description
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const imgMatch = decoded.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch?.[1]) return imgMatch[1];

    // check for <img> inside encoded content
    const contentEncoded = itemXml.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/);
    if (contentEncoded) {
        const ceDecoded = contentEncoded[1]
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        const ceImg = ceDecoded.match(/<img[^>]+src=["']([^"']+)["']/);
        if (ceImg?.[1]) return ceImg[1];
    }

    // Fallback solely if the thumbnail is 400px+ wide (prevents tiny blurry icons)
    const thumbMatch = itemXml.match(/<media:thumbnail[^>]*>/);
    if (thumbMatch) {
        const urlMatch = thumbMatch[0].match(/url=["']([^"']+)["']/);
        const widthMatch = thumbMatch[0].match(/width=["'](\d+)["']/);
        if (urlMatch && (!widthMatch || parseInt(widthMatch[1], 10) >= 400)) {
            return urlMatch[1];
        }
    }

    return null;
}

async function scrapeOgImage(url: string): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; HeemsCareBot/1.0)" },
            signal: controller.signal,
            redirect: "follow",
        });
        clearTimeout(timeout);
        if (!res.ok) return null;
        // Only read the first 30KB of HTML (og:image is always in <head>)
        const reader = res.body?.getReader();
        if (!reader) return null;
        let html = "";
        while (html.length < 30000) {
            const { done, value } = await reader.read();
            if (done) break;
            html += new TextDecoder().decode(value);
        }
        reader.cancel();

        const ogMatch =
            html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

        const foundImage = ogMatch?.[1] || null;
        // Reject Google News generic placeholder logos (which aren't the real publisher's image)
        if (foundImage && foundImage.includes("googleusercontent.com")) return null;

        return foundImage;
    } catch {
        return null;
    }
}

async function parseItems(xml: string, source: string, category: string): Promise<any[]> {
    const items: any[] = [];
    const patterns = [
        /(?:<item>)([\s\S]*?)(?:<\/item>)/g,
        /(?:<entry>)([\s\S]*?)(?:<\/entry>)/g
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(xml)) !== null && items.length < 35) {
            const c = match[1];

            const title = (
                c.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                c.match(/<title[^>]*>([^<]*)<\/title>/)
            )?.[1]?.trim() || "";

            if (!title) continue;

            const link = (
                c.match(/<link[^>]+href=["']([^"']+)["']/) ||
                c.match(/<link>([^<]+)<\/link>/)
            )?.[1]?.trim() || "";

            const pubDate = (
                c.match(/<pubDate>([^<]+)<\/pubDate>/) ||
                c.match(/<updated>([^<]+)<\/updated>/) ||
                c.match(/<dc:date>([^<]+)<\/dc:date>/)
            )?.[1] || "";

            const description = (
                c.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                c.match(/<description>([\s\S]*?)<\/description>/) ||
                c.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)
            )?.[1] || "";

            // ── STEP 1: Extract image from RSS tags ──
            const rssImage = extractImageFromRSS(c, description);
            console.log(`[IMG-PIPE] Step1 "${title.slice(0, 40)}…" → ${rssImage ? "✅ " + rssImage.slice(0, 60) : "❌ no RSS image"}`);

            let dateObj = new Date();
            if (pubDate) {
                const d = new Date(pubDate);
                if (!isNaN(d.getTime())) dateObj = d;
            }

            items.push({
                title: stripHtml(title).replace(/\s*\|.*$/, "").trim(),
                link: link || null,
                source,
                category,
                published_at: dateObj.toISOString(),
                snippet: stripHtml(description).slice(0, 280),
                image_url: rssImage,
                fetched_at: new Date().toISOString(),
            });
        }
        if (items.length > 0) break;
    }

    // ── STEP 2: og:image fallback for items still missing an image ──
    const decoder = new GoogleDecoder();
    await Promise.all(items.map(async (item) => {
        if (item.image_url) return; // already have one
        if (!item.link) return;

        let targetHref = item.link;

        // Google News Bypass
        if (targetHref.includes("news.google.com/rss/articles/")) {
            try {
                const dec = await decoder.decode(targetHref);
                if (dec && dec.status && dec.decoded_url) {
                    targetHref = dec.decoded_url;
                    console.log(`[IMG-PIPE] Bypassed Google News redirect -> ${targetHref}`);
                }
            } catch (e: any) {
                console.warn(`[IMG-PIPE] Decode failed for GN`, e.message);
            }
        }

        const ogImage = await scrapeOgImage(targetHref);
        if (ogImage) {
            item.image_url = ogImage;
            console.log(`[IMG-PIPE] Step2 "${item.title.slice(0, 40)}…" → ✅ og:image ${ogImage.slice(0, 60)}`);
        } else {
            // ── STEP 3: Fallback generic stock images based on category ──
            const fallbacks: Record<string, string[]> = {
                "Workforce": [
                    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
                    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
                ],
                "Regulation": [
                    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
                    "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&q=80"
                ],
                "Market Outlook": [
                    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
                    "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80"
                ],
                "Innovation": [
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
                ]
            };
            const defaultMeds = [
                "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
                "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80"
            ];

            const categoryImgs = fallbacks[item.category] || defaultMeds;
            // Pseudo-random based on title length so it stays consistent for the same article
            const randIndex = item.title.length % categoryImgs.length;
            item.image_url = categoryImgs[randIndex];

            console.log(`[IMG-PIPE] Step3 "${item.title.slice(0, 40)}…" → 🟩 fallback: ${item.image_url.slice(0, 40)}`);
        }
    }));

    return items;
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );

        const allArticles: any[] = [];

        await Promise.allSettled(FEEDS.map(async (feed) => {
            try {
                const res = await fetch(feed.url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (compatible; HeemsCareBot/1.0; +https://heems.co.uk)",
                        "Accept": "application/rss+xml, application/xml, text/xml, */*",
                    },
                    signal: AbortSignal.timeout(10000),
                });

                if (!res.ok) {
                    console.warn(`Feed ${feed.url} returned ${res.status}`);
                    return;
                }

                const xml = await res.text();
                const items = await parseItems(xml, feed.source, feed.category);
                allArticles.push(...items);
            } catch (err: any) {
                console.warn(`Failed to fetch ${feed.source}:`, err.message);
            }
        }));

        let savedCount = 0;
        if (allArticles.length > 0) {
            // Filter out articles without links and deduplicate by link to prevent Postgres ON CONFLICT error
            const seenLinks = new Set();
            const validArticles = allArticles.filter(a => {
                if (!a.link) return false;
                if (seenLinks.has(a.link)) return false;
                seenLinks.add(a.link);
                return true;
            });

            if (validArticles.length > 0) {
                const { error } = await supabase
                    .from("news_articles")
                    .upsert(validArticles, { onConflict: "link", ignoreDuplicates: false });

                if (error) {
                    console.error("DB upsert error:", error);
                } else {
                    savedCount = validArticles.length;
                }
            }
        }

        // Cleanup: always keep only the 60 most recent articles, delete the rest
        const { data: keepRows } = await supabase
            .from("news_articles")
            .select("id")
            .order("published_at", { ascending: false })
            .limit(200);

        if (keepRows && keepRows.length > 0) {
            const keepIds = keepRows.map((r: any) => r.id);
            const { count } = await supabase
                .from("news_articles")
                .delete({ count: 'exact' })
                .not("id", "in", `(${keepIds.join(",")})`);
            if (count && count > 0) {
                console.log(`[CLEANUP] Deleted ${count} old articles to maintain 200-article cap`);
            }
        }

        // Always read most recent 60 articles back from DB
        const { data: articles, error: readError } = await supabase
            .from("news_articles")
            .select("*")
            .order("published_at", { ascending: false })
            .limit(200);

        if (readError) throw readError;

        return new Response(JSON.stringify({
            articles: articles || [],
            fetched: allArticles.length,
            saved: savedCount,
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err: any) {
        console.error("Edge Function error:", err);
        return new Response(JSON.stringify({ error: err.message, articles: [] }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
