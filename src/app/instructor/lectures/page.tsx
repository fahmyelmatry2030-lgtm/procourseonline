import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { PlayCircle, Video, Calendar, Clock, Plus, ExternalLink, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InstructorLecturesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      lectures: {
        orderBy: { date: 'asc' },
      },
    },
  });

  const allLectures = courses.flatMap(c => 
    c.lectures.map(l => ({
      ...l,
      courseTitle: c.title,
    }))
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/instructor" className="hover:text-[#0EA5E9] transition-colors">لوحة التحكم</Link>
            <span>/</span>
            <span className="text-slate-600">المحاضرات والبث المباشر</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <PlayCircle className="text-[#0EA5E9]" size={26} />
            المحاضرات المباشرة والجلسات
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            إدارة مواعيد الحصص المباشرة وروابط Zoom و Google Meet للطلاب
          </p>
        </div>

        <Link
          href="/instructor/courses"
          className="btn inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-5 py-3 rounded-2xl font-bold shadow-md shadow-sky-500/20 text-sm"
        >
          <Plus size={18} />
          إضافة محاضرة لدورة
        </Link>
      </div>

      {allLectures.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-sky-50 text-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Video size={32} />
          </div>
          <h3 className="text-lg font-black text-[#1B2B5E] mb-1">لا توجد محاضرات مجدولة حالياً</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 font-medium">
            يمكنك جدولة الحصص المباشرة داخل كل دورة لتظهر تلقائياً في جداول ومواعيد الطلاب.
          </p>
          <Link
            href="/instructor/courses"
            className="btn inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
          >
            اختر دورة لجدولة المحاضرات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allLectures.map(lecture => (
            <div key={lecture.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0EA5E9] bg-sky-50 px-2.5 py-1 rounded-lg">
                    {lecture.courseTitle}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <Calendar size={13} />
                    {new Date(lecture.date).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <h4 className="font-black text-base text-[#1B2B5E] mb-1">{lecture.title}</h4>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
                  {lecture.description || 'جلسة تفاعلية مباشرة مع الطلاب لشرح ومراجعة الدرس.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Clock size={14} />
                  {lecture.durationMinutes || 60} دقيقة
                </span>

                {lecture.meetingUrl ? (
                  <a
                    href={lecture.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Video size={14} />
                    دخول البث المباشر
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">لم يُحدد رابط بعد</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
