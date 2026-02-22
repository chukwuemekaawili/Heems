import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// UK care sector RSS feeds — fetched server-side, no CORS issues
const FEEDS = [
    { url: "https://www.england.nhs.uk/feed/", source: "NHS England", category: "Innovation" },
    { url: "https://www.communitycare.co.uk/feed/", source: "Community Care", category: "Workforce" },
    { url: "https://www.ageuk.org.uk/discover/feed/", source: "Age UK", category: "Market Outlook" },
    { url: "https://www.skillsforcare.org.uk/rss.xml", source: "Skills for Care", category: "Workforce" },
    { url: "https://www.homecareassociation.org.uk/news.rss", source: "Homecare Association", category: "Regulation" },
    { url: "https://www.carersuk.org/news-and-campaigns/feed/", source: "Carers UK", category: "Market Outlook" },
    { url: "https://www.nice.org.uk/guidance/published/rss", source: "NICE", category: "Regulation" },
];

const CATEGORY_MAP: Record<string, string> = {
    "workforce": "Workforce",
    "innovation": "Innovation",
    "technology": "Innovation",
    "digital": "Innovation",
    "regulation": "Regulation",
    "cqc": "Regulation",
    "guidance": "Regulation",
    "policy": "Regulation",
    "market": "Market Outlook",
    "funding": "Market Outlook",
    "dementia": "Dignity",
    "dignity": "Dignity",
    "wellbeing": "Dignity",
    "mental health": "Dignity",
    "strategy": "Strategy",
    "plan": "Strategy",
    "reform": "Strategy",
};

function detectCategory(title: string, defaultCat: string): string {
    const lower = title.toLowerCase();
    for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
        if (lower.includes(keyword)) return cat;
    }
    return defaultCat;
}

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function extractImageFromContent(content: string): string | null {
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
}

function extractTextBetween(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
    if (!match) return "";
    return match[1].replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}

function parseItems(xml: string, source: string, defaultCategory: string): Array<{
    title: string; source: string; link: string; snippet: string;
    image_url: string | null; category: string; published_at: string;
}> {
    const items: ReturnType<typeof parseItems> = [];
    const itemBlocks = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || [];

    for (const block of itemBlocks.slice(0, 15)) {
        const title = stripHtml(extractTextBetween(block, "title"));
        const link = extractTextBetween(block, "link") ||
            (block.match(/<link>([^<]+)<\/link>/)?.[1] ?? "");
        const description = extractTextBetween(block, "description");
        const content = extractTextBetween(block, "content:encoded") || description;
        const pubDate = extractTextBetween(block, "pubDate");

        if (!title || !link) continue;

        // Extract image from enclosure or content
        let image_url: string | null = null;
        const enclosureMatch = block.match(/<enclosure[^>]+url=["']([^"']+\.(jpg|jpeg|png|webp))["']/i);
        if (enclosureMatch) image_url = enclosureMatch[1];
        if (!image_url) image_url = extractImageFromContent(content);

        const snippet = stripHtml(description).slice(0, 280) + (stripHtml(description).length > 280 ? "..." : "");
        const category = detectCategory(title, defaultCategory);
        const published_at = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();

        items.push({ title, source, link: link.trim(), snippet, image_url, category, published_at });
    }

    return items;
}

async function fetchFeed(feed: typeof FEEDS[0]): Promise<ReturnType<typeof parseItems>> {
    try {
        const res = await fetch(feed.url, {
            headers: { "User-Agent": "HeemsCare/1.0 news-aggregator" },
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseItems(xml, feed.source, feed.category);
    } catch (err) {
        console.error(`Failed to fetch ${feed.source}:`, err);
        return [];
    }
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        );

        // Fetch all feeds in parallel
        const results = await Promise.allSettled(FEEDS.map(fetchFeed));
        const allArticles: ReturnType<typeof parseItems> = [];

        for (const result of results) {
            if (result.status === "fulfilled") {
                allArticles.push(...result.value);
            }
        }

        if (allArticles.length === 0) {
            return new Response(JSON.stringify({ success: false, message: "No articles fetched" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        // Upsert into news_articles (ON CONFLICT on link → update snippet/image only)
        const { error, count } = await supabase
            .from("news_articles")
            .upsert(
                allArticles.map(a => ({ ...a, fetched_at: new Date().toISOString() })),
                { onConflict: "link", ignoreDuplicates: false }
            );

        if (error) throw error;

        // Keep only the most recent 200 articles — prune old ones
        await supabase.rpc("prune_old_news_articles");

        return new Response(JSON.stringify({
            success: true,
            fetched: allArticles.length,
            sources: FEEDS.map(f => f.source),
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (err) {
        console.error("fetch-news error:", err);
        return new Response(JSON.stringify({ success: false, error: String(err) }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
