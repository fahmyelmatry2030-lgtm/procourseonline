import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Award, CheckCircle2, HelpCircle, Plus, FileText } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InstructorQuizzesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  const quizzes = await prisma.quiz.findMany({
    include: {
      course: true,
      questions: true,
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
            <span className="text-slate-600">بنك الاختبارات والكويزات</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <Award className="text-[#0EA5E9]" size={26} />
            الاختبارات والواجبات الإلكترونية
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            إعداد الامتحانات الدورية، وتحديد الدرجات والتصحيح التلقائي لإجابات الطلاب
          </p>
        </div>

        <Link
          href="/instructor/courses"
          className="btn inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-5 py-3 rounded-2xl font-bold shadow-md shadow-sky-500/20 text-sm"
        >
          <Plus size={18} />
          إنشاء كويز جديد
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <HelpCircle size={32} />
          </div>
          <h3 className="text-lg font-black text-[#1B2B5E] mb-1">لا توجد اختبارات مضافة حالياً</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 font-medium">
            قم بإنشاء كويزات تقييمية بنظام الاختيار من متعدد والأسئلة المقالية لقياس مستوى الطلاب بدقة.
          </p>
          <Link
            href="/instructor/courses"
            className="btn inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
          >
            إضافة كويز لدورة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#0EA5E9] bg-sky-50 px-2.5 py-1 rounded-lg block w-fit mb-2">
                  {q.course?.title || 'عام'}
                </span>
                <h4 className="font-black text-base text-[#1B2B5E] mb-2">{q.title}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-semibold">
                  <span>عدد الأسئلة: {q.questions?.length || 0}</span>
                  <span>الدرجة الكلية: {q.totalGrade || 100}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> كويز نشط
                </span>
                <button className="text-xs font-bold text-[#0EA5E9] hover:underline">
                  معاينة الأسئلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
