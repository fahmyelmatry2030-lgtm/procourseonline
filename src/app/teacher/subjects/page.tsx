import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { School, BookOpen, Users, PlayCircle, FileText } from 'lucide-react';

export default async function TeacherSubjectsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const mySubjects = await prisma.subject.findMany({
    where: { teacherId: userId },
    include: {
      class: true,
      lectures: true,
      files: true,
      payments: true,
    },
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/teacher" className="hover:text-[#0EA5E9] transition-colors">لوحة المعلم</Link>
            <span>/</span>
            <span className="text-slate-600">صفوفي وموادي الدراسية</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <School className="text-[#0EA5E9]" size={26} />
            المناهج والمواد المدرسية المسندة إليك
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            إدارة المناهج والصفوف المدرسية وإرفاق المذكرات وتجهيز الحصص الأسبوعية
          </p>
        </div>
        <div className="px-4 py-2 bg-sky-50 text-[#0EA5E9] rounded-2xl font-black text-sm border border-sky-100 self-start sm:self-auto">
          إجمالي المواد: {mySubjects.length}
        </div>
      </div>

      {mySubjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm font-bold">لم يتم ربط مواد دراسية بحسابك بعد. تواصل مع إدارة المنصة لإسناد صفوفك الدراسية.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mySubjects.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-sky-50 text-[#0EA5E9] font-bold rounded-lg text-xs">
                    {s.class?.gradeLevel || 'مرحلة مدرسية'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{s.class?.name}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{s.name}</h3>
                <div className="space-y-2 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400"><Users size={14} /> الطلاب المسجلون:</span>
                    <span>{s.payments.length} طالب</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400"><PlayCircle size={14} /> الحصص والدروس:</span>
                    <span>{s.lectures.length} حصة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400"><FileText size={14} /> المذكرات والملفات:</span>
                    <span>{s.files.length} ملف PDF</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
