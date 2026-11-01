import { getUser } from '@/actions/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  School, 
  BookOpen, 
  DollarSign, 
  Clock, 
  ArrowLeft, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { TeacherReviewList } from '@/components/TeacherReviewList';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await getUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  // Database Counts
  const [
    studentsCount,
    teachersCount,
    pendingTeachersCount,
    classesCount,
    coursesCount,
    pendingTeachers
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: { in: ['TEACHER', 'INSTRUCTOR'] }, isVerifiedTeacher: true } }),
    prisma.user.count({ where: { role: { in: ['TEACHER', 'INSTRUCTOR'] }, isVerifiedTeacher: false } }),
    prisma.class.count(),
    prisma.course.count(),
    prisma.user.findMany({
      where: {
        role: { in: ['TEACHER', 'INSTRUCTOR'] },
        isVerifiedTeacher: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      
      {/* Alert Banner for Pending Teachers */}
      {pendingTeachersCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-5 rounded-3xl border border-amber-300/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
              <Clock size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#1B2B5E] mb-0.5">
                تنبيه الإدارة: يوجد {pendingTeachersCount} طلب اعتماد جديد لمعلمين ومحاضرين
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                قام معلمون بإتمام التسجيل ورفع وثائق الهوية، بانتظار موافقة الإدارة لفتح لوحة التحكم الخاصة بهم.
              </p>
            </div>
          </div>

          <Link
            href="/admin/teachers/pending"
            className="btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-sm shrink-0 self-start sm:self-auto"
          >
            فحص واعتماد الطلبات
            <ArrowLeft size={14} />
          </Link>
        </div>
      )}

      {/* Overview Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <h1 className="text-2xl font-black text-[#1B2B5E]">لوحة التحكم العامة للمنصة 🛡️</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          مرحباً بك {user.name || 'مدير النظام'}. إليك تقرير شامل ومباشر عن أداء منصة ProCourse Online.
        </p>
      </div>

      {/* Metric Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Students Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center font-bold">
            <GraduationCap size={26} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold mb-0.5">الطلاب المسجلون</div>
            <div className="text-2xl font-black text-[#1B2B5E]">{studentsCount}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">نشط في الصفوف</div>
          </div>
        </div>

        {/* Teachers Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center font-bold">
            <Users size={26} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold mb-0.5">المعلمون والمحاضرون</div>
            <div className="text-2xl font-black text-[#1B2B5E]">{teachersCount} معتمد</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
              {pendingTeachersCount} بانتظار الاعتماد
            </div>
          </div>
        </div>

        {/* Classes Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <School size={26} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold mb-0.5">الصفوف الدراسية</div>
            <div className="text-2xl font-black text-[#1B2B5E]">{classesCount}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">ابتدائي / إعدادي / ثانوي</div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BookOpen size={26} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold mb-0.5">الدورات التدريبية</div>
            <div className="text-2xl font-black text-[#1B2B5E]">{coursesCount}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">متاحة للاشتراك</div>
          </div>
        </div>

      </div>

      {/* Pending Teachers Review Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#1B2B5E]">طلبات اعتماد المعلمين والمحاضرين</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              المعلمون الجدد الذين أتموا التسجيل وبانتظار موافقة الإدارة لدخول لوحة التدريس
            </p>
          </div>

          <Link
            href="/admin/teachers"
            className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft size={13} />
          </Link>
        </div>

        <TeacherReviewList initialTeachers={pendingTeachers} />
      </div>

    </div>
  );
}
