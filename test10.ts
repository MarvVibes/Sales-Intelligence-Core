import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET'
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
