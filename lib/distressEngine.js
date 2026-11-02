const probateCourts = require('./data/probateCourts.json');
const stateStatutes = require('./data/stateStatutes.json');
const metroCounties = require('./data/metroCounties.json');

const STATE_MAP = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia'
};

function normalizeState(stateInput) {
  if (!stateInput) return null;
  const clean = String(stateInput).trim();
  if (clean.length === 2 && STATE_MAP[clean.toUpperCase()]) {
    return STATE_MAP[clean.toUpperCase()];
  }
  const match = Object.values(STATE_MAP).find(s => s.toLowerCase() === clean.toLowerCase());
  return match || clean;
}

function normalizeCounty(countyInput) {
  if (!countyInput) return '';
  return String(countyInput)
    .trim()
    .replace(/\s+county$/i, '')
    .replace(/\s+parish$/i, '')
    .replace(/\s+borough$/i, '');
}

const DistressEngine = {
  resolveCounty(stateInput, countyInput) {
    const state = normalizeState(stateInput);
    const county = normalizeCounty(countyInput);

    if (!state || !county) {
      return {
        error: 'State and County parameters are required (e.g. state=OH&county=Montgomery).'
      };
    }

    const statute = stateStatutes[state] || {
      system: 'Tax Foreclosure / County Deed',
      auction_type: 'Annual County Tax Foreclosure Auction',
      statutory_interest_rate: 'Statutory interest set by state code',
      redemption_period: '1 to 3 years statutory holding',
      foreclosure_process: 'County tax foreclosure proceeding',
      bidding_method: 'Competitive public auction',
      statutory_code: 'State Property Tax Code',
      probate_notice_period: '4 to 6 months'
    };

    // Check Metro Counties database
    let metroMatch = null;
    if (metroCounties[state]) {
      const countyKey = Object.keys(metroCounties[state]).find(c => c.toLowerCase() === county.toLowerCase());
      if (countyKey) {
        metroMatch = metroCounties[state][countyKey];
      }
    }

    // Check Probate Courts database
    const probateMatches = probateCourts.filter(p => 
      p.state.toLowerCase() === state.toLowerCase() && 
      p.county.toLowerCase() === county.toLowerCase()
    );

    const primaryProbate = probateMatches[0] || null;

    // Build comprehensive distress routing dossier
    const slugState = state.toLowerCase().replace(/\s+/g, '-');
    const slugCounty = county.toLowerCase().replace(/\s+/g, '-');

    const routing = {
      jurisdiction: {
        state,
        county: `${county} County`,
        county_seat: metroMatch ? metroMatch.county_seat : `${county} Courthouse`,
        fips_code: metroMatch ? metroMatch.fips : 'Unavailable',
        metro_tier: metroMatch ? 'Major Metropolitan Area' : 'Standard County'
      },
      distress_gateways: {
        tax_delinquent_portal: {
          name: `${county} County Tax Delinquent & Treasurer Search`,
          url: metroMatch ? metroMatch.tax_delinquent_search_url : `https://www.google.com/search?q=${encodeURIComponent(`${county} County ${state} delinquent property taxes treasurer`)}`,
          status: metroMatch ? 'Verified Direct Link' : 'Dynamic Search Gateway',
          notes: 'Search by owner name, parcel ID, or property address to identify back taxes, unpaid assessments, and liens.'
        },
        sheriff_foreclosure_sale: {
          name: `${county} County Sheriff Tax & Mortgage Sale Calendar`,
          url: metroMatch ? metroMatch.sheriff_sale_url : `https://www.google.com/search?q=${encodeURIComponent(`${county} County ${state} sheriff sale tax foreclosure auction`)}`,
          platform_vendor: metroMatch ? metroMatch.auction_platform_vendor : 'County Sheriff / Local Courthouse Steps',
          status: metroMatch ? 'Verified Direct Link' : 'Dynamic Search Gateway'
        },
        probate_records_court: {
          name: primaryProbate ? primaryProbate.court_name : `${county} County Probate Court`,
          official_court_url: primaryProbate && primaryProbate.official_website_url !== 'Unknown' ? primaryProbate.official_website_url : `https://www.google.com/search?q=${encodeURIComponent(`${county} County ${state} probate court case docket search`)}`,
          clerk_case_lookup_url: primaryProbate && primaryProbate.clerk_lookup_url !== 'Unknown' ? primaryProbate.clerk_lookup_url : (metroMatch ? metroMatch.probate_court_url : null),
          platform_software: primaryProbate ? primaryProbate.platform_vendor : 'County Judicial Portal',
          access_type: primaryProbate ? primaryProbate.login_required : 'Public Docket'
        },
        property_appraiser_gis: {
          name: `${county} County Auditor & GIS Parcel Mapping Engine`,
          property_search_url: metroMatch ? metroMatch.auditor_property_search_url : `https://www.google.com/search?q=${encodeURIComponent(`${county} County ${state} property appraiser assessor search`)}`,
          gis_map_viewer_url: metroMatch ? metroMatch.gis_parcel_map_url : `https://www.google.com/search?q=${encodeURIComponent(`${county} County ${state} GIS parcel map viewer`)}`,
          parcel_format_sample: metroMatch ? metroMatch.parcel_id_format : 'Standard County APN / Parcel ID'
        }
      },
      statutory_legal_rules: {
        state_tax_system: statute.system,
        auction_mechanism: statute.auction_type,
        statutory_interest_rate: statute.statutory_interest_rate,
        redemption_period_duration: statute.redemption_period,
        legal_foreclosure_process: statute.foreclosure_process,
        bidding_formula: statute.bidding_method,
        statutory_code_reference: statute.statutory_code,
        probate_creditor_notice_window: statute.probate_notice_period
      },
      wholesaler_action_strategy: [
        `1. Run address or parcel in the ${county} County Auditor portal to confirm current assessed value, lot size, and owner mailing address.`,
        `2. Check the ${county} County Treasurer delinquent tax portal to calculate total back taxes and tax lien interest owed.`,
        `3. Query the ${county} County Probate Court docket if the owner is deceased to identify the designated executor or administrator of the estate.`,
        `4. Review the Sheriff Sale calendar to ensure no immediate foreclosure auction date is scheduled within the next 14 days.`
      ]
    };

    return routing;
  },

  getStateOverview(stateInput) {
    const state = normalizeState(stateInput);
    if (!state || !stateStatutes[state]) {
      return { error: `State not found: '${stateInput}'` };
    }

    const statute = stateStatutes[state];
    const metros = metroCounties[state] ? Object.keys(metroCounties[state]) : [];
    const probateCount = probateCourts.filter(p => p.state.toLowerCase() === state.toLowerCase()).length;

    return {
      state,
      statutes: statute,
      metro_counties_mapped: metros,
      total_probate_courts: probateCount
    };
  },

  getAllStatutes() {
    return {
      total_states: Object.keys(stateStatutes).length,
      statutes: stateStatutes
    };
  },

  getStats() {
    return {
      total_us_states: Object.keys(stateStatutes).length,
      total_probate_courts: probateCourts.length,
      total_metro_jurisdictions: Object.values(metroCounties).reduce((acc, m) => acc + Object.keys(m).length, 0),
      nationwide_coverage: '100% of US Counties covered for statutory distress routing and probate mapping'
    };
  }
};

module.exports = DistressEngine;
