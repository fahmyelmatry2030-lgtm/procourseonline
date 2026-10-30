import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { payForSubjectAction } from '@/actions/school';

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
        payments: { where: { studentId: userId } },
      },
    });
  } catch (error) {
    console.error('Error fetching subject for payment:', error);
  }

  if (!subject) notFound();
  if (subject.payments && subject.payments.length > 0) {
    redirect(`/classes/${subject.classId}`);
  }

  return (
    <div className="bg-[#F8FAFF] min-h-screen py-16">
      <div className="max-w-lg mx-auto px-4">
        
        <Link href={`/classes/${subject.classId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0EA5E9] text-sm font-medium mb-8 transition-colors">
          <ArrowRight size={16} /> العودة للصف
        </Link>

        <div className="friendly-card p-8 border border-slate-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center mx-auto mb-4 font-black text-2xl">
              {subject.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-black text-[#1B2B5E] mb-1">دفع رسوم المادة</h1>
            <p className="text-slate-400 font-medium">{subject.name} — {subject.class?.name}</p>
          </div>

          {/* Details */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">الصف الدراسي</span>
              <span className="font-bold text-slate-700">{subject.class?.name}</span>
            </div>
            {subject.teacher && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">المدرس</span>
                <span className="font-bold text-slate-700">{subject.teacher.name}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
              <span className="text-slate-700 font-bold">المبلغ المطلوب</span>
              <span className="text-2xl font-black text-[#0EA5E9]">${subject.price}</span>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-6">
            <ShieldCheck size={20} className="shrink-0" />
            <span className="font-medium">وصول فوري ودائم لجميع المحاضرات والملفات بعد الدفع</span>
          </div>

          {/* Pay Form */}
          <form action={payForSubjectAction}>
            <input type="hidden" name="subjectId" value={id} />
            <div className="mb-6 space-y-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-[#0EA5E9] transition-colors">
                <input type="radio" name="method" value="VISA" defaultChecked className="text-[#0EA5E9]" />
                <CreditCard size={18} className="text-slate-600" />
                <span className="text-sm font-bold text-slate-700">بطاقة بنكية (فيزا / ماستركارد)</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-sky-500/20">
              تأكيد الدفع (${subject.price})
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
