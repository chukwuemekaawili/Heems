const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

async function test() {
    const res = await fetch(link, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
        redirect: "manual", // DON'T FOLLOW
    });
    console.log("Status:", res.status);
    console.log("Location:", res.headers.get("location"));
    const text = await res.text();
    console.log("Has window.location?", text.includes("window.location"));
    const match = text.match(/<a[^>]*href=["']([^"']+)["']/i);
    console.log("First anchor:", match ? match[1] : "none");
}
test();
