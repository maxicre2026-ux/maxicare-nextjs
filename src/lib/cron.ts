// مكتبة إدارة المهام المجدولة (Cron Jobs)
import cron from 'node-cron';

class CronManager {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  // تشغيل مهمة مجدولة
  schedule(name: string, cronExpression: string, task: () => Promise<void>) {
    // إيقاف المهمة إذا كانت موجودة مسبقاً
    this.stop(name);

    const scheduledTask = cron.schedule(cronExpression, async () => {
      console.log(`[${new Date().toISOString()}] تشغيل المهمة المجدولة: ${name}`);
      try {
        await task();
        console.log(`[${new Date().toISOString()}] تم إنجاز المهمة المجدولة بنجاح: ${name}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] خطأ في المهمة المجدولة ${name}:`, error);
      }
    }, {
      scheduled: false // لا تبدأ تلقائياً
    });

    this.jobs.set(name, scheduledTask);
    scheduledTask.start();
    
    console.log(`تم جدولة المهمة: ${name} مع التعبير: ${cronExpression}`);
    return scheduledTask;
  }

  // إيقاف مهمة مجدولة
  stop(name: string) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      console.log(`تم إيقاف المهمة المجدولة: ${name}`);
    }
  }

  // إيقاف جميع المهام المجدولة
  stopAll() {
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`تم إيقاف المهمة المجدولة: ${name}`);
    });
    this.jobs.clear();
  }

  // الحصول على قائمة المهام النشطة
  getActiveJobs(): string[] {
    return Array.from(this.jobs.keys());
  }

  // التحقق من وجود مهمة
  hasJob(name: string): boolean {
    return this.jobs.has(name);
  }
}

// إنشاء مثيل واحد من مدير المهام المجدولة
export const cronManager = new CronManager();

// دالة لإعداد التذكيرات التلقائية
export function setupTaskReminders() {
  const cronSecret = process.env.CRON_SECRET || 'default-secret';
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // تشغيل التذكيرات كل ساعة
  cronManager.schedule('task-reminders', '0 * * * *', async () => {
    try {
      const response = await fetch(`${baseUrl}/api/tasks/reminders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('نتيجة التذكيرات:', result);
      } else {
        console.error('فشل في تشغيل التذكيرات:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('خطأ في استدعاء API التذكيرات:', error);
    }
  });

  console.log('تم إعداد نظام التذكيرات التلقائي');
}

// دالة لإيقاف جميع المهام عند إغلاق التطبيق
export function cleanup() {
  cronManager.stopAll();
  console.log('تم إيقاف جميع المهام المجدولة');
}

// معالجة إشارات النظام لإيقاف المهام بشكل صحيح
if (typeof process !== 'undefined') {
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
