const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

const b64 = link.split('/articles/')[1].split('?')[0];
const decoded = Buffer.from(b64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
console.log("RAW BYTES:", decoded.length);

// Try to extract any ASCII strings longer than 10 chars
let s = "";
for (let i = 0; i < decoded.length; i++) {
    const c = decoded[i];
    if (c >= 32 && c <= 126) {
        s += String.fromCharCode(c);
    } else {
        if (s.length > 10) console.log("Found string:", s);
        s = "";
    }
}
if (s.length > 10) console.log("Found string:", s);
