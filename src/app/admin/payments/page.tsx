import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CreditCard, DollarSign } from 'lucide-react';
import { AdminPaymentsClient } from './AdminPaymentsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  // 1. Fetch Subject Payments
  const subjectPayments = await prisma.subjectPayment.findMany({
    include: {
      student: true,
      subject: {
        include: {
          teacher: true,
          class: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 2. Fetch legacy Course Payments
  const legacyPayments = await prisma.payment.findMany({
    include: {
      student: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 3. Fetch Teachers to calculate payouts
  const teachers = await prisma.user.findMany({
    where: {
      role: { in: ['TEACHER', 'INSTRUCTOR'] },
    },
    include: {
      subjects: {
        include: {
          payments: true,
        },
      },
    },
  });

  // Format payments list
  const formattedPayments = [
    ...subjectPayments.map((p) => ({
      id: p.id,
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      status: p.status,
      createdAt: new Date(p.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      studentName: p.student.name || 'طالب',
      studentPhone: p.student.phone,
      itemTitle: `${p.subject.name} (${p.subject.class?.name || 'عام'})`,
      teacherName: p.subject.teacher?.name || 'غير محدد',
      type: 'SUBJECT' as const,
    })),
    ...legacyPayments.map((p) => ({
      id: p.id,
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      status: p.status,
      createdAt: new Date(p.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      studentName: p.student?.name || 'طالب',
      studentPhone: p.student?.phone || '',
      itemTitle: 'دورة تدريبية',
      teacherName: 'إدارة المنصة',
      type: 'COURSE' as const,
    })),
  ];

  // Calculate totals
  const totalRevenue = formattedPayments.reduce((acc, p) => acc + p.amount, 0);
  const platformShareTotal = Math.round(totalRevenue * 0.15);
  const teacherShareTotal = totalRevenue - platformShareTotal;

  // Teacher payouts summary
  const teacherPayouts = teachers.map((t) => {
    let totalSales = 0;
    let enrollmentsCount = 0;

    t.subjects.forEach((subj) => {
      subj.payments.forEach((p) => {
        totalSales += p.amount;
        enrollmentsCount++;
      });
    });

    const teacherShare = Math.round(totalSales * 0.85);
    const platformShare = totalSales - teacherShare;

    return {
      id: t.id,
      name: t.name || 'معلم',
      phone: t.phone,
      subjectSpecialty: t.subjectSpecialty || undefined,
      totalSales,
      teacherShare,
      platformShare,
      enrollmentsCount,
    };
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-[#0EA5E9] transition-colors">لوحة الإدارة</Link>
            <span>/</span>
            <span className="text-slate-600">المالية والمدفوعات</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <CreditCard className="text-[#0EA5E9]" size={26} />
            حسابات المنصة والمالية والاشتراكات
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            متابعة إيرادات المنصة، حسابات فودافون كاش وإنستاباي، وأرباح ومستحقات المعلمين
          </p>
        </div>
      </div>

      <AdminPaymentsClient
        initialPayments={formattedPayments}
        teacherPayouts={teacherPayouts}
        totalRevenue={totalRevenue}
        platformShareTotal={platformShareTotal}
        teacherShareTotal={teacherShareTotal}
        vodafoneCashNumber="01067825128"
        instaPayHandle="procourse@instapay"
      />
    </div>
  );
}
