import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Settings, User, Phone, ShieldCheck } from 'lucide-react';

export default async function TeacherSettingsPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/teacher" className="hover:text-[#0EA5E9] transition-colors">لوحة المعلم</Link>
            <span>/</span>
            <span className="text-slate-600">الإعدادات</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <Settings className="text-[#0EA5E9]" size={26} />
            إعدادات الحساب والبيانات الشخصية
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            تحديث اسم المعلم، رقم الهاتف، والمؤهلات الأكاديمية
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs max-w-2xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center font-black text-2xl">
            {(user.name || 'م').charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{user.name || 'المعلم'}</h3>
            <p className="text-xs text-slate-500">{user.phone} • {user.subjectSpecialty || 'المناهج المدرسية'}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <ShieldCheck size={12} />
              معلم معتمد وموثق
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs font-bold text-slate-600">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-slate-400">المراحل التعليمية المسندة:</div>
            <div className="text-sm font-black text-slate-900">{user.teachingStages || 'المرحلة الثانوية'}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-slate-400">المسمى الوظيفي وسنوات الخبرة:</div>
            <div className="text-sm font-black text-slate-900">{user.jobTitle || 'معلم أول'} — {user.yearsOfExperience || 'خبرة معتمدة'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
