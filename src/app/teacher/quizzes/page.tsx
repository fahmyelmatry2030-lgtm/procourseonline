import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Award, Plus, BookOpen, CheckCircle2 } from 'lucide-react';

export default async function TeacherQuizzesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const mySubjects = await prisma.subject.findMany({
    where: { teacherId: userId },
    include: { class: true },
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/teacher" className="hover:text-[#0EA5E9] transition-colors">لوحة المعلم</Link>
            <span>/</span>
            <span className="text-slate-600">الواجبات وبنك الأسئلة</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <Award className="text-[#0EA5E9]" size={26} />
            الواجبات المدرسية والاختبارات الدورية
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            إعداد الاختبارات الإلكترونية والواجبات الأسبوعية وتصحيحها لطلاب صفوفك
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center mx-auto mb-4">
          <Award size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-1">بنك الأسئلة والواجبات المدرسية</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          يمكنك إضافة واجبات واختبارات لطلابك في المواد المسندة إليك: {mySubjects.map(s => s.name).join('، ') || 'المناهج المدرسية'}.
        </p>
        <button
          className="px-5 py-2.5 bg-[#1B2B5E] text-white font-black text-xs rounded-2xl inline-flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>إنشاء واجب جديد</span>
        </button>
      </div>
    </div>
  );
}
