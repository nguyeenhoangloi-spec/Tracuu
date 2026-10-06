fetch('http://localhost:3000/')
  .then(res => {
    console.log('Status:', res.status, res.statusText);
    return res.text();
  })
  .then(html => {
    console.log('HTML length:', html.length);
    if (html.includes('Tra cứu')) {
      console.log('Page loaded successfully with Tra cứu content!');
    } else {
      console.log('Snippet:', html.slice(0, 300));
    }
  })
  .catch(err => console.error('Fetch error:', err));
