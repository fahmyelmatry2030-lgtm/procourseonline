import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { BookOpen, Plus, Users, Star, DollarSign, Calendar, Eye, Settings, ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InstructorCoursesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      enrollments: true,
      reviews: true,
      lectures: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/instructor" className="hover:text-[#0EA5E9] transition-colors">لوحة التحكم</Link>
            <span>/</span>
            <span className="text-slate-600">إدارة الدورات التدريبية</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <BookOpen className="text-[#0EA5E9]" size={26} />
            دوراتي التدريبية
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            إدارة كافة الدورات والمحاضرات المنشورة ومتابعة أعداد المشتركين
          </p>
        </div>

        <Link
          href="/instructor/courses/new"
          className="btn inline-flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-5 py-3 rounded-2xl font-bold shadow-md shadow-sky-500/20 transition-all text-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          إنشاء دورة تدريبية جديدة
        </Link>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="w-20 h-20 bg-sky-50 text-[#0EA5E9] rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={36} />
          </div>
          <h2 className="text-xl font-black text-[#1B2B5E] mb-2">لا توجد أي دورات تدريبية مضافة حتى الآن</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 font-medium">
            ابدأ بنشر دورتك التدريبية الأولى لتصل إلى آلاف الطلاب وتقدم محاضراتك المباشرة وتمنحهم شهادات معتمدة.
          </p>
          <Link
            href="/instructor/courses/new"
            className="btn inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-sky-500/20 text-sm"
          >
            <Plus size={18} />
            إنشاء دورة جديدة الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const studentCount = course.enrollments.length;
            const revenue = studentCount * course.price;
            const avgRating =
              course.reviews.length > 0
                ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1)
                : '5.0';

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                      {course.status === 'OPEN' ? 'متاحة للتسجيل' : 'نشطة'}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(course.startDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#1B2B5E] mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2 leading-relaxed">
                    {course.shortDescription || course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl mb-4 text-center">
                    <div>
                      <div className="text-[11px] text-slate-400 font-bold mb-0.5">الطلاب</div>
                      <div className="font-black text-sm text-[#1B2B5E] flex items-center justify-center gap-1">
                        <Users size={13} className="text-[#0EA5E9]" />
                        {studentCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-bold mb-0.5">المحاضرات</div>
                      <div className="font-black text-sm text-[#1B2B5E]">
                        {course.lectures.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-bold mb-0.5">التقييم</div>
                      <div className="font-black text-sm text-amber-500 flex items-center justify-center gap-1">
                        <Star size={13} fill="currentColor" />
                        {avgRating}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">سعر الاشتراك</span>
                    <span className="text-base font-black text-[#0EA5E9]">
                      {course.price > 0 ? `${course.price} ج.م` : 'مجانية'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                      title="معاينة كطالب"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="px-3.5 py-2 bg-[#1B2B5E] hover:bg-[#111c3e] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      إدارة المحتوى
                      <ArrowLeft size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
