const { GoogleDecoder } = require('google-news-url-decoder');

const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

async function test() {
    try {
        const decoder = new GoogleDecoder();
        const decoded = await decoder.decode(link);
        console.log("Decoded:", decoded);
    } catch (e) {
        console.error("Error", e);
    }
}
test();
