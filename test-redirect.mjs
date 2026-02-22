import fs from 'fs';

async function testRedirect() {
    const url = "https://news.google.com/rss/articles/CBMifkFVX3lxTE1mUXc4cnR3VU1NWnBZQ0kxdE1heXBZcl9FcnNHVmtNWTJRaG1hNEJSb2Q0VDhEVFVwd0lERnhVc2dJWFZjb3d3X1Brd1dvY3M5T05hbmxzazVWbHVwNUhueW5iU2ktR0NmbTNOdXdkUlg4b3pZVXpLR1IwdlFIdw?oc=5";
    try {
        const res = await fetch(url);
        const html = await res.text();
        console.log("Status:", res.status);
        console.log("Final URL:", res.url);

        const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

        if (ogImage) {
            console.log("Found og:image:", ogImage[1]);
        } else {
            console.log("No og:image found.");
            console.log("HTML Start:", html.slice(0, 500));
        }
    } catch (e) {
        console.error(e);
    }
}
testRedirect();
