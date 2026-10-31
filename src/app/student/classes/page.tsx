import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { School, BookOpen, ArrowLeft, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentClassPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) redirect('/login');

  // البحث عن الصفوف المسجل بها الطالب
  let classEnrollments = await prisma.classEnrollment.findMany({
    where: { studentId: userId },
    include: {
      class: {
        include: {
          subjects: {
            include: {
              teacher: true,
              payments: { where: { studentId: userId, status: 'COMPLETED' } },
              _count: { select: { lectures: true, files: true } },
            },
          },
        },
      },
    },
  });

  // إذا لم يكن مسجلاً في صف بعد وكان قد اختار صفاً عند التسجيل، يتم ربطه تلقائياً فوراً
  if (classEnrollments.length === 0 && user.gradeName) {
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

      // إعادة الجلب بعد الربط التلقائي
      classEnrollments = await prisma.classEnrollment.findMany({
        where: { studentId: userId },
        include: {
          class: {
            include: {
              subjects: {
                include: {
                  teacher: true,
                  payments: { where: { studentId: userId, status: 'COMPLETED' } },
                  _count: { select: { lectures: true, files: true } },
                },
              },
            },
          },
        },
      });
    } catch (e) {
      console.error('Auto enrollment error in page:', e);
    }
  }

  // الصف الحالي المختار للطالب
  const currentEnrollment = classEnrollments[0];
  const currentClass = currentEnrollment?.class;
  const gradeDisplayName = user.gradeName || currentClass?.name || 'الصف الدراسي';
  const stageDisplayName = user.gradeLevel || currentClass?.gradeLevel || 'المرحلة الدراسية';

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9' }}>
              المرحلة {stageDisplayName}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} /> مسجل ومفعل
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
            صفي الدراسي: <span style={{ color: '#0EA5E9' }}>{gradeDisplayName}</span>
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            الصف الدراسي المعتمد الخاص بك ومواده المقررة للعام الدراسي 2025 - 2026
          </p>
        </div>
      </div>

      {/* بطاقة الصف الرئيسية للطالب */}
      <div className="saas-card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(27,43,94,0.04))', border: '1px solid rgba(14,165,233,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #0EA5E9, #1B2B5E)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(14,165,233,0.25)' }}>
              <GraduationCap size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.35rem 0' }}>{gradeDisplayName}</h2>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                <span>📍 المحافظة: <strong>{user.governorate || 'مصر'}</strong></span>
                <span>•</span>
                <span>📚 المرحلة: <strong>{stageDisplayName}</strong></span>
                <span>•</span>
                <span>📅 العام: <strong>2025 - 2026</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قسم المواد الدراسية التابعة للصف */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
          المواد الدراسية المقررة لصفك
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
          قائمة المواد الدراسية التابعة لـ {gradeDisplayName} للمتابعة وحضور المحاضرات المباشرة
        </p>
      </div>

      {currentClass && currentClass.subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
          {currentClass.subjects.map((subject) => {
            const isPaid = subject.payments.length > 0;
            return (
              <div key={subject.id} className="saas-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: isPaid ? 'rgba(16,185,129,0.1)' : 'rgba(249,115,22,0.1)', color: isPaid ? '#10B981' : '#F97316' }}>
                      {isPaid ? 'مادة مفعلة' : 'متاحة للاشتراك'}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--foreground)' }}>
                      {subject.price === 0 ? 'مجاناً' : `${subject.price} ج.م`}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    {subject.name}
                  </h4>

                  {subject.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1rem', lineHeight: '1.6' }}>
                      {subject.description}
                    </p>
                  )}

                  {subject.teacher && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem' }}>
                      المعلم: <strong style={{ color: 'var(--foreground)' }}>{subject.teacher.name}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                    <span>{subject._count.lectures} محاضرة</span>
                    <span>•</span>
                    <span>{subject._count.files} ملخص واختبار</span>
                  </div>
                </div>

                <Link
                  href={isPaid ? `/student/subjects/${subject.id}` : `/payment/subject/${subject.id}`}
                  className={`btn ${isPaid ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isPaid ? 'الدخول للمحاضرات والواجبات' : 'الاشتراك في المادة وتفعيلها'} <ArrowLeft size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="saas-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} color="#0EA5E9" style={{ margin: '0 auto 1.25rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            أهلاً بك في {gradeDisplayName}!
          </h3>
          <p style={{ color: 'var(--muted-foreground)', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: '1.7' }}>
            تم تفعيل حسابك بنجاح في صفك الدراسي. يقوم المعلمون حالياً بإضافة وتحديث جدول المواد والمحاضرات للعام الدراسي الجديد.
          </p>
          <Link href="/courses" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            تصفح الدورات التدريبية المتاحة الآن
          </Link>
        </div>
      )}

    </div>
  );
}
