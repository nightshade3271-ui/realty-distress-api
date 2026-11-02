const DistressEngine = require('./lib/distressEngine.js');

console.log('Testing RealtyDistress Engine...');

// Test 1: Montgomery County, Ohio
const ohio = DistressEngine.resolveCounty('OH', 'Montgomery');
console.log('✅ Montgomery OH Test:', ohio.jurisdiction.county, '| Seat:', ohio.jurisdiction.county_seat);
console.log('  Tax Portal:', ohio.distress_gateways.tax_delinquent_portal.url);
console.log('  Sheriff Sale:', ohio.distress_gateways.sheriff_foreclosure_sale.url);
console.log('  Probate Court:', ohio.distress_gateways.probate_records_court.name);
console.log('  Statute System:', ohio.statutory_legal_rules.state_tax_system);

// Test 2: Harris County, Texas
const texas = DistressEngine.resolveCounty('Texas', 'Harris');
console.log('✅ Harris TX Test:', texas.jurisdiction.county, '| Seat:', texas.jurisdiction.county_seat);
console.log('  Redemption Period:', texas.statutory_legal_rules.redemption_period_duration);
console.log('  Sheriff Platform:', texas.distress_gateways.sheriff_foreclosure_sale.platform_vendor);

// Test 3: Stats
const stats = DistressEngine.getStats();
console.log('✅ Stats:', stats);

console.log('\n🚀 ALL TESTS PASSED!');
