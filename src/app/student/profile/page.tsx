import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Phone, MapPin, GraduationCap, School, Calendar, ShieldCheck, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) redirect('/login');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '850px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', display: 'inline-block', marginBottom: '0.4rem' }}>
          بيانات الحساب الشخصي
        </span>
        <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
          الملف الشخصي للطالب
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
          عرض وتأكيد بيانات الطالب المسجلة والمرحلة التعليمية وهاتف ولي الأمر
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="saas-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        
        {/* Top Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #1B2B5E)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '2rem', boxShadow: '0 8px 24px rgba(14,165,233,0.35)' }}>
            {user.name?.charAt(0) || user.phone.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, color: 'var(--foreground)' }}>
                {user.name || 'طالب'}
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} /> حساب نشط
              </span>
            </div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
              طالب مسجل في منصة ProCourse Online
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.75rem' }}>
          
          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '0.35rem' }}>
              <Phone size={15} color="#0EA5E9" /> رقم هاتف الطالب
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--foreground)' }} dir="ltr">
              {user.phone}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '0.35rem' }}>
              <Phone size={15} color="#F97316" /> رقم هاتف ولي الأمر
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F97316' }} dir="ltr">
              {user.parentPhone || 'غير مسجل'}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '0.35rem' }}>
              <GraduationCap size={15} color="#0EA5E9" /> الصف الدراسي
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--foreground)' }}>
              {user.gradeName || 'الصف الأول الثانوي'}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '0.35rem' }}>
              <School size={15} color="#0EA5E9" /> المرحلة الدراسية
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--foreground)' }}>
              المرحلة {user.gradeLevel || 'ثانوي'}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '0.35rem' }}>
              <MapPin size={15} color="#0EA5E9" /> المحافظة / المدينة
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--foreground)' }}>
              {user.governorate || 'مصر'}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontWeight: '700', marginBottom: '0.35rem' }}>
              <Mail size={15} color="#0EA5E9" /> البريد الإلكتروني
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--foreground)' }}>
              {user.email || 'لا يوجد بريد إلكتروني'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
