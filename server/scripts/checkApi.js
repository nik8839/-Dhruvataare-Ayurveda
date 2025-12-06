const http = require('http');

const url = 'http://localhost:5000/api/pdfs/taxonomy?category=syllabus';

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('API Response:');
    console.log(data);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
