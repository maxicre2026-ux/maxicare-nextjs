import { NextRequest, NextResponse } from 'next/server';
import { setupTaskReminders } from '@/lib/cron';

// GET /api/cron/setup - إعداد المهام المجدولة
export async function GET(request: NextRequest) {
  try {
    // التحقق من أن هذا طلب من الخادم المحلي أو من مدير النظام
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'admin-secret';
    
    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // إعداد نظام التذكيرات
    setupTaskReminders();

    return NextResponse.json({
      success: true,
      message: 'تم إعداد نظام التذكيرات بنجاح',
      info: 'سيتم تشغيل التذكيرات كل ساعة تلقائياً'
    });

  } catch (error) {
    console.error('Error setting up cron jobs:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/cron/setup - إعادة تشغيل المهام المجدولة
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'admin-secret';
    
    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // إعادة إعداد النظام
    setupTaskReminders();

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تشغيل نظام التذكيرات بنجاح'
    });

  } catch (error) {
    console.error('Error restarting cron jobs:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
