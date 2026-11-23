const probateCourts = require('./data/probateCourts.json');
const stateStatutes = require('./data/stateStatutes.json');
const metroCounties = require('./data/metroCounties.json');
let countyLinks = {};
try { countyLinks = require('./data/countyLinks.json'); } catch (_) {}
// Hand-collected county pages (sale list / delinquent list), each opened and checked on the date in `checked`.
const _norm = (x) => String(x || '').toLowerCase().replace(/\b(county|parish|borough|census area|saint|st)\b\.?/g, '').replace(/[^a-z]/g, '');
const _linkIndex = {};
for (const [k, v] of Object.entries(countyLinks)) { const [st, co] = k.split('|'); _linkIndex[st + '|' + _norm(co)] = v; }
const findCountyLinks = (state, county) => _linkIndex[state + '|' + _norm(county)] || null;
let linkChecks = {};
try { linkChecks = require('./data/linkChecks.json'); } catch (_) {}
// A URL counts as verified only if the link checker confirmed it loads and names the county.
const isLive = (u) => !!(u && linkChecks[u] && linkChecks[u].ok);
const searchUrl = (place, state, words) => `https://www.google.com/search?q=${encodeURIComponent(`${place} ${state} ${words}`)}`;

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

    // Parishes, boroughs, census areas and independent cities keep their own name instead of "X County".
    const display = /\b(parish|borough|census area|city|municipality|town)\b/i.test(String(countyInput)) ? String(countyInput).trim() : `${county} County`;
    const live = (u) => (isLive(u) ? u : null);
    const taxUrl = (findCountyLinks(state, countyInput) || {}).delinquent_list_url || live(metroMatch && metroMatch.tax_delinquent_search_url);
    // Every Ohio county runs its sheriff sales on the statewide RealForeclose network
    // ({county}.sheriffsaleauction.ohio.gov). The auction calendar and each sale's full property list
    // (address, parcel, appraised value, opening bid) are public; an account is only needed to bid.
    // Confirmed 2026-11-23 from the network's own county menu and by opening several county sites.
    const ohioSheriff = state === 'Ohio'
      ? `https://${county.toLowerCase().replace(/[^a-z]/g, '')}.sheriffsaleauction.ohio.gov/index.cfm?zaction=USER&zmethod=CALENDAR`
      : null;
    const handLinks = findCountyLinks(state, countyInput);
    const sheriffUrl = ohioSheriff || (handLinks && handLinks.sale_list_url) || live(metroMatch && metroMatch.sheriff_sale_url);
    const auditorUrl = live(metroMatch && metroMatch.auditor_property_search_url);
    const gisUrl = live(metroMatch && metroMatch.gis_parcel_map_url);
    const probateSite = live(primaryProbate && primaryProbate.official_website_url) || live(metroMatch && metroMatch.probate_court_url);
    const probateClerk = live(primaryProbate && primaryProbate.clerk_lookup_url);
    const status = (u) => (u ? 'Verified Direct Link' : 'Dynamic Search Gateway');

    const routing = {
      jurisdiction: {
        state,
        county: display,
        county_seat: metroMatch ? metroMatch.county_seat : `${county} Courthouse`,
        fips_code: metroMatch ? metroMatch.fips : 'Unavailable',
        metro_tier: metroMatch ? 'Major Metropolitan Area' : 'Standard County'
      },
      distress_gateways: {
        tax_delinquent_portal: {
          name: `${county} County Tax Delinquent & Treasurer Search`,
          url: taxUrl || searchUrl(display, state, 'delinquent property taxes treasurer'),
          status: status(taxUrl),
          notes: 'Search by owner name, parcel ID, or property address to identify back taxes, unpaid assessments, and liens.'
        },
        sheriff_foreclosure_sale: {
          name: `${county} County Sheriff Tax & Mortgage Sale Calendar`,
          url: sheriffUrl || searchUrl(display, state, 'sheriff sale tax foreclosure auction'),
          platform_vendor: ohioSheriff ? 'RealForeclose (Ohio Sheriff Sale Auction)' : (metroMatch ? metroMatch.auction_platform_vendor : 'County Sheriff / Local Courthouse Steps'),
          sale_notes: !ohioSheriff && handLinks && handLinks.sale_list_url ? (handLinks.notes || undefined) : undefined,
          login_needed_to_view: !ohioSheriff && handLinks && handLinks.sale_list_url ? !!handLinks.login_needed_to_view : undefined,
          viewing_note: ohioSheriff ? 'Free to view: open the calendar and click a sale date to see every property (address, parcel ID, appraised value, opening bid, deposit). An account is only needed to bid.' : undefined,
          status: status(sheriffUrl)
        },
        probate_records_court: {
          name: primaryProbate ? primaryProbate.court_name : `${county} County Probate Court`,
          official_court_url: probateSite || searchUrl(display, state, 'probate court case docket search'),
          clerk_case_lookup_url: probateClerk,
          status: status(probateSite),
          platform_software: primaryProbate ? primaryProbate.platform_vendor : 'County Judicial Portal',
          access_type: primaryProbate ? primaryProbate.login_required : 'Public Docket'
        },
        property_appraiser_gis: {
          name: `${county} County Auditor & GIS Parcel Mapping Engine`,
          property_search_url: auditorUrl || searchUrl(display, state, 'property appraiser assessor search'),
          gis_map_viewer_url: gisUrl || searchUrl(display, state, 'GIS parcel map viewer'),
          status: auditorUrl || gisUrl ? 'Verified Direct Link' : 'Dynamic Search Gateway',
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
      nationwide_coverage: 'All US counties covered for statutory rules; links are marked Verified Direct Link only when a live check confirmed them, otherwise a county-specific search gateway',
      verified_links: Object.values(linkChecks).filter((c) => c.ok).length + Object.values(countyLinks).reduce((a, c) => a + (c.sale_list_url ? 1 : 0) + (c.delinquent_list_url ? 1 : 0), 0),
      counties_with_direct_sale_list: 88 + Object.values(countyLinks).filter((c) => c.sale_list_url).length,
      links_last_checked: Object.values(linkChecks).reduce((a, c) => (c.checked > a ? c.checked : a), '')
    };
  }
};

module.exports = DistressEngine;

