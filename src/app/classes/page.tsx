import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Users, GraduationCap, ArrowLeft } from 'lucide-react';

const gradeLevelColors: Record<string, string> = {
  'ابتدائي': '#0EA5E9',
  'إعدادي': '#F97316',
  'ثانوي': '#1B2B5E',
};

const gradeLevelBg: Record<string, string> = {
  'ابتدائي': 'rgba(14,165,233,0.08)',
  'إعدادي': 'rgba(249,115,22,0.08)',
  'ثانوي': 'rgba(27,43,94,0.08)',
};

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    where: { status: 'ACTIVE' },
    include: {
      subjects: { include: { teacher: true } },
      enrollments: true,
    },
    orderBy: [{ gradeLevel: 'asc' }, { gradeNumber: 'asc' }],
  });

  // تجميع حسب المرحلة
  const grouped = classes.reduce<Record<string, typeof classes>>((acc, cls) => {
    if (!acc[cls.gradeLevel]) acc[cls.gradeLevel] = [];
    acc[cls.gradeLevel].push(cls);
    return acc;
  }, {});

  const levels = ['ابتدائي', 'إعدادي', 'ثانوي'];

  return (
    <div className="bg-[#F8FAFF] min-h-screen py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="friendly-badge mb-6 mx-auto w-fit">
            <GraduationCap size={16} /> منصة التعليم المدرسي
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1B2B5E] mb-4">
            اختر <span className="text-[#0EA5E9]">صفك الدراسي</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            تصفح الصفوف المتاحة وانضم لمادتك المفضلة مع أفضل المدرسين
          </p>
        </div>

        {/* Levels */}
        {levels.map(level => {
          const levelClasses = grouped[level] || [];
          if (levelClasses.length === 0) return null;
          const color = gradeLevelColors[level];
          const bg = gradeLevelBg[level];

          return (
            <div key={level} className="mb-16">
              {/* Level Header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
                  style={{ background: bg, color }}
                >
                  {level === 'ابتدائي' ? '١' : level === 'إعدادي' ? '٢' : '٣'}
                </div>
                <div>
                  <h2 className="text-2xl font-black" style={{ color }}>المرحلة {level}</h2>
                  <p className="text-slate-400 text-sm font-medium">{levelClasses.length} صف متاح</p>
                </div>
                <div className="flex-1 h-px bg-slate-100 mr-4"></div>
              </div>

              {/* Classes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelClasses.map(cls => (
                  <Link key={cls.id} href={`/classes/${cls.id}`} className="friendly-card block p-6 border border-slate-100 group">
                    {/* Card Header */}
                    <div
                      className="rounded-2xl p-4 mb-5 flex items-center justify-between"
                      style={{ background: bg }}
                    >
                      <div>
                        <div className="text-xs font-bold mb-1" style={{ color, opacity: 0.7 }}>
                          {cls.academicYear}
                        </div>
                        <h3 className="text-xl font-black" style={{ color }}>
                          {cls.name}
                          {cls.section && <span className="mr-2 text-base opacity-70">({cls.section})</span>}
                        </h3>
                      </div>
                      <GraduationCap size={32} style={{ color, opacity: 0.4 }} />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={15} className="text-[#0EA5E9]" />
                        {cls.subjects.length} مادة
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={15} className="text-[#F97316]" />
                        {cls.enrollments.length} طالب
                      </div>
                    </div>

                    {/* Subjects Preview */}
                    {cls.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {cls.subjects.slice(0, 4).map(sub => (
                          <span
                            key={sub.id}
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ background: bg, color }}
                          >
                            {sub.name}
                          </span>
                        ))}
                        {cls.subjects.length > 4 && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-400">
                            +{cls.subjects.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div
                      className="flex items-center justify-between pt-4 border-t border-slate-100"
                    >
                      <span className="text-sm font-bold" style={{ color }}>عرض الصف</span>
                      <ArrowLeft size={18} style={{ color }} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {classes.length === 0 && (
          <div className="friendly-card p-16 text-center">
            <GraduationCap size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-500">لا توجد صفوف متاحة حالياً</h3>
            <p className="text-slate-400 mt-2">سيتم إضافة الصفوف قريباً</p>
          </div>
        )}

      </div>
    </div>
  );
}
