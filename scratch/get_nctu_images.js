process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');

https.get('https://nctu.edu.vn/tuyen-sinh/phuong-thuc-xet-tuyen-hoc-ba-thpt-nam-2024-vao-truong-dai-hoc-nam-can-tho', { rejectUnauthorized: false }, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const regex = /https?:\/\/[^\s"'<>]+\.(?:jpg|png|webp|jpeg)/gi;
    const matches = [...new Set(html.match(regex) || [])];
    console.log(matches);
  });
}).on('error', err => console.error(err));
