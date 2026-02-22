const url = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

// Extract base64 part
const b64 = url.split('/articles/')[1].split('?')[0];
console.log("Base64:", b64);

try {
    // Base64URL decode
    const decodedStr = Buffer.from(b64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    console.log("Decoded:", decodedStr);

    // Find URL inside (it's often prefixed with some garbage bytes, usually an 0x08 and the length, then the URL)
    const match = decodedStr.match(/https?:\/\/[^\s\x00-\x1F]+/);
    if (match) {
        console.log("Real URL:", match[0]);
    } else {
        console.log("No URL found in decoded text");
    }
} catch (e) {
    console.log("Error decoding:", e);
}
