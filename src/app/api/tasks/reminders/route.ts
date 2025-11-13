import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail, taskEmailTemplates } from '@/lib/email';

const prisma = new PrismaClient();

// GET /api/tasks/reminders - إرسال التذكيرات
export async function GET(request: NextRequest) {
  try {
    // التحقق من مفتاح الأمان للـ Cron Job
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let weekRemindersCount = 0;
    let dayRemindersCount = 0;

    // البحث عن المهام التي تحتاج تذكير أسبوعي
    const tasksNeedingWeekReminder = await prisma.task.findMany({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        },
        dueDate: {
          gte: now,
          lte: oneWeekFromNow
        },
        weekReminderSent: false
      },
      include: {
        assignee: {
          select: { name: true, email: true }
        }
      }
    });

    // إرسال التذكيرات الأسبوعية
    for (const task of tasksNeedingWeekReminder) {
      if (task.assignee.email && task.dueDate) {
        const emailTemplate = taskEmailTemplates.weekReminder(
          task.title,
          task.assignee.name,
          task.dueDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        );

        const emailSent = await sendEmail({
          to: task.assignee.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        if (emailSent) {
          await prisma.task.update({
            where: { id: task.id },
            data: { weekReminderSent: true }
          });
          weekRemindersCount++;
        }
      }
    }

    // البحث عن المهام التي تحتاج تذكير يومي
    const tasksNeedingDayReminder = await prisma.task.findMany({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        },
        dueDate: {
          gte: now,
          lte: oneDayFromNow
        },
        dayReminderSent: false
      },
      include: {
        assignee: {
          select: { name: true, email: true }
        }
      }
    });

    // إرسال التذكيرات اليومية
    for (const task of tasksNeedingDayReminder) {
      if (task.assignee.email && task.dueDate) {
        const emailTemplate = taskEmailTemplates.dayReminder(
          task.title,
          task.assignee.name,
          task.dueDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        );

        const emailSent = await sendEmail({
          to: task.assignee.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        if (emailSent) {
          await prisma.task.update({
            where: { id: task.id },
            data: { dayReminderSent: true }
          });
          dayRemindersCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      weekReminders: weekRemindersCount,
      dayReminders: dayRemindersCount,
      message: `تم إرسال ${weekRemindersCount} تذكير أسبوعي و ${dayRemindersCount} تذكير يومي`
    });

  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/tasks/reminders - تشغيل التذكيرات يدوياً (للأدمن فقط)
export async function POST(request: NextRequest) {
  try {
    // يمكن استخدام هذا لتشغيل التذكيرات يدوياً من لوحة الإدارة
    const response = await GET(request);
    return response;
  } catch (error) {
    console.error('Error in manual reminder trigger:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
