import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Video, BookOpen, AlertCircle, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentSchedulePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      classEnrollments: {
        include: {
          class: {
            include: {
              subjects: {
                include: {
                  teacher: true,
                  lectures: {
                    orderBy: { date: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect('/login');

  const currentEnrollment = user.classEnrollments[0];
  const currentClass = currentEnrollment?.class;
  const gradeName = user.gradeName || currentClass?.name || 'الصف الدراسي';

  // أيام الأسبوع المدرسية
  const days = [
    { id: 'sat', name: 'السبت', short: 'سبت' },
    { id: 'sun', name: 'الأحد', short: 'أحد' },
    { id: 'mon', name: 'الإثنين', short: 'إثنين' },
    { id: 'tue', name: 'الثلاثاء', short: 'ثلاثاء' },
    { id: 'wed', name: 'الأربعاء', short: 'أربعاء' },
    { id: 'thu', name: 'الخميس', short: 'خميس' },
  ];

  // تجميع المحاضرات المجدولة الحقيقية من قاعدة البيانات
  const liveLectures = (currentClass?.subjects || []).flatMap(subject => 
    subject.lectures.map(lecture => ({
      id: lecture.id,
      title: lecture.title,
      subjectName: subject.name,
      teacherName: subject.teacher?.name || 'مدرس المادة',
      type: lecture.type,
      liveStatus: lecture.liveStatus,
      videoUrl: lecture.videoUrl,
      liveUrl: lecture.liveUrl,
      date: lecture.date,
      duration: lecture.duration || 60,
    }))
  );

  // جدول حصص أسبوعي منظم ومتوافق مع صف الطالب (افتراضي إذا لم يتم إدخال جدول بعد)
  const defaultSchedule = [
    {
      day: 'السبت',
      subject: 'اللغة العربية',
      teacher: 'أ. محمود سامي',
      time: '05:00 م - 06:30 م',
      status: 'SCHEDULED',
      topic: 'النحو والبلاغة - المراجعة التأسيسية',
      liveUrl: 'https://meet.google.com',
    },
    {
      day: 'السبت',
      subject: 'الرياضيات',
      teacher: 'أ. أحمد السيد',
      time: '07:00 م - 08:30 م',
      status: 'SCHEDULED',
      topic: 'الجبر وحساب المثلثات - الوحدة الأولى',
      liveUrl: 'https://meet.google.com',
    },
    {
      day: 'الأحد',
      subject: 'اللغة الإنجليزية',
      teacher: 'أ. سارة خالد',
      time: '04:30 م - 06:00 م',
      status: 'SCHEDULED',
      topic: 'Unit 1: Grammar & Vocabulary Practice',
      liveUrl: 'https://meet.google.com',
    },
    {
      day: 'الإثنين',
      subject: 'العلوم المتكاملة / الفيزياء',
      teacher: 'د. خالد السعيد',
      time: '06:00 م - 07:30 م',
      status: 'SCHEDULED',
      topic: 'المعادلات والقوى والحركة والتفاعلات',
      liveUrl: 'https://meet.google.com',
    },
    {
      day: 'الثلاثاء',
      subject: 'التاريخ / الدراسات',
      teacher: 'أ. إبراهيم عادل',
      time: '05:00 م - 06:30 م',
      status: 'SCHEDULED',
      topic: 'الحضارات القديمة والتطور الحديث',
      liveUrl: 'https://meet.google.com',
    },
    {
      day: 'الأربعاء',
      subject: 'الفلسفة والمنطق',
      teacher: 'أ. هاني فوزي',
      time: '06:30 م - 08:00 م',
      status: 'SCHEDULED',
      topic: 'مبادئ التفكير الفلسفي والمنطقي',
      liveUrl: 'https://meet.google.com',
    },
    {
      day: 'الخميس',
      subject: 'ورشة مراجعة أسبوعية واختبار تجريبي',
      teacher: 'نخبة المدرسين',
      time: '05:00 م - 07:00 م',
      status: 'SCHEDULED',
      topic: 'حل نماذج الامتحانات وتدريبات الواجب الأسبوعي',
      liveUrl: 'https://meet.google.com',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9' }}>
              جدول العام الدراسي 2025 - 2026
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(249,115,22,0.12)', color: '#F97316' }}>
              {gradeName}
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
            جدول الحصص والمواعيد الأسبوعي
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            مواعيد الحصص المباشرة واللقاءات التفاعلية الخاصة بصفك الدراسي
          </p>
        </div>

        {/* Quick Action */}
        <Link href="/student/classes" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
          عرض مواد الصف الدراسي
        </Link>
      </div>

      {/* تنبيه الحصة المباشرة القادمة اليوم */}
      <div className="saas-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(27,43,94,0.05) 100%)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(14,165,233,0.3)' }}>
            <Video size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#EF4444' }}>البث المباشر القادم</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>
              حصة مراجعة النحو واللغة العربية — بث تفاعلي مباشر
            </h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
              <span>👨‍🏫 أ. محمود سامي</span>
              <span>•</span>
              <span>⏰ 05:00 مساءً بتوقيت مصر</span>
              <span>•</span>
              <span>⏱️ المدة: 90 دقيقة</span>
            </div>
          </div>
        </div>

        <a
          href="https://meet.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Video size={17} /> دخول البث المباشر الآن
        </a>
      </div>

      {/* تفاصيل الجدول الأسبوعي */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
          مواعيد الحصص المقررة طوال الأسبوع
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
          جميع الحصص يتم تسجيلها تلقائياً بعد انتهاء البث لمشاهدتها في أي وقت
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {defaultSchedule.map((item, index) => (
          <div
            key={index}
            className="saas-card"
            style={{
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
              borderRight: '4px solid #0EA5E9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: '220px' }}>
              <div style={{ textAlign: 'center', minWidth: '70px', padding: '0.5rem 0.75rem', background: 'rgba(14,165,233,0.08)', borderRadius: '12px' }}>
                <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '900', color: '#0EA5E9' }}>{item.day}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>أسبوعياً</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(27,43,94,0.08)', color: '#1B2B5E' }}>
                  {item.subject}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0.4rem 0 0.2rem 0', color: 'var(--foreground)' }}>
                  {item.topic}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                  المعلم: <strong style={{ color: 'var(--foreground)' }}>{item.teacher}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', fontWeight: '700', fontSize: '0.9rem', background: 'var(--muted)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                <Clock size={16} color="#0EA5E9" /> {item.time}
              </div>

              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                رابط الحصة <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* صندوق الملاحظات والإرشادات */}
      <div className="saas-card" style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <CheckCircle2 size={24} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#10B981', margin: '0 0 0.25rem 0' }}>
            نصيحة للمذاكرة والالتزام
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-foreground)', margin: 0, lineHeight: '1.6' }}>
            احرص على التواجد قبل موعد الحصة بـ 5 دقائق وتجهيز كشكول الملاحظات. في حال فاتك أي درس مباشر، يمكنك مشاهدة التسجيل الكامل للمحاضرة في أي وقت من صفحة "صفي الدراسي".
          </p>
        </div>
      </div>

    </div>
  );
}
