import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Settings, User, Phone, ShieldCheck, Briefcase, Award, Save, CheckCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InstructorSettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
          <Link href="/instructor" className="hover:text-[#0EA5E9] transition-colors">لوحة التحكم</Link>
          <span>/</span>
          <span className="text-slate-600">إعدادات الحساب والملف التعريفي</span>
        </div>
        <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
          <Settings className="text-[#0EA5E9]" size={26} />
          الملف الشخصي والمهني
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          إدارة بياناتك الأكاديمية والتخصص ووسائل تواصل الطلاب
        </p>
      </div>

      {/* Verification Badge Banner */}
      <div className={`p-5 rounded-3xl border flex items-center justify-between ${
        user.isVerifiedTeacher 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
          : 'bg-amber-50/70 border-amber-200 text-amber-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white ${
            user.isVerifiedTeacher ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="font-black text-sm">
              {user.isVerifiedTeacher ? 'حساب معلم معتمد وموثق رسمياً ✔' : 'حساب المعلم قيد مراجعة وثائق الهوية ⏳'}
            </div>
            <div className="text-xs opacity-90 mt-0.5">
              {user.isVerifiedTeacher 
                ? 'تم التحقق من بياناتك وبطاقتك القومية بنجاح، وتظهر شارة التوثيق لجميع الطلاب.'
                : 'تم استلام وثائق إثبات الهوية والرقم القومي، وجاري مراجعتها من قِبل إدارة المنصة.'}
            </div>
          </div>
        </div>
        {user.nationalId && (
          <span className="text-xs font-mono bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
            الرقم القومي: {user.nationalId}
          </span>
        )}
      </div>

      {/* Profile Info Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-base font-black text-[#1B2B5E] border-b border-slate-100 pb-3">البيانات الشخصية والأكاديمية</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">الاسم واللقب</label>
            <input 
              type="text" 
              defaultValue={user.name || ''} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم الهاتف الشخصي</label>
            <input 
              type="text" 
              defaultValue={user.phone || ''} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              dir="ltr"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم الواتساب للتواصل مع الطلاب</label>
            <input 
              type="text" 
              defaultValue={user.whatsappPhone || user.phone || ''} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              dir="ltr"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">المادة أو التخصص الأساسي</label>
            <input 
              type="text" 
              defaultValue={user.subjectSpecialty || 'غير محدد'} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">المسمى الوظيفي</label>
            <input 
              type="text" 
              defaultValue={user.jobTitle || 'معلم خبير'} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">سنوات الخبرة</label>
            <input 
              type="text" 
              defaultValue={user.yearsOfExperience || 'أكثر من 5 سنوات'} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              readOnly
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">المراحل التعليمية</label>
            <input 
              type="text" 
              defaultValue={user.teachingStages || 'المرحلة الثانوية'} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              readOnly
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">نبذة تعريفية / اسم المدرسة أو السنتر</label>
            <textarea 
              defaultValue={user.bio || ''} 
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[#0EA5E9] focus:outline-none"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
