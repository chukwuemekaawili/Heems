import fs from 'fs';

const feeds = [
    { url: "https://news.google.com/rss/search?q=home+care+uk+AND+(NHS+OR+CQC)&hl=en-GB&gl=GB&ceid=GB:en", source: "Google News", category: "Market Outlook" },
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", source: "BBC Health", category: "Regulation" }
];

async function testRss() {
    for (const feed of feeds) {
        console.log(`\nFetching ${feed.source}...`);
        try {
            const res = await fetch(feed.url);
            const xml = await res.text();

            // Replicate the edge function logic
            const pattern = /<item>([\s\S]*?)<\/item>/g;
            let match;
            let count = 0;

            while ((match = pattern.exec(xml)) !== null && count < 3) {
                const c = match[1];
                const titleMatch = c.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/) || c.match(/<title[^>]*>([^<]*)<\/title>/);
                const title = titleMatch?.[1]?.trim() || "No Title";

                const descMatch = c.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || c.match(/<description>([\s\S]*?)<\/description>/) || c.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
                const description = descMatch?.[1] || "";

                const image = (
                    c.match(/<media:content[^>]*url=["']([^"']+)["']/) ||
                    c.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/) ||
                    c.match(/<enclosure[^>]*url=["']([^"']+)["']/) ||
                    description.match(/<img[^>]+src=["']([^"']+)["']/) ||
                    c.match(/<content:encoded[^>]*>.*?<img[^>]+src=["']([^"']+)["'].*?<\/content:encoded>/s)
                )?.[1] || null;

                console.log(`\n[Article] ${title}`);
                if (image) {
                    console.log(`  ✅ Found Image: ${image}`);
                } else {
                    console.log(`  ❌ No Image Found!`);
                    console.log(`  -- Has media:content? ${c.includes('media:content')}`);
                    console.log(`  -- Has media:thumbnail? ${c.includes('media:thumbnail')}`);
                    console.log(`  -- Has enclosure? ${c.includes('enclosure')}`);
                    console.log(`  -- Description preview: ${description.slice(0, 100).replace(/\n/g, ' ')}...`);
                    // Find any url strings in 'c' just to see what's available
                    const urls = [...c.matchAll(/url=["']([^"']+)["']/g)].map(m => m[1]);
                    const srcs = [...c.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
                    console.log(`  -- Any 'url' attributes in XML block?`, urls);
                    console.log(`  -- Any 'src' attributes in XML block?`, srcs);
                }
                count++;
            }
        } catch (e) {
            console.error(e);
        }
    }
}

testRss();
