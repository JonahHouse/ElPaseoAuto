import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, message, vehicleId, vehicleTitle, type = "general" } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        type,
        vehicleId: vehicleId || null,
      },
    });

    // Send email notification
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendContactNotification({
        name,
        email,
        phone,
        message,
        type,
        vehicleTitle,
      });
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: "Your message has been received. We'll be in touch soon!",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
