process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
https.get('https://nctu.edu.vn', { rejectUnauthorized: false }, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const regex = /["'](https?:\/\/[^"']+\.(?:jpg|png|webp|jpeg)|(?:\/[^"']+\.(?:jpg|png|webp|jpeg)))["']/gi;
    const matches = [];
    let m;
    while ((m = regex.exec(html)) !== null) {
      matches.push(m[1]);
    }
    const filtered = [...new Set(matches)].filter(u => 
      u.toLowerCase().includes('banner') || 
      u.toLowerCase().includes('slide') || 
      u.toLowerCase().includes('truong') || 
      u.toLowerCase().includes('nctu') || 
      u.toLowerCase().includes('campus') ||
      u.toLowerCase().includes('gioi-thieu')
    );
    console.log(JSON.stringify(filtered, null, 2));
  });
}).on('error', (e) => console.error(e));
