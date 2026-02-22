const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

async function test() {
    console.log("Fetching:", link);
    const res = await fetch(link, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" }
    });
    const html = await res.text();
    const cwizDataP = html.match(/<c-wiz[^>]*data-p=["']([^"']+)["']/i);
    if (cwizDataP) {
        console.log("Found data-p length:", cwizDataP[1].length);
        // Look for URLs inside data-p
        const matchUrls = [...cwizDataP[1].matchAll(/https?:\/\/[^\\]+/g)].map(m => m[0]);
        console.log("URLs in data-p:", matchUrls);
    } else {
        console.log("No c-wiz data-p found!");
    }
}
test();
