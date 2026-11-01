import prisma from '@/lib/prisma';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';
import { TeacherReviewList } from '@/components/TeacherReviewList';

export const dynamic = 'force-dynamic';

export default async function AdminPendingTeachersPage() {
  const teachers = await prisma.user.findMany({
    where: {
      role: { in: ['TEACHER', 'INSTRUCTOR'] },
      isVerifiedTeacher: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-[#0EA5E9] transition-colors">لوحة الإدارة</Link>
            <span>/</span>
            <span className="text-slate-600">طلبات الاعتماد المعلقة</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <UserCheck className="text-amber-500" size={26} />
            طلبات اعتماد المعلمين والمحاضرين
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            المعلمون الذين أتموا التسجيل وأرفقوا وثائق الهوية وبانتظار موافقة الإدارة لفتح لوحة التحكم لهم
          </p>
        </div>
      </div>

      <TeacherReviewList initialTeachers={teachers} />
    </div>
  );
}
