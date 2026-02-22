const fs = require('fs');

const FEEDS = [
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", source: "BBC Health", category: "Innovation" },
    { url: "https://news.google.com/rss/search?q=uk+social+care+home+care+2026&hl=en-GB&gl=GB&ceid=GB:en", source: "UK Care News", category: "Workforce" },
];

function stripHtml(html) {
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

function parseItems(xml, source, category) {
    const items = [];
    const patterns = [
        /(?:<item>)([\s\S]*?)(?:<\/item>)/g,
        /(?:<entry>)([\s\S]*?)(?:<\/entry>)/g
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(xml)) !== null && items.length < 8) {
            const c = match[1];

            const title = (
                c.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                c.match(/<title[^>]*>([\s\S]*?)<\/title>/)
            )?.[1]?.trim() || "";

            if (!title) continue;

            const link = (
                c.match(/<link[^>]+href=["']([^"']+)["']/) ||
                c.match(/<link>([\s\S]*?)<\/link>/)
            )?.[1]?.trim() || "";

            const pubDate = (
                c.match(/<pubDate>([\s\S]*?)<\/pubDate>/) ||
                c.match(/<updated>([\s\S]*?)<\/updated>/) ||
                c.match(/<dc:date>([\s\S]*?)<\/dc:date>/)
            )?.[1] || "";

            let description = (
                c.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                c.match(/<description>([\s\S]*?)<\/description>/) ||
                c.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)
            )?.[1] || "";

            items.push({
                title: stripHtml(title).replace(/\s*\|.*$/, "").trim(),
                link: link || null,
                pubDate: pubDate.trim(),
            });
        }
        if (items.length > 0) break;
    }
    return items;
}

async function test() {
    for (const feed of FEEDS) {
        console.log(`Fetching ${feed.source}...`);
        try {
            const res = await fetch(feed.url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; HeemsCareBot/1.0)",
                    "Accept": "application/rss+xml, application/xml, text/xml, */*",
                }
            });
            const xml = await res.text();
            console.log(`Got XML length: ${xml.length}`);
            const items = parseItems(xml, feed.source, feed.category);
            console.log(`Parsed ${items.length} items.`);
            if (items.length > 0) {
                console.log(`First item title: ${items[0].title}`);
                console.log(`First item link: ${items[0].link}`);
            }
        } catch (e) {
            console.error("Error fetching", e);
        }
    }
}

test();
