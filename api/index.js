module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    service: 'RealtyDistress API',
    status: 'operational',
    version: '1.0.0',
    description: 'US County Property Tax Delinquency, Probate & Foreclosure Lead Routing Intelligence API',
    coverage: {
      jurisdictions: '3,143 US Counties & Parishes',
      probateCourts: '3,284 Mapped County Probate Dockets',
      statutoryTaxSaleRules: '50 States + DC'
    },
    endpoints: {
      countyDossier: 'GET /v1/distress/county?state=OH&county=Montgomery',
      taxSales: 'GET /v1/distress/tax-sales?state=OH',
      probate: 'GET /v1/distress/probate?state=OH&county=Montgomery',
      propertySearch: 'GET /v1/distress/property-search?state=OH&county=Montgomery',
      statutes: 'GET /v1/distress/statutes',
      stats: 'GET /v1/distress/stats',
      sandbox: 'GET /api/sandbox?state=OH&county=Montgomery'
    },
    documentation: 'https://realty-distress-api.vercel.app',
    marketplace: 'https://rapidapi.com'
  }, null, 2));
};
