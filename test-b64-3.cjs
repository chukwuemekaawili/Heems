const link = "https://news.google.com/rss/articles/CBMipgFBVV95cUxPYmt5bmV6Vlp5Z2xaMzk3VEhHSlUydk9EN0lWUlhha0RhbnYyRnVYWlVOLXJuLUIydXNsdlA2N3VyQlBlOUVCaDNOalM2RERTYXB6T1lOaGZwUTBGQkRlWm82U3RBNmQxdkpWUFZ6NC1WUGJxdU0yWnZob1VnbkpJcTRfX2RiUmRteGFvZWdNaGNoc1FQQzMyRlF4WjhXTlJVRVNBeGJR?oc=5";

const b64 = link.split('/articles/')[1].split('?')[0];

function decodeGoogleNewsUrl(encodedStr) {
    try {
        // Step 1: Decode the base64 URL
        const decoded1 = Buffer.from(encodedStr.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('ascii');

        // Find if there's a nested base64-like string that starts with AU_
        const match = decoded1.match(/(AU_[a-zA-Z0-9_-]+)/);
        if (match) {
            const nested = match[1];
            console.log("Found nested B64:", nested);
            const decoded2 = Buffer.from(nested.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('ascii');
            const urlMatch = decoded2.match(/https?:\/\/[^\x00-\x1F\s]+/);
            if (urlMatch) return urlMatch[0];

            // let's just dump decoded2 chars
            let s = "";
            for (let i = 0; i < decoded2.length; i++) {
                const c = decoded2.charCodeAt(i);
                if (c >= 32 && c <= 126) s += String.fromCharCode(c);
            }
            console.log("Decoded 2 ascii:", s);
        }
    } catch (e) {
        console.error("Decode error", e);
    }
}
decodeGoogleNewsUrl(b64);
