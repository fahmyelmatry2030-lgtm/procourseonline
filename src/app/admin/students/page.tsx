import prisma from '@/lib/prisma';
import Link from 'next/link';
import { GraduationCap, Phone, MessageCircle, MapPin, School, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      classEnrollments: {
        include: { class: true },
      },
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
            <span className="text-slate-600">سجل الطلاب المسجلين</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B5E] flex items-center gap-2">
            <GraduationCap className="text-[#0EA5E9]" size={26} />
            سجل الطلاب والصفوف المدرسية
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            متابعة كافة الطلاب المسجلين على المنصة وأولياء أمورهم وتوزيعهم على الصفوف
          </p>
        </div>
        <div className="px-4 py-2 bg-sky-50 text-[#0EA5E9] rounded-2xl font-black text-sm border border-sky-100 self-start sm:self-auto">
          إجمالي الطلاب: {students.length}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <p className="text-slate-400 text-sm">لا يوجد طلاب مسجلون بعد.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold text-xs">
                  <th className="p-4">اسم الطالب</th>
                  <th className="p-4">الصف والمرحلة</th>
                  <th className="p-4">المحافظة</th>
                  <th className="p-4">رقم الطالب</th>
                  <th className="p-4">رقم ولي الأمر</th>
                  <th className="p-4">تاريخ التسجيل</th>
                  <th className="p-4 text-center">تواصل سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-[#1B2B5E]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0EA5E9] font-black flex items-center justify-center text-sm">
                          {(student.name || 'ط').charAt(0)}
                        </div>
                        <div>
                          <div>{student.name || 'طالب جديد'}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{student.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <span className="font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                        {student.gradeName || student.gradeLevel || 'غير محدد'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs">
                      {student.governorate || 'القاهرة'}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-700" dir="ltr">
                      {student.phone}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-700" dir="ltr">
                      {student.parentPhone || '—'}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(student.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={`https://wa.me/20${student.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition-colors"
                      >
                        <MessageCircle size={14} />
                        واتساب
                      </a>
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
