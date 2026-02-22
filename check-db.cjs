const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').filter(line => line && !line.startsWith('#')).forEach(line => {
    const [k, v] = line.split('=');
    if (k && v) env[k.trim()] = v.trim();
});
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
sb.from('news_articles').select('title, link, image_url, source').then(res => {
    if (res.error) console.error("DB Error:", res.error);
    console.log("Total articles:", res.data.length);
    const missing = res.data.filter(a => !a.image_url);
    console.log("Articles missing image:", missing.length);
    console.log(missing.map(a => `[${a.source}] ${a.title}`).join('\n'));
});
