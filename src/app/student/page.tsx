import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowLeft, PlayCircle, Star, TrendingUp, Award, School } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

  // 1. دورات الكورسات العامة
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: userId },
    include: { course: true },
  });

  // 2. الصف الدراسي المسجل به الطالب (مع الربط التلقائي بالصف المختار عند التسجيل)
  let classEnrollments = await prisma.classEnrollment.findMany({
    where: { studentId: userId },
    include: {
      class: {
        include: {
          subjects: {
            include: {
              teacher: true,
              payments: userId ? { where: { studentId: userId } } : false,
              _count: { select: { lectures: true, files: true } },
            },
          },
        },
      },
    },
  });

  if (classEnrollments.length === 0 && user?.gradeName) {
    try {
      let targetClass = await prisma.class.findFirst({
        where: { name: user.gradeName },
      });
      if (!targetClass) {
        targetClass = await prisma.class.create({
          data: {
            name: user.gradeName,
            gradeLevel: user.gradeLevel || 'ثانوي',
            gradeNumber: 1,
            academicYear: '2025-2026',
            status: 'ACTIVE',
          },
        });
      }
      await prisma.classEnrollment.create({
        data: {
          studentId: user.id,
          classId: targetClass.id,
        },
      });
      classEnrollments = await prisma.classEnrollment.findMany({
        where: { studentId: userId },
        include: {
          class: {
            include: {
              subjects: {
                include: {
                  teacher: true,
                  payments: userId ? { where: { studentId: userId } } : false,
                  _count: { select: { lectures: true, files: true } },
                },
              },
            },
          },
        },
      });
    } catch (e) {
      console.error('Auto enroll in dashboard error:', e);
    }
  }

  // 3. المواد المدفوعة
  const subjectPayments = await prisma.subjectPayment.findMany({
    where: { studentId: userId, status: 'COMPLETED' },
    include: {
      subject: {
        include: {
          class: true,
          teacher: true,
          _count: { select: { lectures: true, files: true } },
        },
      },
    },
  });

  // 4. الشهادات
  const certificates = await prisma.certificate.findMany({
    where: { studentId: userId },
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* SaaS Bento Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div className="saas-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.12)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <School size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>صفي الدراسي</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0EA5E9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
              {classEnrollments[0]?.class?.name || user?.gradeName || 'مسجل'}
            </div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(249, 115, 22, 0.12)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>المواد الفعالة</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--foreground)' }}>{subjectPayments.length}</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>الكورسات والشهادات</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--foreground)' }}>{enrollments.length + certificates.length}</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(135deg, #0EA5E9, #1B2B5E)', color: 'white', border: 'none' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>نقاط التفاعل</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{150 + (subjectPayments.length * 50)}</div>
          </div>
        </div>

      </div>

      {/* Grid: School Subjects & Classes */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>موادي الدراسية</h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>المواد التي قمت بالاشتراك بها في صفوفك الدراسية</p>
          </div>
          <Link href="/classes" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
            تصفح الصفوف الدراسية
          </Link>
        </div>

        {subjectPayments.length === 0 ? (
          <div className="saas-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <School size={30} color="#0EA5E9" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>لم تشترك في أي مادة دراسية بعد</h3>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              انضم إلى صفك الدراسي (ابتدائي، إعدادي، ثانوي) واختر المواد التي ترغب في مذاكرتها مع نخبة المدرسين.
            </p>
            <Link href="/classes" className="btn btn-primary">
              عرض كل الصفوف والمواد
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
            {subjectPayments.map(({ subject }) => (
              <div key={subject.id} className="saas-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9' }}>
                      {subject.class?.name || 'صف دراسي'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                      مفعلة
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                    {subject.name}
                  </h3>

                  {subject.teacher && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                      المعلم: <strong style={{ color: 'var(--foreground)' }}>{subject.teacher.name}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                    <span>{subject._count.lectures} محاضرة</span>
                    <span>•</span>
                    <span>{subject._count.files} ملف وملخص</span>
                  </div>
                </div>

                <Link href={`/student/subjects/${subject.id}`} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}>
                  الدخول لمحتوى المادة <ArrowLeft size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Professional Courses Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>الدورات التدريبية المباشرة</h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>الكورسات المهنية التي سجلت بها</p>
          </div>
          <Link href="/courses" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
            تصفح الدورات
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="saas-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <BookOpen size={28} color="var(--muted-foreground)" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>لا توجد دورات تدريبية حالية</h3>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>طوّر مهاراتك من خلال برامجنا ودوراتنا التدريبية الاحترافية.</p>
            <Link href="/courses" className="btn btn-primary">استكشف الكورسات</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {enrollments.map(enroll => (
              <div key={enroll.id} className="saas-card" style={{ display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: '120px', height: '80px', borderRadius: '12px', background: 'var(--muted)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  {enroll.course.thumbnail ? (
                    <img src={enroll.course.thumbnail} alt={enroll.course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PlayCircle color="var(--muted-foreground)" /></div>
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--foreground)' }}>{enroll.course.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                    <span>السعر: ${enroll.course.price}</span>
                    <span>•</span>
                    <span>المدة: {enroll.course.durationWeeks} أسابيع</span>
                  </div>
                </div>
                
                <div>
                  <Link href={`/courses/${enroll.courseId}`} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                    متابعة الدورة <ArrowLeft size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
