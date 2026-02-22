import fs from 'fs';

async function checkGoogleNews() {
    const res = await fetch("https://news.google.com/rss/search?q=home+care+uk+AND+(NHS+OR+CQC)&hl=en-GB&gl=GB&ceid=GB:en");
    const xml = await res.text();
    const pattern = /<item>([\s\S]*?)<\/item>/g;
    let match = pattern.exec(xml);
    if (match) {
        console.log("FIRST ITEM XML:");
        console.log(match[1]);
    }
}
checkGoogleNews();
