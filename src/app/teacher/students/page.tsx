import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Users, Phone, MessageCircle, MapPin, School } from 'lucide-react';

export default async function TeacherStudentsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  // Fetch subjects of this teacher with their enrolled students
  const mySubjects = await prisma.subject.findMany({
    where: { teacherId: userId },
    include: {
      class: true,
      payments: {
        include: {
          student: true,
        },
      },
    },
  });

  // Extract unique students
  const studentsMap = new Map();
  mySubjects.forEach((s) => {
    s.payments.forEach((p) => {
      if (!studentsMap.has(p.student.id)) {
        studentsMap.set(p.student.id, {
          ...p.student,
          subjectName: s.name,
          className: s.class?.name || 'عام',
        });
      }
    });
  });

  const students = Array.from(studentsMap.values());

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/teacher" className="hover:text-[#0EA5E9] transition-colors">لوحة المعلم</Link>
            <span>/</span>
            <span className="text-slate-600">سجل الطلاب</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <Users className="text-[#0EA5E9]" size={26} />
            سجل الطلاب والتواصل مع أولياء الأمور
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            قائمة الطلاب المسجلين في موادك المدرسية وأرقام هواتف أولياء الأمور للمتابعة الدورية
          </p>
        </div>
        <div className="px-4 py-2 bg-sky-50 text-[#0EA5E9] rounded-2xl font-black text-sm border border-sky-100 self-start sm:self-auto">
          إجمالي الطلاب: {students.length}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm font-bold">لا يوجد طلاب مسجلون في موادك حالياً.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                  <th className="py-4 px-6">اسم الطالب</th>
                  <th className="py-4 px-6">هاتف الطالب</th>
                  <th className="py-4 px-6">هاتف ولي الأمر</th>
                  <th className="py-4 px-6">المادة والصف الدراسي</th>
                  <th className="py-4 px-6">المحافظة</th>
                  <th className="py-4 px-6">متابعة ولي الأمر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{st.name || 'طالب'}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600" dir="ltr">{st.phone}</td>
                    <td className="py-4 px-6 font-mono text-xs text-amber-600 font-bold" dir="ltr">
                      {st.parentPhone || 'غير مسجل'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700">
                      {st.subjectName} ({st.className})
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                      {st.governorate || 'مصر'}
                    </td>
                    <td className="py-4 px-6">
                      {st.parentPhone ? (
                        <a
                          href={`https://wa.me/20${st.parentPhone.replace(/^0+/, '')}?text=${encodeURIComponent(`السلام عليكم ورحمة الله، ولي أمر الطالب (${st.name})، معكم معلم مادة (${st.subjectName}) بخصوص متابعة مستوى الطالب...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black hover:bg-emerald-100 transition-colors"
                        >
                          <MessageCircle size={14} />
                          <span>واتساب ولي الأمر</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">غير متوفر</span>
                      )}
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
