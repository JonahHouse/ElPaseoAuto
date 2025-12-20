# El Paseo Auto Group Website

## Project Overview

Build a modern dealership website for El Paseo Auto Group with an admin panel and automated inventory scraper. The site pulls vehicle data from an existing DealerWebsite Solutions (DWS) site and displays it in a custom-designed frontend.

**Source URL to scrape:** `[ADD YOUR DWS SITE URL HERE]`

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Vercel Postgres (or SQLite for local dev)
- **Image Storage:** Vercel Blob (or local /public folder for dev)
- **Scraping:** Cheerio (Node.js HTML parser)
- **Deployment:** Vercel

---

## Brand Guidelines

### Colors

```css
/* Primary */
--gold: #D4A84B;
--gold-light: #E8C068;
--gold-dark: #B8923F;

/* Neutrals */
--black: #0A0A0A;
--charcoal: #1A1A1A;
--gray-dark: #2A2A2A;
--gray: #4A4A4A;
--gray-light: #8A8A8A;
--white: #FFFFFF;
--off-white: #F8F6F3;
```

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4A84B',
          light: '#E8C068',
          dark: '#B8923F',
        },
        charcoal: '#1A1A1A',
        'gray-dark': '#2A2A2A',
        'off-white': '#F8F6F3',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
};
```

### Typography

- **Display/Headings:** Cormorant Garamond (400, 500, 600)
- **Body:** Montserrat (300, 400, 500, 600)

### Design Aesthetic

- Refined luxury, not flashy
- Generous whitespace
- Subtle animations on hover/scroll
- Gold accents used sparingly
- Dark sections for contrast
- No harsh borders—use subtle shadows and off-white backgrounds

---

## Database Schema

### Vehicles Table

```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vin VARCHAR(17) UNIQUE NOT NULL,
  stock_number VARCHAR(50),
  year INTEGER NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  trim VARCHAR(100),
  price DECIMAL(10, 2),
  msrp DECIMAL(10, 2),
  mileage INTEGER,
  exterior_color VARCHAR(100),
  interior_color VARCHAR(100),
  transmission VARCHAR(50),
  fuel_type VARCHAR(50),
  body_style VARCHAR(50),
  drivetrain VARCHAR(50),
  engine VARCHAR(100),
  description TEXT,
  features TEXT[], -- Array of feature strings
  is_featured BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  source_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_images (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scrape_logs (
  id SERIAL PRIMARY KEY,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  vehicles_found INTEGER,
  vehicles_added INTEGER,
  vehicles_updated INTEGER,
  vehicles_removed INTEGER,
  status VARCHAR(50), -- 'running', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Prisma Schema (Alternative)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Vehicle {
  id            Int       @id @default(autoincrement())
  vin           String    @unique @db.VarChar(17)
  stockNumber   String?   @map("stock_number") @db.VarChar(50)
  year          Int
  make          String    @db.VarChar(100)
  model         String    @db.VarChar(100)
  trim          String?   @db.VarChar(100)
  price         Decimal?  @db.Decimal(10, 2)
  msrp          Decimal?  @db.Decimal(10, 2)
  mileage       Int?
  exteriorColor String?   @map("exterior_color") @db.VarChar(100)
  interiorColor String?   @map("interior_color") @db.VarChar(100)
  transmission  String?   @db.VarChar(50)
  fuelType      String?   @map("fuel_type") @db.VarChar(50)
  bodyStyle     String?   @map("body_style") @db.VarChar(50)
  drivetrain    String?   @db.VarChar(50)
  engine        String?   @db.VarChar(100)
  description   String?   @db.Text
  features      String[]
  isFeatured    Boolean   @default(false) @map("is_featured")
  isSold        Boolean   @default(false) @map("is_sold")
  sourceUrl     String?   @map("source_url") @db.VarChar(500)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  images        VehicleImage[]

  @@map("vehicles")
}

model VehicleImage {
  id        Int      @id @default(autoincrement())
  vehicleId Int      @map("vehicle_id")
  url       String   @db.VarChar(500)
  position  Int      @default(0)
  isPrimary Boolean  @default(false) @map("is_primary")
  createdAt DateTime @default(now()) @map("created_at")
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@map("vehicle_images")
}

model ScrapeLog {
  id              Int       @id @default(autoincrement())
  startedAt       DateTime  @map("started_at")
  completedAt     DateTime? @map("completed_at")
  vehiclesFound   Int?      @map("vehicles_found")
  vehiclesAdded   Int?      @map("vehicles_added")
  vehiclesUpdated Int?      @map("vehicles_updated")
  vehiclesRemoved Int?      @map("vehicles_removed")
  status          String    @db.VarChar(50)
  errorMessage    String?   @map("error_message") @db.Text
  createdAt       DateTime  @default(now()) @map("created_at")

  @@map("scrape_logs")
}
```

---

## Project Structure

```
el-paseo-auto/
├── app/
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   │
│   ├── inventory/
│   │   ├── page.tsx            # Inventory listing page
│   │   └── [vin]/
│   │       └── page.tsx        # Vehicle detail page (VDP)
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── financing/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout (protected)
│   │   ├── page.tsx            # Dashboard
│   │   ├── inventory/
│   │   │   └── page.tsx        # Manage inventory
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── vehicles/
│       │   ├── route.ts        # GET all vehicles
│       │   └── [vin]/
│       │       └── route.ts    # GET single vehicle
│       │
│       ├── scrape/
│       │   └── route.ts        # POST to trigger scrape
│       │
│       └── contact/
│           └── route.ts        # POST contact form
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeaturedVehicles.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── AboutPreview.tsx
│   │   └── ContactCTA.tsx
│   │
│   ├── inventory/
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleGrid.tsx
│   │   ├── VehicleFilters.tsx
│   │   ├── VehicleGallery.tsx
│   │   └── VehicleSpecs.tsx
│   │
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── ScrapeButton.tsx
│       ├── ScrapeHistory.tsx
│       └── VehicleTable.tsx
│
├── lib/
│   ├── db.ts                   # Database connection
│   ├── scraper.ts              # Scraping logic
│   └── utils.ts                # Helper functions
│
├── public/
│   ├── logo.png                # El Paseo logo
│   └── images/
│
├── prisma/
│   └── schema.prisma
│
├── .env.local                  # Environment variables
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## API Routes

### GET /api/vehicles

Returns all vehicles, with optional filters.

**Query params:**
- `make` - Filter by make
- `minPrice` / `maxPrice` - Price range
- `minYear` / `maxYear` - Year range
- `bodyStyle` - Filter by body style
- `featured` - Only featured vehicles
- `limit` - Number of results
- `offset` - Pagination offset

**Response:**
```json
{
  "vehicles": [...],
  "total": 45,
  "page": 1,
  "perPage": 12
}
```

### GET /api/vehicles/[vin]

Returns single vehicle with all images.

### POST /api/scrape

Triggers a scrape job. Protected route (add basic auth or API key).

**Response:**
```json
{
  "success": true,
  "logId": 123,
  "message": "Scrape started"
}
```

### POST /api/contact

Handles contact form submissions. Send email notification.

---

## Scraper Logic

### Overview

The scraper will:
1. Fetch the inventory listing page from the DWS site
2. Parse each vehicle listing to get the detail page URL
3. Visit each detail page to extract full vehicle data
4. Download and store images
5. Upsert vehicles to database (update existing, add new, mark sold)

### Pseudocode

```typescript
// lib/scraper.ts
import * as cheerio from 'cheerio';

const SOURCE_URL = process.env.SOURCE_SITE_URL;

interface ScrapedVehicle {
  vin: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price?: number;
  mileage?: number;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  bodyStyle?: string;
  engine?: string;
  description?: string;
  features?: string[];
  images: string[];
  sourceUrl: string;
}

export async function scrapeInventory(): Promise<ScrapedVehicle[]> {
  const vehicles: ScrapedVehicle[] = [];
  
  // 1. Fetch inventory listing page
  const listingHtml = await fetch(`${SOURCE_URL}/inventory`).then(r => r.text());
  const $ = cheerio.load(listingHtml);
  
  // 2. Get all vehicle detail URLs
  // NOTE: Selectors will need to be updated based on actual DWS site structure
  const vehicleLinks: string[] = [];
  $('.vehicle-card a, .inventory-item a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/inventory/')) {
      vehicleLinks.push(href.startsWith('http') ? href : `${SOURCE_URL}${href}`);
    }
  });
  
  // 3. Scrape each vehicle detail page
  for (const url of vehicleLinks) {
    try {
      const vehicle = await scrapeVehicleDetail(url);
      if (vehicle) {
        vehicles.push(vehicle);
      }
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
    }
  }
  
  return vehicles;
}

async function scrapeVehicleDetail(url: string): Promise<ScrapedVehicle | null> {
  const html = await fetch(url).then(r => r.text());
  const $ = cheerio.load(html);
  
  // NOTE: These selectors are examples—update based on actual DOM structure
  const vehicle: ScrapedVehicle = {
    vin: $('[data-vin], .vin-number').text().trim(),
    stockNumber: $('[data-stock], .stock-number').text().trim(),
    year: parseInt($('.vehicle-year').text()) || 0,
    make: $('.vehicle-make').text().trim(),
    model: $('.vehicle-model').text().trim(),
    trim: $('.vehicle-trim').text().trim() || undefined,
    price: parsePrice($('.vehicle-price').text()),
    mileage: parseInt($('.vehicle-mileage').text().replace(/\D/g, '')) || undefined,
    exteriorColor: $('.exterior-color').text().trim() || undefined,
    interiorColor: $('.interior-color').text().trim() || undefined,
    transmission: $('.transmission').text().trim() || undefined,
    fuelType: $('.fuel-type').text().trim() || undefined,
    bodyStyle: $('.body-style').text().trim() || undefined,
    engine: $('.engine').text().trim() || undefined,
    description: $('.vehicle-description').text().trim() || undefined,
    features: [],
    images: [],
    sourceUrl: url,
  };
  
  // Get features
  $('.feature-item, .vehicle-feature').each((_, el) => {
    vehicle.features?.push($(el).text().trim());
  });
  
  // Get images
  $('.vehicle-gallery img, .vehicle-photos img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) {
      vehicle.images.push(src.startsWith('http') ? src : `${SOURCE_URL}${src}`);
    }
  });
  
  return vehicle.vin ? vehicle : null;
}

function parsePrice(priceStr: string): number | undefined {
  const match = priceStr.replace(/[,$]/g, '').match(/\d+/);
  return match ? parseInt(match[0]) : undefined;
}
```

### Sync Logic

```typescript
// lib/sync.ts
export async function syncVehicles(scrapedVehicles: ScrapedVehicle[]) {
  const existingVins = await db.vehicle.findMany({ select: { vin: true } });
  const existingVinSet = new Set(existingVins.map(v => v.vin));
  const scrapedVinSet = new Set(scrapedVehicles.map(v => v.vin));
  
  let added = 0, updated = 0, removed = 0;
  
  for (const vehicle of scrapedVehicles) {
    if (existingVinSet.has(vehicle.vin)) {
      // Update existing
      await db.vehicle.update({
        where: { vin: vehicle.vin },
        data: { ...vehicle, updatedAt: new Date() }
      });
      updated++;
    } else {
      // Add new
      await db.vehicle.create({ data: vehicle });
      added++;
    }
  }
  
  // Mark vehicles not in scrape as sold
  for (const vin of existingVinSet) {
    if (!scrapedVinSet.has(vin)) {
      await db.vehicle.update({
        where: { vin },
        data: { isSold: true }
      });
      removed++;
    }
  }
  
  return { added, updated, removed };
}
```

---

## Pages

### Homepage (/)

Sections:
1. **Hero** — Large headline, CTA buttons, stats, featured vehicle image
2. **Brands Bar** — Dark bar showing makes carried
3. **Featured Vehicles** — 3-6 featured vehicle cards
4. **Why Choose Us** — 4 feature boxes (Quality, Pricing, Financing, Returns)
5. **About Preview** — Image + short story + CTA
6. **Contact CTA** — Contact info + simple form

### Inventory (/inventory)

- Filter sidebar (make, price, year, body style)
- Vehicle grid (responsive: 3 cols → 2 cols → 1 col)
- Pagination or infinite scroll
- Sort dropdown (price, year, mileage)

### Vehicle Detail (/inventory/[vin])

- Image gallery with thumbnails
- Vehicle title (Year Make Model Trim)
- Price + MSRP comparison
- Key specs grid
- Full specs accordion
- Features list
- Description
- Contact/inquiry form
- Related vehicles

### Admin Dashboard (/admin)

- Scrape button with status indicator
- Last scrape timestamp
- Quick stats (total vehicles, added today, sold)
- Recent scrape history log
- Vehicle management table

---

## Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/elpaseo"

# Source site to scrape
SOURCE_SITE_URL="https://your-dws-site.com"

# Vercel Blob (for image storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Admin auth (simple approach)
ADMIN_PASSWORD="your-secure-password"

# Contact form (optional: send emails)
RESEND_API_KEY="re_..."
CONTACT_EMAIL="info@elpaseoauto.com"
```

---

## Deployment (Vercel)

### Setup

1. Push repo to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Add Vercel Postgres from Storage tab
5. Run `prisma db push` to create tables

### Cron Job (Auto-scrape)

Create `vercel.json`:

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

This runs the scraper daily at 6 AM UTC.

---

## Getting Started (Local Dev)

```bash
# 1. Create the project
npx create-next-app@latest el-paseo-auto --typescript --tailwind --app

# 2. Install dependencies
cd el-paseo-auto
npm install prisma @prisma/client cheerio
npm install -D @types/cheerio

# 3. Initialize Prisma
npx prisma init

# 4. Copy schema from this doc to prisma/schema.prisma

# 5. For local dev, use SQLite (easier)
# In schema.prisma, change provider to "sqlite"
# In .env, set DATABASE_URL="file:./dev.db"

# 6. Create database
npx prisma db push

# 7. Start dev server
npm run dev
```

---

## Assets Needed

- [x] Logo (provided: epa-logo.png)
- [ ] Favicon (create from logo)
- [ ] Hero background image (or use vehicle image)
- [ ] About section image (showroom/team photo)
- [ ] OG image for social sharing

---

## Notes

- The scraper selectors are placeholder examples—they'll need to be updated once Claude Code can inspect the actual DWS site DOM
- Consider rate limiting the scraper to avoid overwhelming the source site
- Images can be hotlinked initially, but should ideally be copied to Vercel Blob for reliability
- Add basic auth or API key protection to admin routes before going live
