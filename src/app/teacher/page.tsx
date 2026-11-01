import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { School, Users, Video, BookOpen, Clock, Calendar, Plus, PlayCircle } from 'lucide-react';

export default async function TeacherDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  // Fetch teacher's subjects and classes
  const mySubjects = await prisma.subject.findMany({
    where: { teacherId: userId },
    include: {
      class: true,
      lectures: true,
      payments: true,
    },
  });

  const totalStudents = mySubjects.reduce((acc, subj) => acc + subj.payments.length, 0);
  const totalLectures = mySubjects.reduce((acc, subj) => acc + subj.lectures.length, 0);

  // Recent lectures
  const myLectures = await prisma.subjectLecture.findMany({
    where: {
      subject: { teacherId: userId },
    },
    include: {
      subject: {
        include: { class: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in" dir="rtl">
      
      {/* Metrics Grid - Academic & Teaching ONLY (No Sales / Revenue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">إجمالي طلاب الصفوف</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalStudents}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">طالب مسجل في موادك</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <School size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">المواد والصفوف المسندة</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{mySubjects.length}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">مناهج دراسية معتمدة</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Video size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">الحصص والدروس</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalLectures}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">حصة مباشرة ومسجلة</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">العام الدراسي</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">2025 - 2026</div>
            <div className="text-[11px] font-semibold text-amber-600 mt-0.5">الفصل الدراسي الأول</div>
          </div>
        </div>

      </div>

      {/* Main Content: Subjects & Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Subjects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#1B2B5E]">صفوفي وموادي الدراسية</h3>
                <p className="text-xs text-slate-400">المواد المسندة إليك من إدارة المنصة لإعداد الحصص والمذكرات</p>
              </div>
              <Link 
                href="/teacher/subjects" 
                className="text-xs font-bold text-[#0EA5E9] hover:underline"
              >
                عرض الكل ({mySubjects.length})
              </Link>
            </div>

            {mySubjects.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                لم يتم إسناد مواد دراسية لك بعد. تواصل مع إدارة المنصة لربط موادك وصفوفك المعتمدة.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mySubjects.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-sky-100 text-[#0EA5E9] rounded-md text-[11px] font-black">
                        {s.class?.gradeLevel || 'مرحلة مدرسية'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {s.class?.name || 'الصف الدراسي'}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1">{s.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-3 pt-3 border-t border-slate-200/60">
                      <span>{s.lectures.length} حصة مجدولة</span>
                      <span>•</span>
                      <span>{s.payments.length} طالب حاضر</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Recent Lectures */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <h3 className="text-base font-black text-[#1B2B5E] mb-3">أحدث الحصص المدرسية</h3>
            {myLectures.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">لا توجد حصص مجدولة حالياً.</p>
            ) : (
              <div className="space-y-3">
                {myLectures.map((lec) => (
                  <div key={lec.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-[#0EA5E9] flex items-center justify-center shrink-0">
                      <PlayCircle size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-black text-slate-800 truncate">{lec.title}</div>
                      <div className="text-[10px] text-slate-400">{lec.subject.name} - {lec.subject.class?.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/teacher/lectures"
              className="mt-4 w-full py-2.5 bg-[#1B2B5E] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <Plus size={14} />
              <span>جدولة حصة جديدة</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
