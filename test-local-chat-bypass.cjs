const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer skip' // I'll modify server.ts temporarily to accept this
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
    console.log('Chunk:', chunk.toString());
  });
  res.on('end', () => console.log('Response End:', res.statusCode, data));
});
req.on('error', console.error);
req.write(JSON.stringify({ contents: [{role: 'user', parts: [{text: 'hi'}]}] }));
req.end();
