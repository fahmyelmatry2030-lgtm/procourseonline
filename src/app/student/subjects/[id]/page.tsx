import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Video, FileText, ArrowRight, User, Calendar, ExternalLink, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      class: true,
      teacher: true,
      lectures: { orderBy: { createdAt: 'asc' } },
      files: { orderBy: { createdAt: 'desc' } },
      payments: { where: { studentId: userId, status: 'COMPLETED' } },
    },
  });

  if (!subject) notFound();

  // التحقق من أن الطالب قام بدفع المادة أو المادة مجانية
  const hasAccess = subject.price === 0 || subject.payments.length > 0;
  if (!hasAccess) {
    redirect(`/payment/subject/${subject.id}`);
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/student"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
        >
          <ArrowRight size={16} /> العودة للوحة التحكم
        </Link>
      </div>

      {/* Header Card */}
      <div className="saas-card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(27,43,94,0.04) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,165,233,0.15)', color: '#0EA5E9', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              {subject.class.name} — {subject.class.academicYear}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)', margin: '0 0 0.5rem 0' }}>
              مادة {subject.name}
            </h1>
            {subject.description && (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '1rem', maxWidth: '700px', lineHeight: '1.6', margin: 0 }}>
                {subject.description}
              </p>
            )}
          </div>

          {subject.teacher && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--card)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {(subject.teacher.name || 'م').charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>معلم المادة</div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--foreground)' }}>{subject.teacher.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid: Lectures & Files */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]" style={{ gap: '2rem' }}>
        
        {/* Lectures List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Video size={22} color="#0EA5E9" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
              المحاضرات والدروس ({subject.lectures.length})
            </h2>
          </div>

          {subject.lectures.length === 0 ? (
            <div className="saas-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <Video size={36} color="var(--muted-foreground)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem' }}>لا توجد محاضرات متاحة بعد</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>يقوم المعلم برفع الدروس وجدولتها قريباً.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subject.lectures.map((lecture, idx) => (
                <div key={lecture.id} className="saas-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: 'var(--foreground)' }}>
                        {lecture.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                        <span>نوع الدرس: {lecture.type === 'LIVE' ? 'بث مباشر 🔴' : 'تسجيل مسجل 📹'}</span>
                        {lecture.date && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={13} /> {new Date(lecture.date).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {lecture.videoUrl ? (
                      <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                        مشاهدة الفيديو <ExternalLink size={15} />
                      </a>
                    ) : lecture.liveUrl ? (
                      <a href={lecture.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                        دخول البث المباشر <ExternalLink size={15} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>قريباً</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files & Attachments */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FileText size={22} color="#F97316" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
              الملخصات والمذكرات ({subject.files.length})
            </h2>
          </div>

          {subject.files.length === 0 ? (
            <div className="saas-card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <FileText size={32} color="var(--muted-foreground)" style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>لم يتم رفع ملفات لهذه المادة بعد.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subject.files.map(file => (
                <div key={file.id} className="saas-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: 'var(--foreground)' }}>{file.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>نوع الملف: {file.type}</span>
                  </div>
                  <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                    تحميل <Download size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
