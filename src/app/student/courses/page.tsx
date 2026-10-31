import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, PlayCircle, Clock, Award, ArrowLeft, ArrowRight, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentCoursesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: userId },
    include: {
      course: {
        include: {
          instructor: true,
          _count: {
            select: { lectures: true, files: true },
          },
        },
      },
    },
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', display: 'inline-block', marginBottom: '0.4rem' }}>
            الدورات التدريبية المعتمدة
          </span>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
            دوراتي التدريبية
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            الكورسات والبرامج المهارية والتدريبية المسجل بها مع نخبة الخبراء
          </p>
        </div>

        <Link href="/courses" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem' }}>
          تصفح الدورات الجديدة
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="saas-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <BookOpen size={32} color="#0EA5E9" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
            لم تشترك في أي دورة تدريبية بعد
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.75rem', maxWidth: '520px', margin: '0 auto 1.75rem auto', lineHeight: '1.7' }}>
            استكشف مكتبة دورات ProCourse في التأسيس واللغات والمهارات الرقمية مع كبار المحاضرين والمدربين المعتمدين، واحصل على شهادة إتمام موثقة.
          </p>
          <Link href="/courses" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
            تصفح كل الدورات التدريبية المتاحة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
          {enrollments.map(({ course }) => (
            <div key={course.id} className="saas-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Thumbnail or placeholder */}
                <div style={{ width: '100%', height: '170px', borderRadius: '12px', background: 'linear-gradient(135deg, #1B2B5E, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', overflow: 'hidden', position: 'relative' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <BookOpen size={48} color="rgba(255,255,255,0.7)" />
                  )}
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: 'white', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {course.durationWeeks} أسابيع
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {course.title}
                </h3>

                {course.instructor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                    <User size={15} color="#0EA5E9" />
                    <span>المحاضر: <strong style={{ color: 'var(--foreground)' }}>{course.instructor.name}</strong></span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                  <span>{course._count.lectures} محاضرة</span>
                  <span>•</span>
                  <span>{course._count.files} ملفات تدريبية</span>
                </div>
              </div>

              <Link
                href={`/student/courses/${course.id}`}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <PlayCircle size={18} /> متابعة الدورة التدريبية
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
