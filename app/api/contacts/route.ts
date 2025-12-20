import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const isRead = searchParams.get("isRead");

  const where: {
    type?: string;
    isRead?: boolean;
  } = {};

  if (type && type !== "all") {
    where.type = type;
  }

  if (isRead === "true") {
    where.isRead = true;
  } else if (isRead === "false") {
    where.isRead = false;
  }

  const contacts = await prisma.contactSubmission.findMany({
    where,
    include: {
      vehicle: {
        select: {
          id: true,
          vin: true,
          year: true,
          make: true,
          model: true,
          trim: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, isRead } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { isRead },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await prisma.contactSubmission.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ success: true });
}
