'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ArrowRight, Plus } from 'lucide-react';
import { createCourseAction } from '@/actions/course';

export default function NewCoursePage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const res = await createCourseAction(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const labelClass = "block text-sm font-bold text-[var(--muted-foreground)] mb-2";

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link
          href="/instructor"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
        >
          <ArrowRight size={18} /> العودة للوحة التحكم
        </Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="saas-card" style={{ padding: '2.5rem' }}>
          
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79,70,229,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>إنشاء دورة جديدة</h1>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>أضف تفاصيل دورتك التدريبية</p>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Course Title */}
            <div>
              <label className={labelClass}>عنوان الدورة <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="text" name="title" required placeholder="مثال: احتراف تطوير واجهات المستخدم" className={inputClass} />
            </div>

            {/* Short Description */}
            <div>
              <label className={labelClass}>وصف مختصر</label>
              <input type="text" name="shortDescription" placeholder="جملة أو جملتان تصفان الدورة" className={inputClass} />
            </div>

            {/* Full Description */}
            <div>
              <label className={labelClass}>الوصف الكامل <span style={{ color: '#EF4444' }}>*</span></label>
              <textarea
                name="description"
                required
                placeholder="اشرح بالتفصيل محتوى الدورة وما سيتعلمه الطالب..."
                rows={5}
                className={inputClass}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Price & Dates Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className={labelClass}>السعر (USD) <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" name="price" required min="0" step="0.01" placeholder="0 = مجاني" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>الحد الأقصى للطلاب</label>
                <input type="number" name="maxStudents" min="1" placeholder="اتركه فارغاً = غير محدود" className={inputClass} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className={labelClass}>مدة الدورة (بالأسابيع) <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" name="durationWeeks" required min="1" defaultValue={4} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>إجمالي الساعات</label>
                <input type="number" name="totalHours" min="0" defaultValue={0} className={inputClass} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className={labelClass}>تاريخ البدء <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="date" name="startDate" required className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>نهاية التسجيل <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="date" name="registrationEnd" required className={inputClass} dir="ltr" />
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1, padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    جاري الإنشاء...
                  </>
                ) : (
                  <><Plus size={20} /> إنشاء الدورة</>
                )}
              </button>
              <Link href="/instructor" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                إلغاء
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
