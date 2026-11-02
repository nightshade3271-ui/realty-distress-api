const http = require('http');
const fs = require('fs');
const path = require('path');

const countyHandler = require('./api/county.js');
const taxSalesHandler = require('./api/taxSales.js');
const probateHandler = require('./api/probate.js');
const propertySearchHandler = require('./api/propertySearch.js');
const statutesHandler = require('./api/statutes.js');
const statsHandler = require('./api/stats.js');
const sandboxHandler = require('./api/sandbox.js');
const indexHandler = require('./api/index.js');

const PORT = process.env.PORT || 3008;

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = Object.fromEntries(reqUrl.searchParams.entries());
  const pathname = reqUrl.pathname;

  // Buffer incoming JSON body for POST
  if (req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });
    await new Promise(resolve => req.on('end', resolve));
    try {
      req.body = bodyStr ? JSON.parse(bodyStr) : {};
    } catch (e) {
      req.body = bodyStr;
    }
  }

  // Routing
  if (pathname === '/v1/distress/county' || pathname === '/api/county') {
    return countyHandler(req, res);
  }
  if (pathname === '/v1/distress/tax-sales' || pathname === '/api/taxSales') {
    return taxSalesHandler(req, res);
  }
  if (pathname === '/v1/distress/probate' || pathname === '/api/probate') {
    return probateHandler(req, res);
  }
  if (pathname === '/v1/distress/property-search' || pathname === '/api/propertySearch') {
    return propertySearchHandler(req, res);
  }
  if (pathname === '/v1/distress/statutes' || pathname === '/api/statutes') {
    return statutesHandler(req, res);
  }
  if (pathname === '/v1/distress/stats' || pathname === '/api/stats') {
    return statsHandler(req, res);
  }
  if (pathname === '/api/sandbox') {
    return sandboxHandler(req, res);
  }
  if (pathname === '/v1/status' || pathname === '/api/status') {
    return indexHandler(req, res);
  }

  // Static files in public/
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
});

server.listen(PORT, () => {
  console.log(`🚀 RealtyDistress API Server running at http://localhost:${PORT}`);
});
