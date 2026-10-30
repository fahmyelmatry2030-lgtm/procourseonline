import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Users, GraduationCap, Lock, CheckCircle, ArrowLeft, User } from 'lucide-react';
import { enrollInClassAction } from '@/actions/school';

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const cls = await prisma.class.findUnique({
    where: { id },
    include: {
      subjects: {
        include: {
          teacher: true,
          payments: userId ? { where: { studentId: userId } } : false,
          _count: { select: { lectures: true, files: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      enrollments: true,
    },
  });

  if (!cls) notFound();

  const isEnrolled = userId
    ? cls.enrollments.some(e => e.studentId === userId)
    : false;

  const gradeLevelColors: Record<string, string> = {
    'ابتدائي': '#0EA5E9',
    'إعدادي': '#F97316',
    'ثانوي': '#1B2B5E',
  };
  const color = gradeLevelColors[cls.gradeLevel] || '#0EA5E9';

  return (
    <div className="bg-[#F8FAFF] min-h-screen">

      {/* Hero */}
      <div className="py-16" style={{ background: `linear-gradient(135deg, ${color}15 0%, #F8FAFF 100%)` }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/classes" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0EA5E9] text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> العودة للصفوف
          </Link>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-4" style={{ background: `${color}15`, color }}>
                <GraduationCap size={14} /> المرحلة {cls.gradeLevel} — {cls.academicYear}
              </div>
              <h1 className="text-4xl font-black text-[#1B2B5E] mb-3">
                {cls.name}
                {cls.section && <span className="text-2xl text-slate-400 mr-3">({cls.section})</span>}
              </h1>
              {cls.description && (
                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">{cls.description}</p>
              )}

              <div className="flex items-center gap-8 mt-6">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <BookOpen size={18} style={{ color }} />
                  <span>{cls.subjects.length} مادة دراسية</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Users size={18} style={{ color }} />
                  <span>{cls.enrollments.length} طالب مسجل</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="w-full lg:w-80 friendly-card p-6 border border-slate-100">
              {isEnrolled ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">أنت مسجل في هذا الصف!</h3>
                  <p className="text-slate-400 text-sm mb-4">يمكنك الوصول لجميع المواد والدفع لكل مادة على حدة</p>
                  <Link href="/student" className="btn btn-primary w-full">
                    لوحة الطالب
                  </Link>
                </div>
              ) : userId ? (
                <div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">سجل في هذا الصف</h3>
                  <p className="text-slate-400 text-sm mb-5">التسجيل في الصف مجاني — تدفع على كل مادة على حدة</p>
                  <form action={async () => {
                    'use server';
                    await enrollInClassAction(id);
                  }}>
                    <button type="submit" className="btn btn-primary w-full">
                      سجل الآن مجاناً
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <Lock size={32} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="font-black text-slate-800 mb-2">سجل دخول أولاً</h3>
                  <p className="text-slate-400 text-sm mb-4">تحتاج لحساب للتسجيل في الصف</p>
                  <Link href="/login" className="btn btn-primary w-full">تسجيل الدخول</Link>
                  <Link href="/register" className="btn btn-outline w-full mt-3">إنشاء حساب</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-black text-[#1B2B5E] mb-8">المواد الدراسية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cls.subjects.map(subject => {
            const isPaid = (subject as any).payments?.length > 0;

            return (
              <div key={subject.id} className="friendly-card border border-slate-100 overflow-hidden">
                {/* Subject Header */}
                <div className="p-5 border-b border-slate-50">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                    >
                      {subject.name.charAt(0)}
                    </div>
                    {isPaid ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                        ✓ مدفوعة
                      </span>
                    ) : subject.price > 0 ? (
                      <span className="text-sm font-black" style={{ color }}>
                        ${subject.price}
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                        مجاني
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-[#1B2B5E]">{subject.name}</h3>
                  {subject.description && (
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{subject.description}</p>
                  )}
                </div>

                {/* Teacher & Stats */}
                <div className="p-5">
                  {subject.teacher && (
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: color }}
                      >
                        {(subject.teacher.name || 'م').charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-600">{subject.teacher.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                    <span>{(subject as any)._count.lectures} محاضرة</span>
                    <span>{(subject as any)._count.files} ملف</span>
                  </div>

                  {isEnrolled && !isPaid && subject.price > 0 && (
                    <Link
                      href={`/payment/subject/${subject.id}`}
                      className="btn btn-primary w-full text-sm py-2.5"
                    >
                      ادفع واشترك — ${subject.price}
                    </Link>
                  )}
                  {isEnrolled && (isPaid || subject.price === 0) && (
                    <Link
                      href={`/student/subjects/${subject.id}`}
                      className="btn btn-secondary w-full text-sm py-2.5"
                    >
                      ادخل للمادة
                    </Link>
                  )}
                  {!isEnrolled && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Lock size={14} />
                      <span>سجل في الصف أولاً</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {cls.subjects.length === 0 && (
          <div className="friendly-card p-12 text-center text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">لم تُضف مواد لهذا الصف بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
