import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { PlayCircle, Video, Calendar, Clock, Plus, ExternalLink } from 'lucide-react';

export default async function TeacherLecturesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const lectures = await prisma.subjectLecture.findMany({
    where: {
      subject: { teacherId: userId },
    },
    include: {
      subject: {
        include: { class: true },
      },
      attendances: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/teacher" className="hover:text-[#0EA5E9] transition-colors">لوحة المعلم</Link>
            <span>/</span>
            <span className="text-slate-600">الحصص المدرسية</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <PlayCircle className="text-[#0EA5E9]" size={26} />
            جدول الحصص المباشرة والدروس المسجلة
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            مواعيد البث المباشر (Google Meet و Zoom) ورفع فيديوهات الشرح لطلاب الصفوف
          </p>
        </div>
      </div>

      {lectures.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm font-bold">لا توجد حصص مجدولة حالياً.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                  <th className="py-4 px-6">عنوان الحصة</th>
                  <th className="py-4 px-6">المادة والصف الدراسي</th>
                  <th className="py-4 px-6">نوع الحصة</th>
                  <th className="py-4 px-6">المدة</th>
                  <th className="py-4 px-6">حضور الطلاب</th>
                  <th className="py-4 px-6">رابط البث / الفيديو</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lectures.map((lec) => (
                  <tr key={lec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{lec.title}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">
                      {lec.subject.name} ({lec.subject.class?.name})
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        lec.type === 'LIVE' ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'
                      }`}>
                        {lec.type === 'LIVE' ? 'بث مباشر 🔴' : 'مسجلة 📹'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-bold">{lec.duration || 45} دقيقة</td>
                    <td className="py-4 px-6 font-black text-emerald-600">{lec.attendances.length} طالب</td>
                    <td className="py-4 px-6">
                      {lec.liveUrl ? (
                        <a
                          href={lec.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0EA5E9] hover:underline"
                        >
                          <span>فتح الرابط</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">غير متوفر</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
