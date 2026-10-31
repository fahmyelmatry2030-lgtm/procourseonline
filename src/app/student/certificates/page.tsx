import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, ShieldCheck, Calendar, ArrowLeft, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentCertificatesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const certificates = await prisma.certificate.findMany({
    where: { studentId: userId },
    orderBy: { issuedAt: 'desc' },
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--foreground)', margin: 0 }}>
            شهاداتي المعتمدة
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            الشهادات التي حصلت عليها بعد إتمام الدورات والمواد بنجاح
          </p>
        </div>
        <Link href="/verify" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
          فحص وتوثيق شهادة
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="saas-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Award size={34} color="#0EA5E9" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>لا توجد شهادات صادرة لك حتى الآن</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            أكمل حضور المحاضرات والاختبارات الخاصة بموادك ودوراتك لتحصل على شهادات إتمام موثقة برمز كودي معتمد.
          </p>
          <Link href="/student" className="btn btn-primary">
            العودة لمتابعة المذاكرة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
          {certificates.map(cert => (
            <div key={cert.id} className="saas-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                    موثقة رسمياً
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                  {cert.courseName || cert.subjectName || 'شهادة إتمام تعليمية'}
                </h3>

                {(cert.teacherName || cert.instructorName) && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
                    المحاضر / المعلم: <strong style={{ color: 'var(--foreground)' }}>{cert.teacherName || cert.instructorName}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                  <Calendar size={14} /> تاريخ الإصدار: {new Date(cert.issuedAt).toLocaleDateString('ar-EG')}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
                  كود: {cert.id.slice(0, 8)}...
                </span>
                <Link href="/verify" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                  تحقق الآن
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
