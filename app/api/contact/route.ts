import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendContactNotification } from "@/lib/email";
import { isValidEmail, isValidPhone } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, message, vehicleId, vehicleTitle, type = "general" } = body;

    // Validate required fields (message optional for vehicle inquiries)
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // For non-vehicle inquiries, message is required
    if (type !== "vehicle_inquiry" && !message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate phone format (if provided)
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid phone number" },
        { status: 400 }
      );
    }

    // Default message for vehicle inquiries if not provided
    const finalMessage = message || (type === "vehicle_inquiry" && vehicleTitle
      ? `I'm interested in the ${vehicleTitle}. Please contact me with more information.`
      : "");

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: finalMessage,
        type,
        vehicleId: vehicleId || null,
      },
    });

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      await sendContactNotification({
        name,
        email,
        phone,
        message: finalMessage,
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
