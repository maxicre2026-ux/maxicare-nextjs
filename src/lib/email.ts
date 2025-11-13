import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

// إنشاء transporter للبريد الإلكتروني
const createTransporter = () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP configuration missing. Email sending disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: parseInt(SMTP_PORT || '587') === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn('Email transporter not configured');
    return false;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// قوالب البريد الإلكتروني للمهام
export const taskEmailTemplates = {
  taskAssigned: (taskTitle: string, assigneeName: string, creatorName: string) => ({
    subject: `مهمة جديدة: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">مهمة جديدة تم تعيينها لك</h2>
        <p>مرحباً ${assigneeName},</p>
        <p>تم تعيين مهمة جديدة لك من قبل ${creatorName}:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">${taskTitle}</h3>
        </div>
        <p>يرجى تسجيل الدخول إلى النظام لمراجعة تفاصيل المهمة.</p>
        <p>مع تحيات فريق MaxiCare</p>
      </div>
    `,
  }),

  taskCompleted: (taskTitle: string, assigneeName: string, creatorName: string) => ({
    subject: `تم إنجاز المهمة: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">تم إنجاز المهمة بنجاح</h2>
        <p>مرحباً ${creatorName},</p>
        <p>تم إنجاز المهمة التالية من قبل ${assigneeName}:</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #15803d; margin-top: 0;">${taskTitle}</h3>
        </div>
        <p>يمكنك مراجعة تفاصيل المهمة في النظام.</p>
        <p>مع تحيات فريق MaxiCare</p>
      </div>
    `,
  }),

  taskStatusChanged: (taskTitle: string, newStatus: string, assigneeName: string) => ({
    subject: `تحديث حالة المهمة: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">تحديث حالة المهمة</h2>
        <p>تم تحديث حالة المهمة التالية:</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #991b1b; margin-top: 0;">${taskTitle}</h3>
          <p><strong>الحالة الجديدة:</strong> ${newStatus}</p>
          <p><strong>المكلف:</strong> ${assigneeName}</p>
        </div>
        <p>مع تحيات فريق MaxiCare</p>
      </div>
    `,
  }),

  weekReminder: (taskTitle: string, assigneeName: string, dueDate: string) => ({
    subject: `⏰ تذكير: مهمة تنتهي خلال أسبوع - ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">🔔 تذكير بمهمة قادمة</h2>
        <p>مرحباً ${assigneeName},</p>
        <p>نذكرك بأن لديك مهمة ستنتهي خلال أسبوع:</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin-top: 0;">${taskTitle}</h3>
          <p style="color: #92400e; margin: 10px 0;"><strong>موعد الانتهاء:</strong> ${dueDate}</p>
          <p style="color: #92400e; margin: 0;"><strong>الوقت المتبقي:</strong> أسبوع واحد</p>
        </div>
        <p>يرجى التأكد من إنجاز المهمة في الوقت المحدد.</p>
        <p>مع تحيات فريق MaxiCare</p>
      </div>
    `,
  }),

  dayReminder: (taskTitle: string, assigneeName: string, dueDate: string) => ({
    subject: `🚨 عاجل: مهمة تنتهي غداً - ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 تذكير عاجل</h2>
        <p>مرحباً ${assigneeName},</p>
        <p><strong>تنبيه مهم:</strong> لديك مهمة ستنتهي غداً!</p>
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #991b1b; margin-top: 0;">${taskTitle}</h3>
          <p style="color: #991b1b; margin: 10px 0;"><strong>موعد الانتهاء:</strong> ${dueDate}</p>
          <p style="color: #991b1b; margin: 0;"><strong>الوقت المتبقي:</strong> يوم واحد فقط!</p>
        </div>
        <p style="color: #dc2626; font-weight: bold;">يرجى إنجاز هذه المهمة على وجه السرعة لتجنب التأخير.</p>
        <p>مع تحيات فريق MaxiCare</p>
      </div>
    `,
  }),
};
