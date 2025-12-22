import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import puppeteer from "puppeteer";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const reportId = parseInt(id);

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const report = await prisma.priceReport.findUnique({
    where: { id: reportId },
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

  if (!report) {
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
    <img class="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAADJCAYAAAD/w0wTAAAEt2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjYwMCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIwMSIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICB0aWZmOkltYWdlV2lkdGg9IjYwMCIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjAxIgogICB0aWZmOlJlc29sdXRpb25Vbml0PSIyIgogICB0aWZmOlhSZXNvbHV0aW9uPSI3Mi8xIgogICB0aWZmOllSZXNvbHV0aW9uPSI3Mi8xIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI1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" alt="El Paseo Auto Group" />
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
