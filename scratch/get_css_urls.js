process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
https.get('https://tracuu.nctu.edu.vn/assets/style/style.css', { rejectUnauthorized: false }, res => {
  let css = '';
  res.on('data', c => css += c);
  res.on('end', () => {
    const urls = css.match(/url\(['"]?([^'")]+)['"]?\)/gi);
    console.log(urls);
  });
}).on('error', e => console.error(e));
