import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail, taskEmailTemplates } from '@/lib/email';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// استخراج معلومات المستخدم من التوكن
function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('token')?.value;
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch {
    return null;
  }
}

// GET /api/tasks - جلب جميع المهام
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');

    const where: any = {};
    
    // إذا كان المستخدم ليس أدمن، يرى فقط المهام المكلف بها أو التي أنشأها
    if (user.role !== 'ADMIN') {
      where.OR = [
        { assigneeId: user.id },
        { creatorId: user.id }
      ];
    }

    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - إنشاء مهمة جديدة
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, assigneeId, priority, dueDate } = body;

    if (!title || !assigneeId) {
      return NextResponse.json(
        { error: 'Title and assigneeId are required' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم المكلف
    const assignee = await prisma.user.findUnique({
      where: { id: assigneeId },
      select: { id: true, name: true, email: true }
    });

    if (!assignee) {
      return NextResponse.json(
        { error: 'Assignee not found' },
        { status: 404 }
      );
    }

    // إنشاء المهمة
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId,
        creatorId: user.id,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // إرسال بريد إلكتروني للمكلف بالمهمة
    if (assignee.email && assignee.id !== user.id) {
      const emailTemplate = taskEmailTemplates.taskAssigned(
        task.title,
        assignee.name,
        user.name
      );
      
      await sendEmail({
        to: assignee.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
