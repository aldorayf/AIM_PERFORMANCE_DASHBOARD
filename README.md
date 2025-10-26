# AIM Trucking Services - Performance Dashboard

A comprehensive performance dashboard for AIM Trucking Services, Inc., tracking financial metrics, operations, and customer data for both OTR (Over the Road) and Local Drayage services.

## Features

### 📊 Key Metrics
- **Total Revenue & Profit** - Complete financial overview for Nov 1, 2024 - Oct 31, 2025
- **Load Analytics** - Total loads, average revenue per load, and profit margins
- **OTR vs Local Drayage Comparison** - Separate metrics for each line of business
- **Service Type Breakdown** - Revenue and profitability by service (Base Price, OTR LINEHAUL, RGN LINEHAUL, Chassis, Overweight, Hazmat, etc.)
- **Monthly Trends** - Track performance over time with interactive charts
- **Driver Performance** - Individual driver metrics and profitability
- **Customer Analytics** - Top customers by revenue and profit

### 🎨 Dashboard Sections

#### Financial Tab
- Monthly revenue and profit trend charts
- Service type performance analysis
- Revenue breakdown by service category
- Monthly performance tables

#### Operations Tab
- Driver performance metrics
- Load counts and revenue per driver
- Profit margins by driver
- Total driver pay tracking

#### Customers Tab
- Customer revenue rankings
- Profit analysis by customer
- Load volume per customer
- Customer margin analysis

### 🚚 Service Types Tracked
- **OTR LINEHAUL** - Over the road line haul services
- **RGN LINEHAUL** - Removable gooseneck line haul services
- **Base Price** - Standard drayage pricing
- **Overweight** - Overweight load services
- **Hazmat** - Hazardous materials handling
- **Chassis** - Chassis rental services
- **Reefer** - Refrigerated container services
- **Detention** - Detention charges

*Note: Transload and Unloading services are tracked separately as pass-through charges*

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Recharts** - Interactive data visualization
- **Papa Parse** - CSV data parsing
- **date-fns** - Date formatting and manipulation

## 🌐 Web Deployment

This dashboard is ready to deploy as a web application!

### Quick Deploy to Vercel (Recommended - Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aldorayf/AIM_PERFORMANCE_DASHBOARD)

**Or deploy manually:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
npm run deploy
```

Your dashboard will be live at `https://your-project.vercel.app` in minutes!

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions** including:
- Vercel deployment
- Netlify deployment
- GitHub Pages deployment
- Custom domain setup

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AIM_PERFORMANCE_DASHBOARD
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Data Files

The dashboard uses two main CSV files located in the `public` directory:

1. **2025-10-24T12_17_08.377Z-profitability.csv** - Complete profitability report with all loads
   - Load numbers
   - Revenue and profit data
   - Driver assignments
   - Service types

2. **AIM TRUCK OTR - COMPLETED RUNS.csv** - OTR-specific load tracking
   - AIM reference numbers
   - Delivery locations
   - Customer information
   - OTR margins

The dashboard automatically cross-references these files using the Load # and AIM REFERENCE NUMBER fields to separate OTR from Local Drayage operations.

## Key Insights

The dashboard provides insights into:

1. **Revenue Distribution** - Understanding the split between OTR and Local Drayage business
2. **Profitability Trends** - Monthly profit margins and seasonal patterns
3. **Service Performance** - Which services drive the most revenue and profit
4. **Driver Efficiency** - Individual driver performance and productivity
5. **Customer Value** - Top customers and their contribution to revenue
6. **Operational Costs** - Driver pay and expense tracking

## Design

The dashboard features a modern, dark-themed interface inspired by professional business intelligence tools, with:
- Card-based KPI displays
- Interactive charts and graphs
- Tabbed navigation for different data views
- Responsive design for desktop and mobile
- Real-time data calculations

## Data Processing

- Automatically identifies OTR loads by cross-referencing the OTR CSV
- Filters pass-through charges (transload, unloading) from profitability calculations
- Handles multiple service types per load
- Calculates aggregate metrics across all dimensions
- Parses various date formats and currency values

## Future Enhancements

Potential additions to the dashboard:
- Year-over-year comparison metrics
- Predictive analytics and forecasting
- Export functionality (PDF, Excel)
- Real-time data updates
- Advanced filtering and search
- Custom date range selection
- Route profitability analysis
- Equipment utilization tracking

## Support

For questions or issues, please contact the development team or open an issue in the repository.

---

© 2025 AIM Trucking Services, Inc. All rights reserved.
