# 🚀 RapidAPI Listing Dossier: RealtyDistress API

Use this cheat sheet to list **RealtyDistress API** on the [RapidAPI Provider Studio](https://rapidapi.com/provider) in under 2 minutes.

---

## 1. General Information
* **API Name:** `RealtyDistress API`
* **Short Description:** US County Property Tax Delinquency, Probate & Foreclosure Lead Router
* **Category:** `Data` (or `Business` / `Search`)
* **Logo Asset:** [`logo.png`](file:///c:/Users/jewel/Desktop/Tink/realty-distress-api/logo.png) *(1:1 square ratio ready)*
* **Website / Documentation URL:** `https://realty-distress-api.vercel.app`
* **Target Gateway / Base URL:**
  ```text
  https://realty-distress-api.vercel.app
  ```

---

## 2. API Definition & Import
* Click **"Upload OpenAPI Spec"** and select:
  [`rapidapi-openapi.json`](file:///c:/Users/jewel/Desktop/Tink/realty-distress-api/rapidapi-openapi.json)

---

## 3. Long Description (Copy & Paste into Markdown Box)

```markdown
# 🏡 RealtyDistress API — US County Property Tax Delinquency, Probate & Foreclosure Lead Router

Automate county-by-county lookup gateways for **delinquent property taxes**, **sheriff foreclosure auction calendars**, **probate court dockets**, and **GIS parcel viewers** across all 3,143 US counties and parishes.

Real estate investors, wholesalers, and PropTech developers lose hundreds of engineering hours hunting down county-level portals, navigating fragmented municipal websites, and deciphering state-by-state redemption statutes. **RealtyDistress API** resolves any US State and County into an exhaustive, direct-link distress routing dossier in under 20 milliseconds.

---

### ⚡ Key Capabilities & Data Depth

* **3,143 US Counties & Parishes:** Direct-link routing to county property appraiser/assessor parcel searches, county treasurer tax delinquency portals, and GIS mapping engines.
* **3,284 Mapped County Probate Dockets:** Instant resolution of designated probate courts, public case docket portals, and statutory creditor notification windows for inheritance and estate prospecting.
* **50-State Statutory Tax Sale Rules:** Instant lookup for:
  * **System:** Tax Lien State vs. Tax Deed State vs. Hybrid/Redeemable Deed.
  * **Statutory Interest Rates:** Real-world rates and penalty tiers (e.g. Florida 18% bid-down, Texas 25%/50% penalty, Ohio 18%, Georgia 20%).
  * **Redemption Periods:** Legal windows before title vesting or deed application.
  * **Statutory Code Citations:** Specific legal codes governing auctions and redemption.
* **Sheriff Sale & Auction Platform Identification:** Tracks foreclosure auction schedules and vendor platforms (RealAuction, GovEase, Bid4Assets, CivicSource, and local sheriff steps).
* **High-Velocity Performance:** Sub-20ms edge latency running on Vercel Edge Serverless infrastructure.

---

### 🚀 Who Uses RealtyDistress API?

* **Wholesalers & Real Estate Investors:** Quickly verify back taxes, tax auction dates, and probate executor filings on potential acquisitions.
* **PropTech SaaS Platforms & CRMs:** Enrich nationwide property listings with direct links to county assessment records and tax statuses.
* **Direct Mail Marketers:** Verify county parcel ID syntax, deed recorders, and GIS parcel boundaries before sending campaigns.
* **Title & Escrow Researchers:** Cross-reference statutory redemption periods and county treasurer payment portals.

---

### 🛠️ Quick Start Example (cURL)

```bash
curl -X GET "https://realty-distress-api.vercel.app/v1/distress/county?state=OH&county=Montgomery" \
  -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
  -H "X-RapidAPI-Host: realty-distress-api.p.rapidapi.com"
```

---

### 📋 Available Endpoints

* `GET /v1/distress/county?state=OH&county=Montgomery` — Master County Distress Routing Dossier.
* `GET /v1/distress/probate?state=TX&county=Harris` — Probate court docket & estate search router.
* `GET /v1/distress/property-search?state=FL&county=Miami-Dade` — County property appraiser search & GIS map viewer.
* `GET /v1/distress/tax-sales?state=OH` — State-level tax sale mechanism and redemption window guide.
* `GET /v1/distress/statutes` — Nationwide 50-state statutory tax sale comparison database.
* `GET /v1/distress/stats` — System coverage statistics.
```

---

## 4. Terms of Use (Copy & Paste)

```markdown
### Terms of Use — RealtyDistress API

**1. Permitted Use & Commercial Rights**
- Subscribers receive a non-exclusive license to query RealtyDistress API for personal, commercial, or enterprise real estate analysis, CRM lead enrichment, and software development.
- You may display, cache, and integrate routing links, statutory intelligence, and portal metadata within your proprietary applications and end-user dashboards.

**2. Data Accuracy & Independent Verification**
- RealtyDistress API aggregates and routes users to publicly accessible county government portals, court dockets, and state statutes.
- While routing links and statutory summaries are maintained with high precision, property tax assessments, lien amounts, redemption deadlines, and auction dates are determined solely by the respective county officials. Users should independently verify title status and auction dates through the provided official county gateways prior to executing real estate transactions or placing bids.

**3. Fair Usage & Rate Limits**
- Users agree to abide by the rate limits and monthly quotas of their selected subscription tier. Automated scraping or reverse-engineering of the API gateway is strictly prohibited.
```

---

## 5. Monetization & Pricing Tiers (Plans & Pricing Tab)

| Tier | Price | Monthly Quota | Real-World Persona | Overage Fee | Rate Limit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🟢 BASIC (Free)** | **$0.00** | **50 calls / mo** | Developer sandbox evaluation | $0.10 / call | 5 req / min |
| **🔵 PRO** | **$29.00 / mo** | **1,500 calls / mo** | Active wholesalers & local investors | $0.03 / call | 60 req / min |
| **🟣 ULTRA** | **$79.00 / mo** | **7,500 calls / mo** | PropTech startups & multi-state investors | $0.015 / call | 300 req / min |
| **🟡 MEGA** | **$199.00 / mo** | **25,000 calls / mo** | High-volume nationwide platforms & CRMs | $0.008 / call | 1,000 req / min |
