import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Ticket } from 'lucide-react';
import { AdminCouponsClient } from './AdminCouponsClient';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: {
      course: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedCoupons = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    maxUses: c.maxUses,
    usesCount: c.usesCount,
    expiryDate: c.expiryDate
      ? new Date(c.expiryDate).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null,
    createdAt: new Date(c.createdAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    courseTitle: c.course?.title || null,
  }));

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-[#0EA5E9] transition-colors">لوحة الإدارة</Link>
            <span>/</span>
            <span className="text-slate-600">كبونات وأكواد الخصم</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <Ticket className="text-red-600" size={26} />
            كبونات وأكواد الخصم الترويجية
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            إنشاء أكواد الخصم للطلاب، تحديد نسبة أو قيمة التخفيض، ومتابعة معدل الاستخدام
          </p>
        </div>
      </div>

      <AdminCouponsClient initialCoupons={formattedCoupons} />
    </div>
  );
}
