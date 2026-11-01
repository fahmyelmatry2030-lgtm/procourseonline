'use client';

import { useState } from 'react';
import { 
  Check, 
  X, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { approveTeacherAction, rejectTeacherAction } from '@/actions/admin';

interface Teacher {
  id: string;
  name: string | null;
  phone: string;
  whatsappPhone: string | null;
  subjectSpecialty: string | null;
  teachingStages: string | null;
  jobTitle: string | null;
  yearsOfExperience: string | null;
  nationalId: string | null;
  idCardUrl: string | null;
  governorate: string | null;
  isVerifiedTeacher: boolean;
  createdAt: Date | string;
}

export function TeacherReviewList({ initialTeachers }: { initialTeachers: Teacher[] }) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'all'>('pending');

  const handleApprove = async (id: string) => {
    if (!confirm('هل أنت متأكد من اعتماد وتوثيق هذا المعلم رسمياً؟')) return;
    setProcessingId(id);
    const res = await approveTeacherAction(id);
    if (res?.success) {
      setTeachers(prev => prev.map(t => t.id === id ? { ...t, isVerifiedTeacher: true } : t));
    } else {
      alert(res?.error || 'حدث خطأ أثناء الاعتماد.');
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('هل تريد إلغاء توثيق أو رفض هذا الطلب؟')) return;
    setProcessingId(id);
    const res = await rejectTeacherAction(id);
    if (res?.success) {
      setTeachers(prev => prev.map(t => t.id === id ? { ...t, isVerifiedTeacher: false } : t));
    } else {
      alert(res?.error || 'حدث خطأ أثناء معالجة الطلب.');
    }
    setProcessingId(null);
  };

  const filteredTeachers = teachers.filter(t => {
    if (filter === 'pending') return !t.isVerifiedTeacher;
    if (filter === 'verified') return t.isVerifiedTeacher;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filter === 'pending'
              ? 'bg-white text-[#1B2B5E] shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ⏳ بانتظار الاعتماد ({teachers.filter(t => !t.isVerifiedTeacher).length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filter === 'verified'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ✔ المعلمون المعتمدون ({teachers.filter(t => t.isVerifiedTeacher).length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            filter === 'all'
              ? 'bg-white text-[#1B2B5E] shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          الكل ({teachers.length})
        </button>
      </div>

      {/* Teachers Grid / Cards */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-base font-black text-[#1B2B5E]">لا توجد طلبات في هذا القسم حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">
            جميع طلبات التسجيل تم تدقيقها واتخاذ إجراء بشأنها.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTeachers.map(teacher => {
            const isPending = !teacher.isVerifiedTeacher;

            return (
              <div 
                key={teacher.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPending 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isPending ? '⏳ قيد مراجعة الهوية' : '✔ معتمد وموثق'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(teacher.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-orange-100 text-[#F97316] font-black text-lg flex items-center justify-center shrink-0">
                      {(teacher.name || 'م').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#1B2B5E]">{teacher.name || 'معلم جديد'}</h3>
                      <div className="text-xs text-slate-500 font-bold mt-0.5">
                        {teacher.subjectSpecialty || 'تخصص غير محدد'} • {teacher.jobTitle || 'معلم'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {teacher.governorate || 'القاهرة'} • خبرة {teacher.yearsOfExperience || 'ممتازة'}
                      </div>
                    </div>
                  </div>

                  {/* Stages & National ID */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 space-y-2 text-xs mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">المراحل التعليمية:</span>
                      <span className="text-slate-700 font-bold">{teacher.teachingStages || 'ثانوي'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">رقم بطاقة الرقم القومي:</span>
                      <span className="font-mono text-slate-800 font-bold tracking-wider">{teacher.nationalId || 'لم يُدخل'}</span>
                    </div>
                  </div>

                  {/* Identity Document Preview Button */}
                  <div className="mb-4">
                    {teacher.idCardUrl ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(teacher.idCardUrl)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 border border-sky-100 text-sky-800 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Eye size={16} className="text-[#0EA5E9] group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">معاينة صورة بطاقة الرقم القومي / الوثيقة</span>
                        </div>
                        <span className="text-[11px] text-[#0EA5E9] font-bold">فتح الصورة 🔍</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>لم يتم إرفاق ملف صورة للبطاقة</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contacts & Action Buttons */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`tel:${teacher.phone}`}
                      className="text-slate-600 hover:text-[#0EA5E9] font-bold flex items-center gap-1"
                      dir="ltr"
                    >
                      <Phone size={13} />
                      {teacher.phone}
                    </a>

                    <a
                      href={`https://wa.me/20${(teacher.whatsappPhone || teacher.phone).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold"
                    >
                      <MessageCircle size={14} />
                      تواصل واتساب
                    </a>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          disabled={processingId === teacher.id}
                          onClick={() => handleApprove(teacher.id)}
                          className="btn py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check size={16} />
                          {processingId === teacher.id ? 'جاري الاعتماد...' : 'قبول واعتماد المعلم'}
                        </button>

                        <button
                          type="button"
                          disabled={processingId === teacher.id}
                          onClick={() => handleReject(teacher.id)}
                          className="btn py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X size={15} />
                          رفض الطلب
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={processingId === teacher.id}
                        onClick={() => handleReject(teacher.id)}
                        className="col-span-2 py-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-100 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                        إلغاء الاعتماد والتحويل للمراجعة
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for ID Document Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-2">
              <h4 className="text-sm font-black text-[#1B2B5E] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#0EA5E9]" />
                مستند إثبات الهوية / بطاقة الرقم القومي
              </h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50 p-2">
              <img 
                src={previewImage} 
                alt="وثيقة إثبات الهوية" 
                className="max-w-full max-h-[65vh] object-contain rounded-xl"
              />
            </div>

            <div className="pt-3 text-center">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
