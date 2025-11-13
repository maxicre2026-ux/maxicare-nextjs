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

// GET /api/tasks/[id] - جلب مهمة محددة
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // التحقق من الصلاحيات
    if (user.role !== 'ADMIN' && task.assigneeId !== user.id && task.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/tasks/[id] - تحديث مهمة
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate, assigneeId } = body;

    // جلب المهمة الحالية
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } }
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // التحقق من الصلاحيات
    if (user.role !== 'ADMIN' && existingTask.creatorId !== user.id && existingTask.assigneeId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // تحديث المهمة
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } }
      }
    });

    // إرسال بريد إلكتروني عند تغيير الحالة إلى مكتملة
    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      if (existingTask.creator.email && existingTask.creator.id !== user.id) {
        const emailTemplate = taskEmailTemplates.taskCompleted(
          updatedTask.title,
          updatedTask.assignee.name,
          updatedTask.creator.name
        );
        
        await sendEmail({
          to: existingTask.creator.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    }

    // إرسال بريد إلكتروني عند تغيير المكلف بالمهمة
    if (assigneeId && assigneeId !== existingTask.assigneeId) {
      if (updatedTask.assignee.email && updatedTask.assignee.id !== user.id) {
        const emailTemplate = taskEmailTemplates.taskAssigned(
          updatedTask.title,
          updatedTask.assignee.name,
          user.name
        );
        
        await sendEmail({
          to: updatedTask.assignee.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - حذف مهمة
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // فقط منشئ المهمة أو الأدمن يمكنه حذفها
    if (user.role !== 'ADMIN' && task.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
