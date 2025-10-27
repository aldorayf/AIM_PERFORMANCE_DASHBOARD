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
