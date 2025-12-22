import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import puppeteer from "puppeteer";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const report = await prisma.priceReport.findUnique({
    where: { slug },
    include: {
      comps: {
        orderBy: { price: "desc" },
      },
      vehicle: {
        include: {
          images: {
            orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
            take: 1,
          },
        },
      },
    },
  });

  if (!report || report.status === "draft") {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Generate PDF using Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Get subject image: prefer custom URL, then linked vehicle's image
    const subjectImageUrl =
      report.subjectImageUrl || report.vehicle?.images?.[0]?.url || null;

    // Build the HTML content for the PDF
    const html = generatePDFHTML({ ...report, subjectImageUrl });

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      printBackground: true,
    });

    await browser.close();

    const vehicleTitle = `${report.year} ${report.make} ${report.model}`;
    const filename = `${vehicleTitle.replace(/\s+/g, "-")}-Market-Report.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    await browser.close();
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-US").format(mileage);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

interface Report {
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
  mileage: number | null;
  condition: string | null;
  notes: string | null;
  subjectImageUrl: string | null;
  suggestedPrice: import("@prisma/client").Prisma.Decimal | null;
  priceRangeLow: import("@prisma/client").Prisma.Decimal | null;
  priceRangeHigh: import("@prisma/client").Prisma.Decimal | null;
  createdAt: Date;
  comps: {
    id: number;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    mileage: number | null;
    price: import("@prisma/client").Prisma.Decimal;
    source: string | null;
    sourceUrl: string | null;
    imageUrl: string | null;
    notes: string | null;
  }[];
}

function generatePDFHTML(report: Report): string {
  const vehicleTitle = `${report.year} ${report.make} ${report.model}${report.trim ? ` ${report.trim}` : ""}`;

  const suggestedPrice = report.suggestedPrice
    ? Number(report.suggestedPrice)
    : null;
  const priceRangeLow = report.priceRangeLow
    ? Number(report.priceRangeLow)
    : null;
  const priceRangeHigh = report.priceRangeHigh
    ? Number(report.priceRangeHigh)
    : null;

  const comps = report.comps.map((c) => ({
    ...c,
    price: Number(c.price),
  }));

  const compStats =
    comps.length > 0
      ? {
          average: comps.reduce((sum, c) => sum + c.price, 0) / comps.length,
          low: Math.min(...comps.map((c) => c.price)),
          high: Math.max(...comps.map((c) => c.price)),
        }
      : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1A1A1A;
      line-height: 1.5;
      font-size: 11pt;
    }
    .header {
      background: #1A1A1A;
      color: white;
      padding: 30px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header .logo {
      width: 200px;
      height: auto;
      margin-bottom: 20px;
    }
    .header .label {
      color: #D4A84B;
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    .header h1 {
      font-size: 18pt;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .header .date {
      color: rgba(255,255,255,0.6);
      font-size: 10pt;
    }
    .section {
      background: white;
      border: 1px solid #eee;
      padding: 25px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section h2 {
      font-size: 14pt;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1A1A1A;
    }
    .price-main {
      text-align: center;
      padding: 20px 0;
    }
    .price-label {
      font-size: 10pt;
      color: #4A4A4A;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .price-value {
      font-size: 32pt;
      font-weight: 700;
      color: #D4A84B;
    }
    .price-range {
      color: #4A4A4A;
      margin-top: 8px;
    }
    .stats-grid {
      display: flex;
      gap: 20px;
      background: #F8F6F3;
      padding: 15px;
      margin: 20px 0;
    }
    .stats-item {
      flex: 1;
      text-align: center;
    }
    .stats-item .label {
      font-size: 9pt;
      color: #4A4A4A;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    .stats-item .value {
      font-size: 14pt;
      font-weight: 600;
    }
    .stats-item .value.highlight {
      color: #D4A84B;
    }
    .details-grid {
      display: flex;
      gap: 30px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    .detail-item {
      text-align: center;
    }
    .detail-item .label {
      font-size: 9pt;
      color: #4A4A4A;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    .detail-item .value {
      font-weight: 600;
    }
    .comps-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .comp-card {
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .comp-image {
      width: 100%;
      height: 120px;
      object-fit: cover;
      background: #f5f5f5;
    }
    .comp-content {
      padding: 12px;
    }
    .comp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }
    .comp-title {
      font-weight: 600;
      font-size: 10pt;
      color: #1A1A1A;
    }
    .comp-trim {
      color: #4A4A4A;
      font-size: 9pt;
    }
    .comp-price {
      font-weight: 600;
      color: #D4A84B;
      white-space: nowrap;
    }
    .comp-details {
      display: flex;
      gap: 12px;
      margin-top: 8px;
      font-size: 9pt;
      color: #4A4A4A;
    }
    .comp-notes {
      color: #8A8A8A;
      font-size: 9pt;
      margin-top: 6px;
    }
    .comp-link {
      color: #D4A84B;
      text-decoration: none;
    }
    .comp-link:hover {
      text-decoration: underline;
    }
    .subject-image {
      width: 100%;
      max-height: 280px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      color: #8A8A8A;
      font-size: 9pt;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .company {
      font-weight: 600;
      color: #1A1A1A;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <svg class="logo" viewBox="0 0 1166.21 390.14" xmlns="http://www.w3.org/2000/svg">
      <defs><style>.logo-white{fill:#fff}.logo-gold{fill:#f5b754}</style></defs>
      <path class="logo-gold" d="M239.55,286.04c-1.06.36-3.78-1.48-3.6-2.46.14-.73.54-.61,1.12-.24.67.44,2.47,1.78,2.47,2.69M339.06,285.59c1.38,3.18,3.37,6.39,3.6,9.89-2.24-1.76-2.64-5.64-3.63-8.2-.07-.2-2.33-1.61.03-1.69M888.74,295.36c-.37.38-5.77,3.9-6.14,3.99l-1.37-.94c1.43-1.37,5.58-5.7,7.65-4.5.63.36.18,1.11-.14,1.45M810.07,252.76c.91.97-2.55,1.59-3.04,1.68-1.11.21-2.25.07-3.38.21-1.45.19-2.56,1.39-4.38.35-.81-3.72,10.17-2.92,10.8-2.24M803.77,312.13c.41,3.26-1.7,5.79-2.02,9.01-7.14,2.02-1.23-5.76-.02-8.56l2.04-.44ZM792.97,251.41c.48,1.4-1.43.92-1.74,1.42-.3.49.26,1.61-.5,2.41-.91.96-7.71.94-8.92.34-.74-.37-3.33-4.08-1.8-4.75,2.82-1.26,9.49,1.55,12.96.58M766.04,262.3c.77-.48,6.93.45,5.76,1.7-3.97,1.63-7.72.88-11.89.42l-.69,1.63c-1.24.91-5.43-.96-7.13-1.03-1.76-.08-6.72,1.67-5.73-1.47,2.32,1.17,5.09-1.82,6.31-1.79,1.38.04,2.05,3.15,5.64,2.05.81-.25,1.16-1.07,2.45-1.19,1.57-.14,3.71,1.14,4.45.91.55-.17.58-1.07.82-1.22M792.06,259.05c-4.12.36-8.25.24-12.38.46-4.22.21-9.39.92-13.53.91-3.64,0-7.63-1.24-11.46-.47,1.95-3.12,6.29-1.1,9.69-1.33,8.42-.56,14.86-.66,23.4-.43,1.42.04,4.1-1.61,4.28.86"/>
      <g>
        <path class="logo-white" d="M44.13,151.14h99.87v-19.62H44.13v19.62ZM44.13,86.61h98.31v-19.62H44.13v19.62ZM44.13,22.07h99.87V2.45H44.13v19.62Z"/>
        <path class="logo-white" d="M841.15,151.14h99.87v-19.62h-99.87v19.62ZM841.15,86.61h98.31v-19.62h-98.31v19.62ZM841.15,22.07h99.87V2.45h-99.87v19.62Z"/>
        <polygon class="logo-white" points="284 151.14 284 131.52 216.45 131.52 216.45 2.45 194.16 2.45 194.16 151.14 284 151.14"/>
        <path class="logo-white" d="M471.56,48.15c0,15.6-11.36,26.08-27.41,26.08h-37.46V22.07h37.46c16.05,0,27.41,10.48,27.41,26.09ZM406.69,151.14v-57.29h40.35c30.32,0,47.48-20.95,47.48-45.69S477.58,2.45,447.04,2.45h-62.64v148.69h22.29Z"/>
        <polygon class="logo-white" points="576.38 37.96 624.98 151.14 649.5 151.14 583.9 2.13 569.03 2.27 503.48 151.14 528 151.14 576.38 37.96"/>
        <path class="logo-white" d="M681.77,130.19c12.71,14.04,32.1,23.63,58.63,23.63,40.13,0,56.18-21.63,56.18-44.81,0-31.65-28.31-39.23-52.61-45.69-18.5-4.68-34.55-8.92-34.55-22.3,0-12.48,11.37-20.95,27.86-20.95s31.66,5.35,43.03,17.39l12.93-16.49c-13.15-13.37-31.21-20.73-54.17-20.73-30.99,0-52.61,17.84-52.61,42.36,0,30.32,27.64,37.23,51.5,43.46,18.95,4.91,35.89,9.37,35.89,24.97,0,10.7-8.47,22.96-32.55,22.96-20.73,0-36.78-9.81-46.82-20.95l-12.71,17.17Z"/>
        <path class="logo-white" d="M1115.36,76.91c0,32.55-20.51,57.06-51.94,57.06s-51.94-24.52-51.94-57.06,20.06-57.07,51.94-57.07,51.94,24.3,51.94,57.07ZM988.52,76.91c0,44.14,30.54,76.9,74.9,76.9s74.9-32.77,74.9-76.9S1107.78,0,1063.42,0s-74.9,32.77-74.9,76.91Z"/>
        <polygon class="logo-gold" points="318.62 61.16 322.51 73.14 335.1 73.14 324.91 80.54 328.81 92.52 318.62 85.11 308.44 92.52 312.33 80.54 302.14 73.14 314.73 73.14 318.62 61.16"/>
        <path class="logo-white" d="M226.28,377.66h-25.04l-4.73,11.57h-4.51l19.26-47.05h5.01l19.26,47.05h-4.51l-4.73-11.57ZM202.51,373.99h22.5l-11.29-27.86-11.22,27.86Z"/>
        <path class="logo-white" d="M280.76,342.18h4.09v28.92c0,9.52,5.01,15.3,14.25,15.3s14.25-5.78,14.25-15.3v-28.92h4.09v28.99c0,11.64-6.21,18.9-18.34,18.9s-18.34-7.34-18.34-18.9v-28.99Z"/>
        <path class="logo-white" d="M379.47,345.85h-15.38v-3.67h34.85v3.67h-15.38v43.38h-4.09v-43.38Z"/>
        <path class="logo-white" d="M466.67,341.4c13.75,0,22.85,10.58,22.85,24.34s-9.1,24.34-22.85,24.34-22.85-10.58-22.85-24.34,9.03-24.34,22.85-24.34ZM466.67,345.07c-11.43,0-18.62,8.75-18.62,20.67s7.19,20.67,18.62,20.67,18.62-8.82,18.62-20.67-7.34-20.67-18.62-20.67Z"/>
        <path class="logo-white" d="M597.77,341.4c7.76,0,13.4,3.1,17.71,8.04l-3.03,2.18c-3.31-3.95-8.67-6.56-14.67-6.56-11.07,0-19.61,8.4-19.61,20.67s8.53,20.74,19.61,20.74c6.28,0,11.22-3.1,13.83-5.71v-11.22h-17.85v-3.67h21.87v16.43c-4.23,4.66-10.44,7.83-17.85,7.83-13.26,0-23.84-9.88-23.84-24.41s10.58-24.34,23.84-24.34Z"/>
        <path class="logo-white" d="M678.56,369.76h-10.37v19.47h-4.02v-47.05h17.56c8.11,0,14.32,5.15,14.32,13.75s-6.07,13.26-13.05,13.54l13.62,19.75h-4.87l-13.19-19.47ZM681.38,345.85h-13.19v20.24h13.19c6.21,0,10.44-4.23,10.44-10.15s-4.23-10.09-10.44-10.09Z"/>
        <path class="logo-white" d="M765.48,341.4c13.75,0,22.86,10.58,22.86,24.34s-9.1,24.34-22.86,24.34-22.85-10.58-22.85-24.34,9.03-24.34,22.85-24.34ZM765.48,345.07c-11.43,0-18.62,8.75-18.62,20.67s7.2,20.67,18.62,20.67,18.62-8.82,18.62-20.67-7.34-20.67-18.62-20.67Z"/>
        <path class="logo-white" d="M836.61,342.18h4.09v28.92c0,9.52,5.01,15.3,14.25,15.3s14.25-5.78,14.25-15.3v-28.92h4.09v28.99c0,11.64-6.21,18.9-18.34,18.9s-18.34-7.34-18.34-18.9v-28.99Z"/>
        <path class="logo-white" d="M923.32,342.18h17.63c9.03,0,14.18,6.35,14.18,13.75s-5.22,13.75-14.18,13.75h-13.61v19.54h-4.02v-47.05ZM940.53,345.85h-13.19v20.17h13.19c6.21,0,10.37-4.16,10.37-10.08s-4.16-10.09-10.37-10.09Z"/>
        <polygon class="logo-gold" points="155.09 357.33 157.14 363.65 163.78 363.65 158.41 367.56 160.46 373.87 155.09 369.97 149.72 373.87 151.77 367.56 146.4 363.65 153.04 363.65 155.09 357.33"/>
        <polygon class="logo-gold" points="992.52 357.33 994.57 363.65 1001.21 363.65 995.84 367.56 997.89 373.87 992.52 369.97 987.14 373.87 989.19 367.56 983.82 363.65 990.47 363.65 992.52 357.33"/>
      </g>
    </svg>
    <div class="label">Market Analysis Report</div>
    <h1>${vehicleTitle}</h1>
    <div class="date">Prepared ${formatDate(report.createdAt)}</div>
  </div>

  ${report.subjectImageUrl ? `<img src="${report.subjectImageUrl}" alt="${vehicleTitle}" class="subject-image" />` : ""}

  <div class="section">
    <h2>Valuation Summary</h2>
    ${
      suggestedPrice
        ? `
    <div class="price-main">
      <div class="price-label">Suggested Market Value</div>
      <div class="price-value">${formatPrice(suggestedPrice)}</div>
      ${
        priceRangeLow && priceRangeHigh
          ? `<div class="price-range">Range: ${formatPrice(priceRangeLow)} – ${formatPrice(priceRangeHigh)}</div>`
          : ""
      }
    </div>
    `
        : ""
    }

    <div class="details-grid">
      ${report.mileage ? `<div class="detail-item"><div class="label">Mileage</div><div class="value">${formatMileage(report.mileage)}</div></div>` : ""}
      ${report.condition ? `<div class="detail-item"><div class="label">Condition</div><div class="value">${report.condition}</div></div>` : ""}
      ${report.vin ? `<div class="detail-item"><div class="label">VIN</div><div class="value" style="font-family: monospace; font-size: 10pt;">${report.vin}</div></div>` : ""}
    </div>

    ${report.notes ? `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;"><div class="price-label">Notes</div><p style="color: #4A4A4A;">${report.notes}</p></div>` : ""}
  </div>

  ${
    comps.length > 0
      ? `
  <div class="section">
    <h2>Comparable Vehicles (${comps.length})</h2>

    ${
      compStats
        ? `
    <div class="stats-grid">
      <div class="stats-item">
        <div class="label">Low</div>
        <div class="value">${formatPrice(compStats.low)}</div>
      </div>
      <div class="stats-item">
        <div class="label">Average</div>
        <div class="value highlight">${formatPrice(compStats.average)}</div>
      </div>
      <div class="stats-item">
        <div class="label">High</div>
        <div class="value">${formatPrice(compStats.high)}</div>
      </div>
    </div>
    `
        : ""
    }

    <div class="comps-grid">
      ${comps
        .map(
          (comp) => `
        <div class="comp-card">
          ${comp.imageUrl ? `<img src="${comp.imageUrl}" alt="${comp.year} ${comp.make} ${comp.model}" class="comp-image" />` : ""}
          <div class="comp-content">
            <div class="comp-header">
              <div>
                <div class="comp-title">${comp.year} ${comp.make} ${comp.model}</div>
                ${comp.trim ? `<div class="comp-trim">${comp.trim}</div>` : ""}
              </div>
              <div class="comp-price">${formatPrice(comp.price)}</div>
            </div>
            <div class="comp-details">
              ${comp.mileage ? `<span>${formatMileage(comp.mileage)} mi</span>` : ""}
              ${comp.source ? (comp.sourceUrl ? `<a href="${comp.sourceUrl}" target="_blank" class="comp-link">${comp.source}</a>` : `<span>${comp.source}</span>`) : ""}
            </div>
            ${comp.notes ? `<div class="comp-notes">${comp.notes}</div>` : ""}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
  `
      : ""
  }

  <div class="footer">
    <div class="company">El Paseo Auto Group</div>
    <div>73180 El Paseo, Palm Desert, CA 92260 | (760) 636-0885</div>
    <div style="margin-top: 10px;">This report is for informational purposes only. Market values may vary based on condition, location, and market conditions.</div>
  </div>
</body>
</html>
  `;
}
