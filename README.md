# 🏡 RealtyDistress API
### US County Property Tax Delinquency, Probate & Foreclosure Lead Router

Automate county-by-county lookup gateways for delinquent property taxes, sheriff foreclosure auction calendars, probate court dockets, and GIS parcel viewers across all 3,143 US counties and parishes.

---

## ⚡ Key Capabilities
- **3,143 US Counties Covered:** Direct routing to county property appraiser search engines, delinquent tax portals, and GIS parcel map viewers.
- **3,284 Probate Court Dockets:** Instant resolution of designated probate courts, public case docket portals, and statutory creditor notification windows.
- **50-State Statutory Tax Sale Rules:** Instant lookup for Tax Lien vs. Tax Deed states, statutory interest rates (8% to 24%), redemption periods, and legal code citations.
- **Auction Platform Identification:** Tracks platform vendors across RealAuction, GovEase, Bid4Assets, CivicSource, and local sheriff steps.
- **High-Velocity Performance:** Sub-20ms edge latency hosted on Vercel Serverless Edge.

---

## 🚀 Commercial Endpoints
- `GET /v1/distress/county?state=OH&county=Montgomery` — Master County Distress Routing Dossier.
- `GET /v1/distress/probate?state=TX&county=Harris` — Direct probate court and estate docket router.
- `GET /v1/distress/property-search?state=FL&county=Miami-Dade` — County auditor search & GIS map viewer.
- `GET /v1/distress/tax-sales?state=OH` — State-level tax sale mechanism and redemption window guide.
- `GET /v1/distress/statutes` — Nationwide 50-state statutory tax sale comparison database.
- `GET /v1/distress/stats` — System coverage statistics.
- `GET /api/sandbox?state=OH&county=Montgomery` — Unauthenticated sandbox endpoint.

---

## 🛠️ Local Development
```bash
node test.js
node server.js
```
Runs at `http://localhost:3008`.
Interactive developer console available at `/index.html`.
