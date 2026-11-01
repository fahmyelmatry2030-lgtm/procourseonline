import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Users, Clock, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
      enrollments: true,
      lectures: true,
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
            <span className="text-slate-600">الدورات التدريبية</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <BookOpen className="text-[#0EA5E9]" size={26} />
            إدارة الدورات التدريبية والكورسات
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            متابعة جميع الكورسات وورش العمل المنشورة بواسطة المدربين والمحاضرين
          </p>
        </div>
      </div>

      {/* Grid */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm font-bold">لا توجد دورات تدريبية مضافة حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 font-bold rounded-lg text-xs ${
                    c.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {c.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                  </span>
                  <span className="text-sm font-black text-slate-900">{c.price} ج.م</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{c.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{c.description}</p>
                
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-3 border-t border-slate-100">
                  <span>المحاضر: {c.instructor?.name || 'غير محدد'}</span>
                  <span>{c.enrollments.length} مشترك</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
