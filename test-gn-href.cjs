const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

async function test() {
    const res = await fetch(link, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" }
    });
    const html = await res.text();
    const match = html.match(/data-n-href=["']([^"']+)["']/i);
    if (match) {
        console.log("Found data-n-href:", match[1]);
    } else {
        console.log("Not found data-n-href!");
        // Let's dump the <c-wiz> element if it exists
        const cwiz = html.match(/<c-wiz[^>]*>([\s\S]*?)<\/c-wiz>/);
        if (cwiz) console.log("c-wiz content length:", cwiz[1].length);
    }
}
test();
