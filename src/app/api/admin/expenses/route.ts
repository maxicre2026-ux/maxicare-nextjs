import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET all expenses
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
  });
  
  return NextResponse.json({ expenses });
}

// POST create new expense
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { description, amount, category, date } = body;

  if (!description || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      description,
      amount: parseFloat(amount),
      category: category || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json({ expense });
}
