const http = require('http');
const data = JSON.stringify({
  contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
});
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': 'Bearer skip'
  }
};
const req = http.request(options, res => {
  res.on('data', d => process.stdout.write(d));
});
req.write(data);
req.end();
