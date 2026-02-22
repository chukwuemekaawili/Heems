const link = "https://news.google.com/rss/articles/CBMiJWh0dHBzOi8vd3d3LmJiYy5jby51ay9uZXdzL3VrLTEyMzQ1Njc49AE_"; // fake, will use a real one from db
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function test() {
    const envFile = fs.readFileSync('.env', 'utf8');
    const env = {};
    envFile.split('\n').filter(line => line && !line.startsWith('#')).forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) env[k.trim()] = v.trim();
    });
    const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    const { data } = await sb.from('news_articles').select('link, title').ilike('source', '%News%').limit(1);

    if (!data || data.length === 0) return console.log("No articles found");
    const testLink = data[0].link;
    console.log("Testing:", data[0].title);
    console.log("Link:", testLink);

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(testLink, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
            signal: controller.signal,
            redirect: "follow",
        });
        clearTimeout(timeout);
        const html = await res.text();
        console.log("Response URL:", res.url);
        console.log("Status:", res.status);
        console.log("HTML Start:", html.slice(0, 300));

        const decoded = html;
        const ogMatch =
            decoded.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
            decoded.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

        console.log("og:image =", ogMatch ? ogMatch[1] : "NOT FOUND");

        // Check for refresh meta tag
        const metaRefresh = html.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["'][^;]+;url=([^"']+)["']/i);
        if (metaRefresh) console.log("Found Meta Refresh URL:", metaRefresh[1]);

    } catch (err) {
        console.log("Error:", err);
    }
}
test();
