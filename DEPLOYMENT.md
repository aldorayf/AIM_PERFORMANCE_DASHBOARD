# Deploying AIM Performance Dashboard to Vercel

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `aldorayf/AIM_PERFORMANCE_DASHBOARD`
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

Your app will be live at: `https://your-project-name.vercel.app`

## Alternative Deployment Options

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### Deploy to GitHub Pages (Static Export)

If you want to use GitHub Pages, you'll need to modify the app for static export:

1. Update `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
```

2. Add to `package.json` scripts:
```json
"export": "next build && next export"
```

3. Deploy to GitHub Pages using the `out` directory

## Environment Setup

The dashboard loads CSV files from the `/public` directory, so no environment variables are needed. All data processing happens client-side in the browser.

## Custom Domain

After deployment, you can add a custom domain:
- Vercel: Project Settings > Domains
- Netlify: Site Settings > Domain Management

## Performance Notes

- The app is optimized for static generation
- CSV files are loaded on the client side
- All calculations happen in the browser
- First load may take a moment to process ~2,800 records
- Subsequent navigation is instant (client-side routing)

## Updating the Dashboard

To update data:
1. Replace CSV files in the `public` directory
2. Commit and push changes
3. Vercel/Netlify will auto-deploy the update

Or manually trigger a redeploy in your hosting platform's dashboard.
