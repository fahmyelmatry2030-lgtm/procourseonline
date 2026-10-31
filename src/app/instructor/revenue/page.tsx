import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, Wallet, CheckCircle, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InstructorRevenuePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      enrollments: {
        include: { student: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrollments.length, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.enrollments.length * c.price), 0);
  const availablePayout = Math.round(totalRevenue * 0.85); // 85% instructor share

  return (
    <div className="space-y-6 animate-fade-in pb-12" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
          <Link href="/instructor" className="hover:text-[#0EA5E9] transition-colors">لوحة التحكم</Link>
          <span>/</span>
          <span className="text-slate-600">الأرباح والمستحقات المالية</span>
        </div>
        <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
          <DollarSign className="text-emerald-500" size={26} />
          الأرباح والمحفظة المالية
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          متابعة إيرادات اشتراكات الطلاب وطلب سحب المستحقات المالية عبر فودافون كاش أو إنستاباي
        </p>
      </div>

      {/* Financial Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold mb-1">إجمالي الإيرادات</div>
            <div className="text-2xl font-black text-[#1B2B5E]">{totalRevenue.toLocaleString()} ج.م</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">من {totalEnrollments} اشتراك</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center font-bold">
            <Wallet size={28} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold mb-1">الرصيد المتاح للسحب</div>
            <div className="text-2xl font-black text-[#0EA5E9]">{availablePayout.toLocaleString()} ج.م</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">جاهز للتحويل الفوري</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold mb-1">طرق الاستلام المعتمدة</div>
            <div className="text-sm font-black text-[#1B2B5E]">Vodafone Cash / InstaPay</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">تحويل يومي أو أسبوعي</div>
          </div>
          <button className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
            طلب سحب
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <h2 className="text-base font-black text-[#1B2B5E] mb-4">سجل العمليات والاشتراكات الأخيرة</h2>

        {totalEnrollments === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد أي عمليات دفع مسجلة حتى الآن.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-sm">
            {courses.flatMap(c => c.enrollments).slice(0, 10).map((en, idx) => (
              <div key={en.id || idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-xs">اشتراك طالب: {en.student?.name || 'طالب'}</div>
                    <div className="text-[11px] text-slate-400">{new Date(en.createdAt).toLocaleDateString('ar-EG')}</div>
                  </div>
                </div>
                <div className="font-black text-sm text-emerald-600">
                  + {courses.find(c => c.id === en.classId || c.title)?.price || 0} ج.م
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
