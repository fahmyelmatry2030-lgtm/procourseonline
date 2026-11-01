import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { CalendarCheck, Users, CheckCircle2 } from 'lucide-react';

export default async function TeacherAttendancePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const attendances = await prisma.subjectAttendance.findMany({
    where: {
      subject: { teacherId: userId },
    },
    include: {
      student: true,
      subject: {
        include: { class: true },
      },
      lecture: true,
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
            <span className="text-slate-600">حضور الطلاب</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <CalendarCheck className="text-[#0EA5E9]" size={26} />
            سجل الحضور والغياب في الحصص
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            متابعة حضور الطلاب للحصص المباشرة والمسجلة ومعدل الالتزام الزمني
          </p>
        </div>
      </div>

      {attendances.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm font-bold">لا توجد سجلات حضور مسجلة حتى الآن.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                  <th className="py-4 px-6">الطالب</th>
                  <th className="py-4 px-6">الحصة المدرسية</th>
                  <th className="py-4 px-6">المادة والصف</th>
                  <th className="py-4 px-6">وقت الدخول</th>
                  <th className="py-4 px-6">مدة الحضور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{att.student.name || 'طالب'}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{att.lecture.title}</td>
                    <td className="py-4 px-6 text-xs font-bold text-slate-600">
                      {att.subject.name} ({att.subject.class?.name})
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(att.joinTime).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 font-black text-emerald-600">
                      {att.durationMinutes} دقيقة
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
