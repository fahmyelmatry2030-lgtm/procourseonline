'use client';

import { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Percent, 
  DollarSign, 
  Calendar, 
  Users, 
  Sparkles,
  AlertCircle,
  Clock
} from 'lucide-react';
import { createCouponAction, deleteCouponAction } from '@/actions/coupons';

interface CouponItem {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number | null;
  usesCount: number;
  expiryDate: string | null;
  createdAt: string;
  courseTitle?: string | null;
}

export function AdminCouponsClient({ initialCoupons }: { initialCoupons: CouponItem[] }) {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await createCouponAction(formData);

    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
      return;
    }

    // Success
    setLoading(false);
    setShowModal(false);
    window.location.reload();
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟ لن يتمكن الطلاب من استخدامه بعد الآن.')) return;
    
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    await deleteCouponAction(couponId);
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-sm font-bold text-slate-500">
          إجمالي الكوبونات النشطة: <span className="text-[#0EA5E9] font-black">{coupons.length}</span>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 hover:shadow-lg hover:shadow-red-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          <span>إنشاء كود خصم جديد</span>
        </button>
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Ticket size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">لا توجد كوبونات خصم حالياً</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            يمكنك إنشاء كود خصم للترويج للكورسات والمناهج وزيادة مبيعات المنصة.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#1B2B5E] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Plus size={15} />
            <span>إنشاء أول كود خصم</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all overflow-hidden relative group flex flex-col justify-between"
            >
              {/* Card Header / Ticket Top */}
              <div className="p-5 pb-4 bg-gradient-to-r from-slate-900 to-[#1B2B5E] text-white relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-xs flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-400" />
                    {c.type === 'PERCENTAGE' ? 'خصم نسبة مئوية' : 'خصم بمبلغ ثابت'}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/80 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    title="حذف الكوبون"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight text-white">
                    {c.value}
                  </span>
                  <span className="text-base font-bold text-amber-400">
                    {c.type === 'PERCENTAGE' ? '%' : 'ج.م'} خصم
                  </span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="p-5 space-y-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div className="font-mono font-black text-slate-800 text-lg tracking-wider" dir="ltr">
                    {c.code}
                  </div>
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    {copiedCode === c.code ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedCode === c.code ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                </div>

                {/* Details Meta */}
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />
                    <span>
                      الاستخدام: <strong className="text-slate-900">{c.usesCount}</strong>
                      {c.maxUses ? ` / ${c.maxUses}` : ' (غير محدود)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>
                      {c.expiryDate ? `ينتهي: ${c.expiryDate}` : 'صالح دائماً'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Coupon */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
              <Ticket className="text-red-600" size={24} />
              إنشاء كود خصم (كوبون) جديد
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              حدد رمز الكوبون ونسبة أو قيمة الخصم وصلاحية استخدامه.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  كود الخصم (Promo Code) *
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="مثال: PROCOURSE50 أو EID2026"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-sm font-black focus:outline-none focus:border-red-500"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نوع الخصم *
                  </label>
                  <select
                    name="type"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                    <option value="FIXED">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    قيمة الخصم *
                  </label>
                  <input
                    type="number"
                    name="value"
                    placeholder="مثال: 20 أو 100"
                    min="1"
                    step="any"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الحد الأقصى لمرات الاستخدام (اختياري)
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    placeholder="فارغ = غير محدود"
                    min="1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ انتهاء الصلاحية (اختياري)
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ الكوبون وتفعيله'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
