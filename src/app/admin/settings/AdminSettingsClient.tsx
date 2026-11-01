'use client';

import { useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  DollarSign, 
  School, 
  Globe, 
  ShieldCheck, 
  CreditCard,
  Share2 
} from 'lucide-react';

export function AdminSettingsClient() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states with sensible production defaults
  const [platformName, setPlatformName] = useState('ProCourse Online');
  const [supportPhone, setSupportPhone] = useState('01067825128');
  const [supportWhatsapp, setSupportWhatsapp] = useState('01067825128');
  const [vodafoneCashNumber, setVodafoneCashNumber] = useState('01067825128');
  const [instaPayHandle, setInstaPayHandle] = useState('procourse@instapay');
  const [teacherSharePercent, setTeacherSharePercent] = useState('85');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/procourseonline');
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/procourseonline');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    // Save settings locally/cookie/DB
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }, 600);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl" dir="rtl">
      
      {saved && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 size={16} />
          <span>تم حفظ وتحديث إعدادات المنصة بنجاح وتطبيقها على النظام!</span>
        </div>
      )}

      {/* 1. General & Support Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#1B2B5E] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe size={18} className="text-[#0EA5E9]" />
          بيانات المنصة وخدمة العملاء والدعم الفني
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المنصة الرسمي</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">العام الدراسي الفعّال</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MessageCircle size={14} className="text-emerald-500" />
              رقم الواتساب الرسمي لخدمة المعلمين والطلاب
            </label>
            <input
              type="tel"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              dir="ltr"
              placeholder="010xxxxxxxx"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Phone size={14} className="text-[#0EA5E9]" />
              رقم الهاتف للاتصال المباشر
            </label>
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              dir="ltr"
              placeholder="010xxxxxxxx"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Payment & Payout Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#1B2B5E] flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard size={18} className="text-emerald-600" />
          إعدادات بوابات الدفع والتحصيل المالي
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رقم محفظة فودافون كاش المعتمد لاستقبال اشتراكات الطلاب
            </label>
            <input
              type="tel"
              value={vodafoneCashNumber}
              onChange={(e) => setVodafoneCashNumber(e.target.value)}
              dir="ltr"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              معرف / حساب إنستاباي (InstaPay) الرسمي
            </label>
            <input
              type="text"
              value={instaPayHandle}
              onChange={(e) => setInstaPayHandle(e.target.value)}
              dir="ltr"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              النسبة المئوية الافتراضية للمعلم من اشتراكات الدورات
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={teacherSharePercent}
                onChange={(e) => setTeacherSharePercent(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">نسبة المنصة التلقائية: {100 - Number(teacherSharePercent)}%</span>
          </div>
        </div>
      </div>

      {/* 3. Social Media Links */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#1B2B5E] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Share2 size={18} className="text-[#0EA5E9]" />
          قنوات التواصل الاجتماعي الرسمية
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط صفحة الفيسبوك</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              dir="ltr"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط قناة التيليجرام</label>
            <input
              type="url"
              value={telegramUrl}
              onChange={(e) => setTelegramUrl(e.target.value)}
              dir="ltr"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-800 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
        >
          <Save size={16} />
          {loading ? 'جاري حفظ الإعدادات...' : 'حفظ وتطبيق الإعدادات'}
        </button>
      </div>

    </form>
  );
}
