# El Paseo Auto Group Website

A luxury car dealership website with inventory management and automated scraping.

**Source Site:** https://www.elpaseoauto.com

---

## Project Status

### Completed

- [x] Next.js 16 project setup with TypeScript
- [x] Tailwind CSS v4 with brand colors (gold/black luxury theme)
- [x] Google Fonts: Cormorant Garamond (headings) + Montserrat (body)
- [x] Prisma ORM with MySQL schema
- [x] UI Components (Button, Card, Input, Badge)
- [x] Layout Components (Header, Footer, MobileNav)
- [x] Homepage with all sections (Hero, Brands, Featured, Why Us, About, Contact CTA)
- [x] Inventory listing page with filters (make, year, price, body style, sort)
- [x] Vehicle detail page with gallery, specs, features, inquiry form
- [x] Admin dashboard with stats and scrape controls
- [x] Admin inventory management (toggle featured, mark sold)
- [x] API routes: `/api/vehicles`, `/api/vehicles/[vin]`, `/api/contact`, `/api/scrape`
- [x] Scraper with flexible/configurable CSS selectors
- [x] Database sync logic (add new, update existing, mark sold)
- [x] Static pages: About, Contact, Financing
- [x] Vercel cron configuration for daily scrapes

### To Do

- [ ] **Set up MySQL database** and update credentials
- [ ] **Test scraper** and tune CSS selectors for actual site DOM
- [ ] Add real logo image (currently text-based)
- [ ] Add hero background image
- [ ] Add showroom/about images
- [ ] Deploy to Vercel
- [ ] Set up Vercel Postgres (or connect external MySQL)
- [ ] Configure environment variables in Vercel
- [ ] Test scraper in production
- [ ] Add admin authentication (currently just API key)
- [ ] Optional: Email integration for contact form (Resend/SendGrid)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** MySQL with Prisma ORM
- **Scraping:** Cheerio
- **Deployment:** Vercel

---

## Local Development

### 1. Create MySQL Database

```bash
mysql -u root -p -e "CREATE DATABASE elpaseo_auto;"
```

### 2. Configure Environment

Update `.env` with your MySQL credentials:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/elpaseo_auto"
SOURCE_SITE_URL="https://www.elpaseoauto.com"
ADMIN_PASSWORD="your-secure-password"
CONTACT_EMAIL="info@elpaseoauto.com"
```

### 3. Push Database Schema

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploying to Vercel

### Option A: Vercel Postgres (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/el-paseo-auto.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Vercel Postgres**
   - In your Vercel project, go to **Storage** tab
   - Click **Create Database** → **Postgres**
   - This automatically adds `DATABASE_URL` to your environment

4. **Update Prisma for Postgres**

   Change `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "mysql"
     url      = env("DATABASE_URL")
   }
   ```

5. **Add Environment Variables**

   In Vercel Dashboard → Settings → Environment Variables:
   ```
   SOURCE_SITE_URL=https://www.elpaseoauto.com
   ADMIN_PASSWORD=your-secure-password
   CONTACT_EMAIL=info@elpaseoauto.com
   CRON_SECRET=your-cron-secret  # For securing cron endpoint
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Switch to Postgres for Vercel"
   git push
   ```

7. **Push Schema to Vercel Postgres**
   ```bash
   npx vercel env pull .env.local  # Pull Vercel env vars locally
   npx prisma db push
   ```

### Option B: External MySQL (PlanetScale, Railway, etc.)

1. Create a MySQL database on your provider
2. Get the connection string
3. Add `DATABASE_URL` to Vercel environment variables
4. Deploy as above

---

## Cron Job (Auto-Scrape)

The `vercel.json` is configured for daily scrapes at 6 AM UTC:

```json
{
  "crons": [
    {
      "path": "/api/scrape",
      "schedule": "0 6 * * *"
    }
  ]
}
```

To secure the cron endpoint, add `CRON_SECRET` to environment variables. Vercel automatically sends this header.

---

## Tuning the Scraper

The scraper uses configurable CSS selectors in `lib/scraper.ts`:

```typescript
const SELECTORS = {
  listing: {
    vehicleCards: ".vehicle-card, .inventory-item, [data-vehicle]",
    vehicleLink: "a[href*='/inventory/']",
  },
  detail: {
    vin: "[data-vin], .vin, .vin-number",
    price: ".price, .vehicle-price, [data-price]",
    // ... etc
  },
};
```

**To tune:**
1. Open https://www.elpaseoauto.com/inventory in browser
2. Right-click → Inspect Element
3. Find the CSS classes/selectors used for vehicle cards, prices, etc.
4. Update `SELECTORS` in `lib/scraper.ts`

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vehicles` | GET | List vehicles with filters |
| `/api/vehicles/[vin]` | GET | Single vehicle details |
| `/api/vehicles/[vin]` | PATCH | Update featured/sold status |
| `/api/contact` | POST | Submit contact form |
| `/api/scrape` | POST | Trigger inventory scrape |
| `/api/scrape?logId=X` | GET | Check scrape status |

### Query Parameters for `/api/vehicles`

- `make` - Filter by make
- `bodyStyle` - Filter by body style
- `minPrice` / `maxPrice` - Price range
- `minYear` / `maxYear` - Year range
- `featured` - Only featured (true/false)
- `sort` - newest, oldest, price-low, price-high, mileage-low, year-new, year-old
- `limit` / `offset` - Pagination

---

## Project Structure

```
el-paseo-auto/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Brand styles
│   ├── inventory/
│   │   ├── page.tsx             # Inventory listing
│   │   └── [vin]/page.tsx       # Vehicle detail
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── financing/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard
│   │   ├── inventory/page.tsx   # Manage vehicles
│   │   └── settings/page.tsx
│   └── api/
│       ├── vehicles/route.ts
│       ├── vehicles/[vin]/route.ts
│       ├── contact/route.ts
│       └── scrape/route.ts
├── components/
│   ├── ui/                      # Button, Card, Input, Badge
│   ├── layout/                  # Header, Footer, MobileNav
│   ├── home/                    # Hero, FeaturedVehicles, etc.
│   ├── inventory/               # VehicleCard, VehicleGrid, etc.
│   └── admin/                   # AdminSidebar, ScrapeButton, etc.
├── lib/
│   ├── db.ts                    # Prisma client
│   ├── scraper.ts               # Cheerio scraper
│   ├── sync.ts                  # DB sync logic
│   └── utils.ts                 # Helpers
├── prisma/
│   └── schema.prisma            # Database schema
├── .env                         # Environment variables
├── .env.local                   # Local overrides
└── vercel.json                  # Cron config
```

---

## Brand Colors

```css
--gold: #D4A84B
--gold-light: #E8C068
--gold-dark: #B8923F
--black: #0A0A0A
--charcoal: #1A1A1A
--gray-dark: #2A2A2A
--off-white: #F8F6F3
```

---

## Notes

- The scraper currently gets 403 from the source site due to bot protection. May need to use Puppeteer/Playwright for JavaScript rendering, or work with the site owner.
- Placeholder vehicle data is used until the scraper is working.
- Admin panel at `/admin` has no authentication - add before production.
