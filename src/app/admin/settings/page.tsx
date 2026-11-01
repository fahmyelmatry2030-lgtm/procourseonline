import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Settings as SettingsIcon } from 'lucide-react';
import { AdminSettingsClient } from './AdminSettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
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
            <span className="text-slate-600">إعدادات المنصة</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <SettingsIcon className="text-blue-600" size={26} />
            إعدادات المنصة والنظام
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            التحكم في أرقام الدعم الفني، بوابات فودافون كاش وإنستاباي، ونسب عمولة المنصة
          </p>
        </div>
      </div>

      <AdminSettingsClient />
    </div>
  );
}
