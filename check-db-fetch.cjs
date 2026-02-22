const fetch = require('node-fetch') || globalThis.fetch;

const url = 'https://cfxmrckrzfocmdtnstwx.supabase.co/rest/v1/news_articles?select=*';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeG1yY2tyemZvY21kdG5zdHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NzQ0NjUsImV4cCI6MjA4NDM1MDQ2NX0.leiLW46GoL1cH6EoazfMzH844XqoRzziKp3GMlv9ELE';

async function check() {
    const res = await fetch(url, {
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
        }
    });
    const data = await res.json();
    console.log(`Found ${data.length} articles in DB.`);
    if (data.length > 0) {
        console.log('Latest article:', data[0].title, data[0].published_at);
    } else {
        console.log('Response:', data);
    }
}
check();
