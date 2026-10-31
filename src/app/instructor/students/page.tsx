import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Users, Phone, MessageCircle, BookOpen, Calendar, Search } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InstructorStudentsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  // Get all courses by this instructor
  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      enrollments: {
        include: {
          student: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const studentsList = courses.flatMap(c => 
    c.enrollments.map(e => ({
      enrollmentId: e.id,
      courseTitle: c.title,
      enrolledAt: e.createdAt,
      student: e.student,
    }))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
          <Link href="/instructor" className="hover:text-[#0EA5E9] transition-colors">لوحة التحكم</Link>
          <span>/</span>
          <span className="text-slate-600">سجل الطلاب والمشتركين</span>
        </div>
        <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
          <Users className="text-[#0EA5E9]" size={26} />
          الطلاب المشتركون
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          متابعة بيانات وتواصل الطلاب المسجلين في دوراتك التعليمية وحصصك
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">إجمالي الاشتراكات</div>
            <div className="text-xl font-black text-[#1B2B5E]">{studentsList.length} طالب</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">الدورات الفعالة</div>
            <div className="text-xl font-black text-[#1B2B5E]">{courses.length} دورة</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">العام الدراسي</div>
            <div className="text-xl font-black text-[#1B2B5E]">2025 - 2026</div>
          </div>
        </div>
      </div>

      {/* Table */}
      {studentsList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-black text-[#1B2B5E] mb-1">لا يوجد طلاب مسجلون بعد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            بمجرد اشتراك الطلاب في دوراتك أو صفوفك، ستظهر بياناتهم وأرقام هواتفهم للتواصل المباشر هنا.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                  <th className="p-4">اسم الطالب</th>
                  <th className="p-4">الدورة / المادة</th>
                  <th className="p-4">المحافظة والصف</th>
                  <th className="p-4">رقم الطالب وولي الأمر</th>
                  <th className="p-4">تاريخ التسجيل</th>
                  <th className="p-4 text-center">التواصل السريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentsList.map(item => (
                  <tr key={item.enrollmentId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-[#1B2B5E]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0EA5E9] font-black flex items-center justify-center text-sm">
                          {(item.student.name || 'ط').charAt(0)}
                        </div>
                        <div>
                          <div>{item.student.name || 'طالب جديد'}</div>
                          <div className="text-[11px] text-slate-400">{item.student.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-semibold">{item.courseTitle}</td>
                    <td className="p-4 text-slate-600">
                      <div>{item.student.gradeName || item.student.gradeLevel || 'غير محدد'}</div>
                      <div className="text-[11px] text-slate-400">{item.student.governorate || 'مصر'}</div>
                    </td>
                    <td className="p-4 text-slate-600" dir="ltr">
                      <div>{item.student.phone}</div>
                      {item.student.parentPhone && (
                        <div className="text-[11px] text-slate-400">ولي الأمر: {item.student.parentPhone}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(item.enrolledAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={`https://wa.me/20${item.student.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition-colors"
                      >
                        <MessageCircle size={14} />
                        واتساب
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
