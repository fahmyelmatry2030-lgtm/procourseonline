import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';
import { AdminProfileClient } from './AdminProfileClient';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const user = await getUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-[#0EA5E9] transition-colors">لوحة الإدارة</Link>
            <span>/</span>
            <span className="text-slate-600">الملف الشخصي للإدارة</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <UserCheck className="text-red-600" size={26} />
            الملف الشخصي للإدارة العليا
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            تحديث بيانات حساب المدير، بيانات تسجيل الدخول وتغيير كلمة المرور
          </p>
        </div>
      </div>

      <AdminProfileClient user={user} />
    </div>
  );
}
