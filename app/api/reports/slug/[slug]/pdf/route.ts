import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import puppeteer from "puppeteer";
import { generateReportPDFHTML } from "@/lib/generate-report-pdf";

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

    // Get base URL for assets
    const baseUrl = new URL(request.url).origin;

    // Build the HTML content for the PDF
    const html = generateReportPDFHTML({ ...report, subjectImageUrl }, baseUrl);

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
