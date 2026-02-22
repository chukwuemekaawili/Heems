const https = require('https');
const fs = require('fs');

const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeG1yY2tyemZvY21kdG5zdHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NzQ0NjUsImV4cCI6MjA4NDM1MDQ2NX0.leiLW46GoL1cH6EoazfMzH844XqoRzziKp3GMlv9ELE';

const options = {
    hostname: 'cfxmrckrzfocmdtnstwx.supabase.co',
    path: '/functions/v1/fetch-rss-news',
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('edge-response.json', data);
        console.log('Saved to edge-response.json');
    });
});

req.on('error', error => {
    console.error(error);
});

req.write('{}');
req.end();
