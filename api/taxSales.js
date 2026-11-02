const DistressEngine = require('../lib/distressEngine.js');
const validateRapidApiSecret = require('../lib/auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!validateRapidApiSecret(req)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Unauthorized access',
      message: 'This endpoint must be accessed through RapidAPI Marketplace.',
      marketplace: 'https://rapidapi.com'
    }));
    return;
  }

  const query = req.query || {};
  const state = query.state || 'Ohio';

  try {
    const data = DistressEngine.getStateOverview(state);
    if (data.error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      state: data.state,
      data
    }, null, 2));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'State Tax Sales Lookup Failed', message: err.message }));
  }
};
