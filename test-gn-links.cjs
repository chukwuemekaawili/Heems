const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

async function test() {
    const res = await fetch(link, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" }
    });
    const html = await res.text();

    // Look for <a href="..."> inside the Google News page
    // The main link is usually inside a <c-wiz> or has a specific class, or we can just grab the meta refresh URL if it exists
    // actually, let's just log all URLs found in the HTML to see where the real one hides.
    const urls = [...html.matchAll(/href=["'](https:\/\/[^"']+)["']/gi)].map(m => m[1]);
    const cleanUrls = urls.filter(u => !u.includes('google.com') && !u.includes('gstatic.com'));
    console.log("Found real publisher URLs:");
    console.log([...new Set(cleanUrls)]);
}
test();
