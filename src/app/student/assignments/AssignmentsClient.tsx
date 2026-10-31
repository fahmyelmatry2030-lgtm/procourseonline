'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ClipboardCheck, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Award, 
  Play, 
  ExternalLink,
  ChevronLeft,
  X
} from 'lucide-react';

interface Props {
  studentName: string;
  gradeName: string;
}

export function AssignmentsClient({ studentName, gradeName }: Props) {
  const [activeTab, setActiveTab] = useState<'exams' | 'homework'>('exams');
  const [selectedHomework, setSelectedHomework] = useState<any | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // قائمة الامتحانات المجدولة والسابقة
  const exams = [
    {
      id: 'ex-1',
      title: 'امتحان التقييم الأسبوعي — اللغة العربية (النحو والبلاغة)',
      subject: 'اللغة العربية',
      teacher: 'أ. محمود سامي',
      durationMinutes: 45,
      questionsCount: 20,
      totalScore: 50,
      status: 'AVAILABLE', // AVAILABLE | COMPLETED | UPCOMING
      dueDate: 'متاح حتى يوم الجمعة القادم 11:59 م',
      studentScore: null,
    },
    {
      id: 'ex-2',
      title: 'اختبار الجبر وحساب المثلثات — اختبار شهر أكتوبر',
      subject: 'الرياضيات',
      teacher: 'أ. أحمد السيد',
      durationMinutes: 60,
      questionsCount: 25,
      totalScore: 60,
      status: 'COMPLETED',
      dueDate: 'انتهى في 28 أكتوبر 2026',
      studentScore: 56,
      feedback: 'ممتاز جداً! إجابات نموذجية في خطوات مسائل البرهان.',
    },
    {
      id: 'ex-3',
      title: 'Monthly English Assessment — Units 1 & 2',
      subject: 'اللغة الإنجليزية',
      teacher: 'أ. سارة خالد',
      durationMinutes: 40,
      questionsCount: 20,
      totalScore: 40,
      status: 'AVAILABLE',
      dueDate: 'متاح الآن وحتى السبت 06:00 م',
      studentScore: null,
    },
    {
      id: 'ex-4',
      title: 'اختبار تجريبي شامل — العلوم المتكاملة / الفيزياء',
      subject: 'الفيزياء والعلوم',
      teacher: 'د. خالد السعيد',
      durationMinutes: 50,
      questionsCount: 20,
      totalScore: 50,
      status: 'UPCOMING',
      dueDate: 'يفتح تلقائياً يوم الأحد القادم 05:00 م',
      studentScore: null,
    },
  ];

  // قائمة الواجبات المدرسية
  const homeworks = [
    {
      id: 'hw-1',
      title: 'واجب محاضرة النحو: حل تدريبات كان وأخواتها وبلاغة الاستعارة',
      subject: 'اللغة العربية',
      teacher: 'أ. محمود سامي',
      dueDate: 'غداً الأحد 10:00 م',
      status: 'PENDING', // PENDING | SUBMITTED | GRADED
      instructions: 'حل التدريبات من صفحة 14 إلى 18 في الملخص ورفع صور الحل واضحة.',
      fileUrl: '#',
      submittedDate: null,
      grade: null,
    },
    {
      id: 'hw-2',
      title: 'تمارين الدوال المثلثية ومعادلات الخط المستقيم',
      subject: 'الرياضيات',
      teacher: 'أ. أحمد السيد',
      dueDate: 'الثلاثاء القادم 11:00 م',
      status: 'PENDING',
      instructions: 'حل المسائل من 1 إلى 12 وتدوين خطوات الحل التفصيلية.',
      fileUrl: '#',
      submittedDate: null,
      grade: null,
    },
    {
      id: 'hw-3',
      title: 'English Homework: Writing a 150-word Essay on Modern Tech',
      subject: 'اللغة الإنجليزية',
      teacher: 'أ. سارة خالد',
      dueDate: 'تم التسليم في 29 أكتوبر',
      status: 'GRADED',
      instructions: 'اكتب مقالاً بالإنجليزية مع الالتزام بقواعد القواعد المحددة.',
      fileUrl: '#',
      submittedDate: '29 أكتوبر 2026',
      grade: '19 / 20',
      feedback: 'Great writing and rich vocabulary! Keep up the good work.',
    },
  ];

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setSelectedHomework(null);
    }, 2000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9' }}>
              نظام التقييم والمتابعة المستمرة
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
              {gradeName}
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
            الامتحانات والواجبات المدرسية
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            تابع اختباراتك الدورية وواجباتك المدرسية وسلم الحلول لمتابعة المعلم وولي الأمر
          </p>
        </div>

        {/* Schedule Link */}
        <Link href="/student/schedule" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
          📅 عرض جدول الحصص الأسبوعي
        </Link>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
        
        <div className="saas-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>امتحانات متاحة الآن</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>2 اختبارات</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(249,115,22,0.12)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>واجبات قيد التسليم</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>2 واجبات</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>معدل الدرجات</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10B981' }}>94% (ممتاز)</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.12)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>نسبة الالتزام</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>100%</div>
          </div>
        </div>

      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('exams')}
          style={{
            padding: '0.85rem 1.5rem',
            fontWeight: '800',
            fontSize: '1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'exams' ? '3px solid #0EA5E9' : '3px solid transparent',
            color: activeTab === 'exams' ? '#0EA5E9' : 'var(--muted-foreground)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          <ClipboardCheck size={20} /> الامتحانات والاختبارات ({exams.length})
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          style={{
            padding: '0.85rem 1.5rem',
            fontWeight: '800',
            fontSize: '1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'homework' ? '3px solid #0EA5E9' : '3px solid transparent',
            color: activeTab === 'homework' ? '#0EA5E9' : 'var(--muted-foreground)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          <FileText size={20} /> الواجبات والمهام المدرسية ({homeworks.length})
        </button>
      </div>

      {/* محتوى تبويب الامتحانات */}
      {activeTab === 'exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="saas-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                borderRight: exam.status === 'AVAILABLE' ? '4px solid #0EA5E9' : exam.status === 'COMPLETED' ? '4px solid #10B981' : '4px solid #CBD5E1',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9' }}>
                    {exam.subject}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: exam.status === 'AVAILABLE' ? 'rgba(16,185,129,0.12)' : exam.status === 'COMPLETED' ? 'rgba(99,102,241,0.12)' : 'rgba(148,163,184,0.15)', color: exam.status === 'AVAILABLE' ? '#10B981' : exam.status === 'COMPLETED' ? '#6366F1' : '#64748B' }}>
                    {exam.status === 'AVAILABLE' ? '🟢 متاح الآن للحل' : exam.status === 'COMPLETED' ? '✔️ مكتمل وتم التقييم' : '⏳ قريباً'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: 'var(--foreground)' }}>
                  {exam.title}
                </h3>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--muted-foreground)', flexWrap: 'wrap' }}>
                  <span>👨‍🏫 المعلم: <strong style={{ color: 'var(--foreground)' }}>{exam.teacher}</strong></span>
                  <span>•</span>
                  <span>⏱️ المدة: <strong>{exam.durationMinutes} دقيقة</strong></span>
                  <span>•</span>
                  <span>❓ الأسئلة: <strong>{exam.questionsCount} سؤال</strong></span>
                  <span>•</span>
                  <span>🏆 الدرجة الكلية: <strong>{exam.totalScore} درجة</strong></span>
                </div>

                {exam.status === 'COMPLETED' && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(16,185,129,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Award size={18} color="#10B981" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10B981' }}>
                      درجتك: {exam.studentScore} من {exam.totalScore} ({(exam.studentScore! / exam.totalScore * 100).toFixed(0)}%)
                    </span>
                    {exam.feedback && <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>— {exam.feedback}</span>}
                  </div>
                )}
              </div>

              <div>
                {exam.status === 'AVAILABLE' ? (
                  <button
                    onClick={() => alert(`بدء ${exam.title}\nالمدة: ${exam.durationMinutes} دقيقة\nبالتوفيق!`)}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Play size={16} /> بدء الاختبار الآن
                  </button>
                ) : exam.status === 'COMPLETED' ? (
                  <button
                    onClick={() => alert(`عرض إجاباتك النموذجية في ${exam.title}`)}
                    className="btn btn-outline"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    مراجعة الإجابات والحل
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>
                    {exam.dueDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* محتوى تبويب الواجبات المدرسية */}
      {activeTab === 'homework' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {homeworks.map((hw) => (
            <div
              key={hw.id}
              className="saas-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                borderRight: hw.status === 'PENDING' ? '4px solid #F97316' : '4px solid #10B981',
              }}
            >
              <div style={{ maxWidth: '650px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>
                    {hw.subject}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: hw.status === 'PENDING' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: hw.status === 'PENDING' ? '#EF4444' : '#10B981' }}>
                    {hw.status === 'PENDING' ? '⚠️ مطلوب للتسليم' : '✔️ تم التسليم والتقييم'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: 'var(--foreground)' }}>
                  {hw.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                  {hw.instructions}
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                  <span>👨‍🏫 المعلم: <strong style={{ color: 'var(--foreground)' }}>{hw.teacher}</strong></span>
                  <span>•</span>
                  <span>⏰ الموعد النهائي: <strong style={{ color: hw.status === 'PENDING' ? '#EF4444' : 'var(--foreground)' }}>{hw.dueDate}</strong></span>
                </div>

                {hw.status === 'GRADED' && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(16,185,129,0.06)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10B981' }}>
                      الدرجة: {hw.grade}
                    </div>
                    {hw.feedback && <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>ملاحظة المعلم: {hw.feedback}</div>}
                  </div>
                )}
              </div>

              <div>
                {hw.status === 'PENDING' ? (
                  <button
                    onClick={() => setSelectedHomework(hw)}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F97316' }}
                  >
                    <UploadCloud size={17} /> تسليم وإرسال الحل
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`عرض حل ${hw.title}`)}
                    className="btn btn-outline"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    عرض الملف المسلم
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal نافذة تسليم الواجب */}
      {selectedHomework && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="saas-card" style={{ width: '100%', maxWidth: '540px', padding: '2rem', background: 'var(--card)', position: 'relative' }}>
            
            <button
              onClick={() => setSelectedHomework(null)}
              style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              تسليم الواجب المدرسي
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
              {selectedHomework.title}
            </p>

            {submissionSuccess ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#10B981' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>تم تسليم الواجب بنجاح!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>سيقوم المعلم بمراجعة حلك وإشعارك بالتقييم قريباً.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    ارفع صور كشكول الحل أو ملف PDF <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '2rem 1.5rem', textAlign: 'center', cursor: 'pointer', background: 'var(--muted)' }}>
                    <UploadCloud size={32} color="#0EA5E9" style={{ margin: '0 auto 0.5rem auto' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: '0 0 0.25rem 0' }}>انقر لاختيار الملفات أو اسحبها هنا</p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>يدعم الصور (PNG, JPG) وملفات PDF حتى 25 ميجابايت</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    ملاحظات أو استفسار للمعلم (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="اكتب أي ملاحظة أو استفسار تريد إيصاله لمعلم المادة..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '0.9rem' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.8rem' }}>
                    إرسال الواجب للمعلم
                  </button>
                  <button type="button" onClick={() => setSelectedHomework(null)} className="btn btn-outline" style={{ padding: '0.8rem 1.5rem' }}>
                    إلغاء
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
