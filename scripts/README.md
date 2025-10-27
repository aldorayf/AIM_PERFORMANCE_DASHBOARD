# Scripts

This directory contains utility scripts for the AIM Performance Dashboard.

## generate-otr-csv.js

Generates a CSV file of all OTR (Over the Road) loads by cross-referencing:
- `public/2025-10-24T12_17_08.377Z-profitability.csv` (profitability data)
- `public/AIM TRUCK OTR - COMPLETED RUNS.csv` (OTR reference data)

### Usage

```bash
npm run generate-otr-csv
```

### Output

Creates `public/OTR-Loads-From-Profitability.csv` containing:
- All loads from profitability data that match OTR reference numbers
- "Base Price" service types converted to "OTR LINEHAUL"
- All columns from the profitability report

### Details

The script:
1. Reads the OTR reference CSV to get all OTR load IDs
2. Filters profitability data to only OTR loads (matches by AIM reference number)
3. Replaces "Base Price" charge types with "OTR LINEHAUL" for proper categorization
4. Exports matched records to a new CSV file

This allows you to:
- Track OTR loads separately from local drayage
- Analyze OTR profitability in spreadsheet software
- Archive historical OTR performance data

---

## find-unmatched-otr.js

Identifies OTR loads that are in the completed runs CSV but missing from the profitability report.

### Usage

```bash
npm run find-unmatched-otr
```

### Output

Creates `public/OTR-Loads-Not-In-Profitability.csv` containing:
- All OTR loads from the completed runs CSV that are NOT in profitability data
- Full load details (container, customer, delivery date, driver, etc.)
- Status marked as "Not Found in Profitability Report"
- Match statistics showing percentage of found vs. missing loads

### Details

The script:
1. Reads all load IDs from the profitability CSV
2. Reads all OTR load IDs from the completed runs CSV
3. Identifies loads in OTR CSV that don't exist in profitability CSV
4. Exports unmatched loads with all available details
5. Shows statistics: Total OTR loads, matched count, unmatched count

**Current Results:**
- Total OTR loads: 982
- Matched: 789 (80.3%)
- Not matched: 193 (19.7%)

This helps you:
- Identify missing invoices or unbilled loads
- Find loads that need to be added to profitability tracking
- Reconcile completed OTR runs with financial records
- Investigate discrepancies between operations and accounting
