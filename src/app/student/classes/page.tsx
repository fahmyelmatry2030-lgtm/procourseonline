import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { School, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentClassesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const classEnrollments = await prisma.classEnrollment.findMany({
    where: { studentId: userId },
    include: {
      class: {
        include: {
          subjects: {
            include: {
              teacher: true,
              payments: { where: { studentId: userId, status: 'COMPLETED' } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
            صفوفي الدراسية
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            الصفوف والمراحل التعليمية المسجل بها حالياً
          </p>
        </div>
        <Link href="/classes" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
          تسجيل في صف جديد
        </Link>
      </div>

      {classEnrollments.length === 0 ? (
        <div className="saas-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <School size={48} color="#0EA5E9" style={{ margin: '0 auto 1.25rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>لم تسجل في أي صف مدرسي بعد</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            يمكنك تصفح الصفوف الدراسية لجميع المراحل (ابتدائي، إعدادي، ثانوي) والتسجيل مجاناً.
          </p>
          <Link href="/classes" className="btn btn-primary">
            تصفح كل الصفوف الدراسية
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
          {classEnrollments.map(({ class: cls }) => {
            const paidSubjectsCount = cls.subjects.filter(s => s.payments.length > 0).length;

            return (
              <div key={cls.id} className="saas-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9' }}>
                      المرحلة {cls.gradeLevel}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                      {cls.academicYear}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--foreground)', marginBottom: '0.75rem' }}>
                    {cls.name}
                    {cls.section && <span style={{ fontSize: '1rem', color: 'var(--muted-foreground)', marginRight: '0.5rem' }}>({cls.section})</span>}
                  </h3>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={16} color="#0EA5E9" /> {cls.subjects.length} مواد بالصف
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                      {paidSubjectsCount} مواد مفعلة
                    </span>
                  </div>
                </div>

                <Link href={`/classes/${cls.id}`} className="btn btn-outline" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}>
                  عرض مواد الصف والاشتراك <ArrowLeft size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
