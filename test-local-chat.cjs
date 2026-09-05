const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test' // Invalid token, but we can bypass or see if it crashes before auth
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => console.log('Response End:', res.statusCode, data));
});
req.on('error', console.error);
req.write(JSON.stringify({ contents: [{role: 'user', parts: [{text: 'hi'}]}] }));
req.end();
