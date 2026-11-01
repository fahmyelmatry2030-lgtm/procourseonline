'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  User, 
  BookOpen, 
  Smartphone,
  Building,
  Calendar,
  Layers
} from 'lucide-react';

interface PaymentItem {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  studentName: string;
  studentPhone: string;
  itemTitle: string;
  teacherName?: string;
  type: 'SUBJECT' | 'COURSE';
}

interface TeacherPayout {
  id: string;
  name: string;
  phone: string;
  subjectSpecialty?: string;
  totalSales: number;
  teacherShare: number;
  platformShare: number;
  enrollmentsCount: number;
}

interface AdminPaymentsClientProps {
  initialPayments: PaymentItem[];
  teacherPayouts: TeacherPayout[];
  totalRevenue: number;
  platformShareTotal: number;
  teacherShareTotal: number;
  vodafoneCashNumber: string;
  instaPayHandle: string;
}

export function AdminPaymentsClient({
  initialPayments,
  teacherPayouts,
  totalRevenue,
  platformShareTotal,
  teacherShareTotal,
  vodafoneCashNumber,
  instaPayHandle
}: AdminPaymentsClientProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'accounts' | 'payouts'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const filteredPayments = initialPayments.filter((p) => {
    const matchesSearch = 
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentPhone.includes(searchQuery) ||
      p.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Platform Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">إجمالي إيرادات المنصة</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-emerald-600">ج.م</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={13} />
              <span>شامل كافة العمليات والاشتراكات</span>
            </div>
          </div>
        </div>

        {/* Net Platform Commission */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0EA5E9] flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">صافي أرباح المنصة (العمولة)</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {platformShareTotal.toLocaleString()} <span className="text-xs font-bold text-[#0EA5E9]">ج.م</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">
              متوسط النسبة ~15% من المبيعات
            </div>
          </div>
        </div>

        {/* Teacher Dues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <User size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">مستحقات المعلمين والمحاضرين</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {teacherShareTotal.toLocaleString()} <span className="text-xs font-bold text-amber-600">ج.م</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">
              مجموع حصص المعلمين من المواد
            </div>
          </div>
        </div>

        {/* Total Successful Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">عدد العمليات والاشتراكات</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {initialPayments.length} <span className="text-xs font-bold text-slate-500">عملية</span>
            </div>
            <div className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 mt-1">
              <CheckCircle2 size={13} />
              <span>اشتراكات مفعلة لطلاب المنصة</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-xs flex gap-2">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-[#1B2B5E] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard size={17} />
          <span>سجل المدفوعات والعمليات ({initialPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'accounts'
              ? 'bg-[#1B2B5E] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Wallet size={17} />
          <span>حسابات تحصيل المنصة (فودافون كاش وإنستاباي)</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'payouts'
              ? 'bg-[#1B2B5E] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TrendingUp size={17} />
          <span>كشف حسابات وأرباح المعلمين ({teacherPayouts.length})</span>
        </button>
      </div>

      {/* TAB 1: Transactions Table */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="بحث باسم الطالب، الهاتف، المادة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={15} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500">طريقة الدفع:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="ALL">جميع الطرق</option>
                <option value="VODAFONE_CASH">فودافون كاش</option>
                <option value="INSTAPAY">إنستاباي InstaPay</option>
                <option value="VISA">بطاقة بنكية / فيزا</option>
                <option value="CASH">يدوي / كاش</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
              <p className="text-slate-400 text-sm font-bold">لا توجد عمليات تطابق البحث حالياً.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                      <th className="py-4 px-6">الطالب</th>
                      <th className="py-4 px-6">المادة / الدورة</th>
                      <th className="py-4 px-6">المعلم / المحاضر</th>
                      <th className="py-4 px-6">المبلغ</th>
                      <th className="py-4 px-6">طريقة الدفع</th>
                      <th className="py-4 px-6">التاريخ</th>
                      <th className="py-4 px-6">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-slate-900">{p.studentName}</div>
                          <div className="text-xs text-slate-400 font-medium" dir="ltr">{p.studentPhone}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={15} className="text-[#0EA5E9]" />
                            <span>{p.itemTitle}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-600">
                          {p.teacherName || 'إدارة المنصة'}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-black text-emerald-600 text-base">{p.amount}</span>
                          <span className="text-[11px] font-bold text-slate-400 mr-1">ج.م</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <Smartphone size={13} className="text-slate-500" />
                            {p.paymentMethod === 'VODAFONE_CASH' ? 'فودافون كاش' :
                             p.paymentMethod === 'INSTAPAY' ? 'إنستاباي' :
                             p.paymentMethod === 'VISA' ? 'فيزا / ماستركارد' : p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                          {p.createdAt}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700">
                            <CheckCircle2 size={13} />
                            مكتمل
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Receiving Accounts (Vodafone Cash, InstaPay, Bank) */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vodafone Cash Box */}
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                  VF
                </div>
                <div>
                  <h3 className="font-black text-lg">محفظة فودافون كاش الرسمية</h3>
                  <p className="text-xs text-red-100">رقم تحصيل اشتراكات المنصة المعتمد</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-bold">نشط 🟢</span>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-xs my-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-red-200 font-bold mb-0.5">رقم التحويل:</div>
                <div className="text-2xl font-black tracking-wider" dir="ltr">{vodafoneCashNumber}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(vodafoneCashNumber, 'vf')}
                className="px-3 py-2 bg-white text-red-700 rounded-xl font-black text-xs flex items-center gap-1 hover:bg-red-50 transition-colors shadow-sm"
              >
                {copiedKey === 'vf' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'vf' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
              </button>
            </div>

            <div className="text-xs text-red-100 space-y-1">
              <p>• يقوم الطالب بالتحويل على هذا الرقم من أي محفظة إلكترونية كاش.</p>
              <p>• لتعديل هذا الرقم يمكنك الذهاب إلى <Link href="/admin/settings" className="underline font-bold text-white hover:text-amber-200">إعدادات المنصة</Link>.</p>
            </div>
          </div>

          {/* InstaPay Box */}
          <div className="bg-gradient-to-br from-[#1B2B5E] to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sky-400">
                  IP
                </div>
                <div>
                  <h3 className="font-black text-lg">عنوان إنستاباي InstaPay الرسمي</h3>
                  <p className="text-xs text-slate-300">معرف التحويل اللحظي للمنصة</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-xs font-bold text-emerald-400">نشط 🟢</span>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs my-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-300 font-bold mb-0.5">عنوان الدفع (IPA):</div>
                <div className="text-xl font-black tracking-wide" dir="ltr">{instaPayHandle}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(instaPayHandle, 'ip')}
                className="px-3 py-2 bg-[#0EA5E9] text-white rounded-xl font-black text-xs flex items-center gap-1 hover:bg-sky-400 transition-colors shadow-sm"
              >
                {copiedKey === 'ip' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'ip' ? 'تم النسخ!' : 'نسخ المعرف'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>• يستقبل التحويلات اللحظية من جميع البنوك المصرية ومحافظ الهاتف.</p>
              <p>• يمكن تحديث العنوان عبر <Link href="/admin/settings" className="underline font-bold text-white hover:text-sky-300">إعدادات المنصة</Link>.</p>
            </div>
          </div>

          {/* Guidelines on Verification */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2">
              <AlertCircle size={20} className="text-[#0EA5E9]" />
              كيفية إدارة وتأكيد إيصالات التحويل الخاصة بالطلاب
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1 text-sm">1. استلام رسالة التحويل</div>
                يرسل الطالب صورة إيصال التحويل على رقم واتساب المنصة أو من خلال نموذج التسجيل.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1 text-sm">2. مطابقة الإيصال بالرسالة</div>
                يقوم مسؤول الحسابات بالتأكد من وصول رسالة SMS بنكية أو إشعار محفظة فودافون كاش.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1 text-sm">3. تفعيل الاشتراك فوراً</div>
                يتم ربط الطالب بالصف أو المادة الدراسية لتفتح له كافة المحاضرات والملفات تلقائياً.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Teacher Payouts */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">كشف حسابات المعلمين والمستحقات المالية</h3>
                <p className="text-xs text-slate-500 mt-0.5">تفصيل مبيعات كل معلم ونسبة المنصة وصافي المستحق للصرف</p>
              </div>
              <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                النسبة الافتراضية للمعلم: <span className="text-emerald-600 font-black">85%</span> | المنصة: <span className="text-[#0EA5E9] font-black">15%</span>
              </div>
            </div>

            {teacherPayouts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-bold">
                لا يوجد معلمون مسجلون لديهم مبيعات حتى الآن.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                      <th className="py-4 px-6">المعلم / المحاضر</th>
                      <th className="py-4 px-6">المادة والتخصص</th>
                      <th className="py-4 px-6">عدد الاشتراكات</th>
                      <th className="py-4 px-6">إجمالي المبيعات</th>
                      <th className="py-4 px-6">مستحق المعلم (85%)</th>
                      <th className="py-4 px-6">حصة المنصة (15%)</th>
                      <th className="py-4 px-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teacherPayouts.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-black text-slate-900">{t.name}</div>
                          <div className="text-xs text-slate-400 font-semibold" dir="ltr">{t.phone}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-700">
                          {t.subjectSpecialty || 'غير محدد'}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                            {t.enrollmentsCount} طالب
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {t.totalSales.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-black text-emerald-600 text-base">{t.teacherShare.toLocaleString()}</span>
                          <span className="text-xs text-emerald-700 font-bold mr-1">ج.م</span>
                        </td>
                        <td className="py-4 px-6 font-black text-[#0EA5E9]">
                          {t.platformShare.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span>
                        </td>
                        <td className="py-4 px-6">
                          <a
                            href={`https://wa.me/20${t.phone.replace(/^0+/, '')}?text=${encodeURIComponent(`مرحباً أستاذ ${t.name}، بخصوص مستحقاتك المالية على منصة ProCourse Online...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black hover:bg-emerald-100 transition-colors"
                          >
                            <span>تسوية عبر واتساب</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
