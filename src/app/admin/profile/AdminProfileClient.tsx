'use client';

import { useState } from 'react';
import { Shield, User, Phone, Mail, Lock, CheckCircle2, Save, KeyRound, AlertCircle } from 'lucide-react';
import { updateAdminProfileAction } from '@/actions/admin';

interface AdminUser {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  role: string;
  createdAt: string | Date;
}

export function AdminProfileClient({ user }: { user: AdminUser }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateAdminProfileAction(formData);

    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'تم حفظ وتحديث بيانات المدير بنجاح!' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      
      {/* Role Badge Banner */}
      <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-6 rounded-3xl border border-red-200/60 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/30">
            <Shield size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#1B2B5E]">{user.name || 'مدير النظام'}</h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              حساب الإدارة العليا — صلاحيات كاملة لإدارة المعلمين، الطلاب، المناهج والمدفوعات
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-left text-xs font-semibold text-slate-400">
          تاريخ الإنشاء: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2 animate-fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <h3 className="text-base font-black text-[#1B2B5E] mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User size={18} className="text-[#0EA5E9]" />
          البيانات الأساسية ومعلومات الدخول
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم بالكامل</label>
              <input
                type="text"
                name="name"
                defaultValue={user.name || ''}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف (يُستخدم لتسجيل الدخول)</label>
              <input
                type="tel"
                name="phone"
                defaultValue={user.phone || ''}
                required
                dir="ltr"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني للإدارة</label>
              <input
                type="email"
                name="email"
                defaultValue={user.email || ''}
                dir="ltr"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password Update */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-black text-[#1B2B5E] flex items-center gap-1.5">
              <KeyRound size={16} className="text-amber-500" />
              تغيير كلمة المرور الخاصة بحساب الإدارة
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور الجديدة <span className="text-slate-400 font-normal">(اتركها فارغة إذا كنت لا ترغب في تغييرها)</span>
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="أدخل كلمة مرور جديدة قوية (6 أحرف أو أكثر)"
                dir="ltr"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn inline-flex items-center gap-2 bg-[#1B2B5E] hover:bg-[#111c3e] text-white px-6 py-3 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <Save size={16} />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
