const link = "https://news.google.com/rss/search?q=uk+social+care+home+care+2026&hl=en-GB&gl=GB&ceid=GB:en";

async function test() {
    const res = await fetch(link);
    const xml = await res.text();
    const item = xml.split('<item>')[1].split('</item>')[0];
    console.log("ITEM XML:");
    console.log(item);
}
test();
