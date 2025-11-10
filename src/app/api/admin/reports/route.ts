import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/db";

// GET comprehensive report
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const doctor = searchParams.get("doctor");
  const clientEmail = searchParams.get("clientEmail");

  // Build filter
  const filter: any = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.gte = new Date(startDate);
    if (endDate) filter.date.lte = new Date(endDate);
  }
  if (doctor) filter.doctor = { contains: doctor, mode: "insensitive" };

  // User filter for clientEmail
  const userFilter: any = {};
  if (clientEmail) {
    userFilter.email = { contains: clientEmail, mode: "insensitive" };
  }

  // Fetch appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      ...filter,
      user: userFilter,
    },
    include: {
      user: {
        include: {
          payments: true,
        },
      },
      reportFiles: true,
    },
    orderBy: { date: "desc" },
  });

  // Fetch all payments
  const payments = await prisma.payment.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch expenses
  const expenseFilter: any = {};
  if (startDate || endDate) {
    expenseFilter.date = {};
    if (startDate) expenseFilter.date.gte = new Date(startDate);
    if (endDate) expenseFilter.date.lte = new Date(endDate);
  }

  const expenses = await prisma.expense.findMany({
    where: expenseFilter,
    orderBy: { date: "desc" },
  });

  // Calculate totals
  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return NextResponse.json({
    appointments,
    payments,
    expenses,
    summary: {
      totalAppointments: appointments.length,
      totalIncome,
      totalExpenses,
      netProfit,
    },
  });
}
