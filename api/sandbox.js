const DistressEngine = require('../lib/distressEngine.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const query = req.method === 'POST' ? (req.body || {}) : (req.query || {});
  const state = query.state || 'Ohio';
  const county = query.county || 'Montgomery';

  try {
    const data = DistressEngine.resolveCounty(state, county);
    if (data.error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      sandbox: true,
      notice: 'Compiled via free developer sandbox. For production volume and direct webhook alerts, subscribe on RapidAPI.',
      timestamp: new Date().toISOString(),
      data
    }, null, 2));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Sandbox Query Failed', message: err.message }));
  }
};
