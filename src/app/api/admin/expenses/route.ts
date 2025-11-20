import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET all expenses
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });
    
    return NextResponse.json({ expenses });
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ 
      expenses: [],
      error: error.message 
    }, { status: 200 }); // Return empty array if table doesn't exist yet
  }
}

// POST create new expense
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { description, amount, category, date, doctor, kind } = body;

    if (!description || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data: any = {
      description,
      amount: typeof amount === "number" ? amount : parseFloat(amount),
      category: category || null,
      date: date ? new Date(date) : new Date(),
    };

    if (doctor) {
      data.doctor = doctor;
    }

    if (kind === "DOCTOR") {
      data.kind = "DOCTOR";
    } else {
      data.kind = "GENERAL";
    }

    const expense = await prisma.expense.create({
      data,
    });

    return NextResponse.json({ expense });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create expense" 
    }, { status: 500 });
  }
}
