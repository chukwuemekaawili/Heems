let url = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

async function test() {
    for (let i = 0; i < 5; i++) {
        console.log(`\nFetch ${i + 1}:`, url);
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
            redirect: "manual"
        });
        console.log("Status:", res.status);
        if (res.status >= 300 && res.status < 400) {
            url = res.headers.get("location");
            if (!url.startsWith("http")) url = new URL(url, "https://news.google.com").toString();
            console.log("Redirects to:", url);
        } else {
            const html = await res.text();
            console.log("Final HTML excerpt:", html.slice(0, 300));
            break;
        }
    }
}
test();
