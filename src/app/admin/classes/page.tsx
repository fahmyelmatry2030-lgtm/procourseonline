import prisma from '@/lib/prisma';
import Link from 'next/link';
import { School, BookOpen, Users, Plus, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      subjects: {
        include: {
          teacher: true,
          payments: true,
        },
      },
      enrollments: true,
    },
    orderBy: [
      { gradeLevel: 'asc' },
      { gradeNumber: 'asc' },
    ],
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-[#0EA5E9] transition-colors">لوحة الإدارة</Link>
            <span>/</span>
            <span className="text-slate-600">الصفوف والمواد الدراسية</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <School className="text-[#0EA5E9]" size={26} />
            إدارة الصفوف والمواد الدراسية
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            المراحل التعليمية (ابتدائي، إعدادي، ثانوي) والمناهج والمواد المخصصة للمعلمين
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/classes/new"
            className="px-4 py-2.5 bg-[#0EA5E9] text-white rounded-2xl text-xs font-black flex items-center gap-1.5 hover:bg-sky-600 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>إضافة مادة أو صف جديد</span>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm font-bold">لا توجد صفوف دراسية مضافة حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-sky-50 text-[#0EA5E9] font-bold rounded-lg text-xs">
                    المرحلة {c.gradeLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{c.academicYear}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{c.name}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 my-3">
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} className="text-slate-400" />
                    <span>{c.subjects.length} مادة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-slate-400" />
                    <span>{c.enrollments.length} طالب</span>
                  </div>
                </div>

                {/* Subjects list in class */}
                {c.subjects.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400">المواد المتاحة:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.subjects.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                          {s.name} {s.teacher ? `(${s.teacher.name})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
