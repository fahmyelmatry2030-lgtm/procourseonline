import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, ArrowRight, ShieldCheck, Smartphone, Zap, Ticket, CheckCircle2 } from 'lucide-react';
import { payForSubjectAction } from '@/actions/school';

export const dynamic = 'force-dynamic';

export default async function SubjectPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/login');

  let subject: any = null;
  try {
    subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        class: true,
        teacher: true,
        payments: { where: { studentId: userId, status: 'COMPLETED' } },
      },
    });
  } catch (error) {
    console.error('Error fetching subject for payment:', error);
  }

  if (!subject) notFound();
  
  // إذا كان الطالب مشتركاً بالفعل
  if (subject.payments && subject.payments.length > 0) {
    redirect(`/student/subjects/${subject.id}`);
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4">
        
        <Link 
          href="/student/classes" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0EA5E9] text-sm font-bold mb-6 transition-colors"
        >
          <ArrowRight size={16} /> العودة لصفحة صفي الدراسي
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-sky-50 text-[#0EA5E9] inline-block mb-3">
              {subject.class?.name}
            </span>
            <h1 className="text-2xl font-black text-[#1B2B5E] mb-1">الاشتراك في مادة {subject.name}</h1>
            <p className="text-slate-500 text-sm font-medium">
              تفعيل حضور الحصص المباشرة والواجبات والاختبارات
            </p>
          </div>

          {/* Details Box */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-3 border border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">المادة المقررة</span>
              <span className="font-bold text-slate-800">{subject.name}</span>
            </div>
            {subject.teacher && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">معلم المادة</span>
                <span className="font-bold text-slate-800">{subject.teacher.name}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">مدة الاشتراك</span>
              <span className="font-bold text-emerald-600">اشتراك الشهر الحالي (متاح لجميع الحصص والملفات)</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200">
              <span className="text-slate-700 font-black text-base">المبلغ الإجمالي</span>
              <div className="text-left">
                <span className="text-2xl font-black text-[#0EA5E9]">
                  {subject.price === 0 ? 'مجاناً' : `${subject.price} ج.م`}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-xs sm:text-sm font-bold mb-6 border border-emerald-200">
            <ShieldCheck size={20} className="shrink-0 text-emerald-600" />
            <span>تفعيل فوري ودائم للمحاضرات المباشرة والواجبات فور تأكيد العملية.</span>
          </div>

          {/* Form */}
          <form action={payForSubjectAction} className="space-y-4">
            <input type="hidden" name="subjectId" value={id} />

            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700 block mb-2">
                اختر وسيلة الدفع المناسبة:
              </label>

              {/* Vodafone Cash */}
              <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-[#0EA5E9] transition-all has-[:checked]:border-[#0EA5E9] has-[:checked]:bg-sky-50/50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="method" value="VODAFONE_CASH" defaultChecked className="text-[#0EA5E9] w-4 h-4" />
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">فودافون كاش ومحافظ المحمول</div>
                    <div className="text-xs text-slate-500 font-medium">أورانج كاش، اتصالات كاش، وي باي</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">الأكثر استخداماً</span>
              </label>

              {/* InstaPay */}
              <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-[#0EA5E9] transition-all has-[:checked]:border-[#0EA5E9] has-[:checked]:bg-sky-50/50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="method" value="INSTAPAY" className="text-[#0EA5E9] w-4 h-4" />
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">إنستاباي (InstaPay)</div>
                    <div className="text-xs text-slate-500 font-medium">تحويل بنكي لحظي فوري</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">لحظي ⚡</span>
              </label>

              {/* Center Code / Voucher */}
              <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-[#0EA5E9] transition-all has-[:checked]:border-[#0EA5E9] has-[:checked]:bg-sky-50/50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="method" value="CENTER_CODE" className="text-[#0EA5E9] w-4 h-4" />
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">كود السنتر / كرت الشحن</div>
                    <div className="text-xs text-slate-500 font-medium">كود مسبق الدفع من السنتر أو المدرس</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">كود مباشر</span>
              </label>

              {/* Credit Card / Meeza */}
              <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-[#0EA5E9] transition-all has-[:checked]:border-[#0EA5E9] has-[:checked]:bg-sky-50/50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="method" value="VISA" className="text-[#0EA5E9] w-4 h-4" />
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">بطاقة بنكية (فيزا / ماستركارد / ميزة)</div>
                    <div className="text-xs text-slate-500 font-medium">دفع إلكتروني فوري ومؤمن</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Instruction Notice for Wallets */}
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 text-xs text-slate-600 leading-relaxed">
              💡 <strong>طريقة التفعيل السريع:</strong> بعد الضغط على تأكيد الاشتراك، يتم تفعيل المادة تلقائياً في حسابك وتظهر فوراً في جدول الحصص وقائمة موادك المفعلة.
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-sky-500/25 mt-2"
            >
              تأكيد وتفعيل الاشتراك الآن ({subject.price === 0 ? 'مجاناً' : `${subject.price} ج.م`})
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
