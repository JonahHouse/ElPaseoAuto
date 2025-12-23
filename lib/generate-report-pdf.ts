import type { Prisma } from "@prisma/client";

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

export interface ReportData {
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
  mileage: number | null;
  condition: string | null;
  notes: string | null;
  subjectImageUrl: string | null;
  suggestedPrice: Prisma.Decimal | null;
  priceRangeLow: Prisma.Decimal | null;
  priceRangeHigh: Prisma.Decimal | null;
  createdAt: Date;
  comps: {
    id: number;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    mileage: number | null;
    price: Prisma.Decimal;
    source: string | null;
    sourceUrl: string | null;
    imageUrl: string | null;
    notes: string | null;
  }[];
}

export function generateReportPDFHTML(report: ReportData, baseUrl: string): string {
  const logoUrl = `${baseUrl}/logos/epa-logo-white.png`;
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
    <img src="${logoUrl}" alt="El Paseo Auto Group" class="logo" />
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
