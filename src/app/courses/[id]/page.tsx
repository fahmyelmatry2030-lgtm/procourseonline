import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle, Users, Calendar, Star, CheckCircle2, MonitorPlay, Clock, ShieldCheck } from 'lucide-react';
import { getDynamicCourseStatus } from '@/lib/courseStatus';

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course: any = null;
  try {
    course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        enrollments: true,
        reviews: { include: { student: true } },
        lectures: { orderBy: { createdAt: 'asc' } },
      },
    });
  } catch (error) {
    console.error('Error fetching course:', error);
  }

  if (!course) notFound();

  const dynamicStatus = getDynamicCourseStatus(course);
  const seatsTaken = course.enrollments?.length || 0;
  const rating =
    course.reviews?.length > 0
      ? (course.reviews.reduce((a: number, b: any) => a + b.rating, 0) / course.reviews.length).toFixed(1)
      : 'جديد';
  const totalHours = course.totalHours || 0;

  return (
    <div style={{ background: '#F8FAFF', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* SaaS Hero Banner */}
      <div style={{ background: '#09090B', color: 'white', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: 'radial-gradient(ellipse at top, rgba(14, 165, 233, 0.25) 0%, transparent 60%)', zIndex: 0 }}></div>
        <div className="container-saas" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left/Right Text Content (RTL) */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div className="badge badge-primary" style={{ background: 'rgba(14, 165, 233, 0.2)' }}>{dynamicStatus}</div>
              <div className="badge badge-warning" style={{ background: 'rgba(245, 158, 11, 0.15)' }}><Star size={14} fill="currentColor" /> {rating}</div>
              <div className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)' }}><Users size={14} /> {seatsTaken} طالب</div>
            </div>
            
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>{course.title}</h1>
            <p style={{ fontSize: '1.15rem', color: '#A1A1AA', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '700px' }}>
              {course.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                {(course.instructor?.name || 'M').charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#A1A1AA' }}>بإشراف المحاضر</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{course.instructor?.name || course.instructor?.phone || 'مدرس معتمد'}</div>
              </div>
            </div>
          </div>
          
          {/* Sticky Floating Registration Card Placeholder */}
          <div className="saas-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', marginTop: '-100px', zIndex: 10 }}>
            <div style={{ height: '200px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <PlayCircle size={64} color="var(--muted-foreground)" opacity={0.5} />
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--foreground)' }}>${course.price.toFixed(2)}</div>
              <div style={{ textDecoration: 'line-through', color: 'var(--muted-foreground)' }}>${(course.price * 1.5).toFixed(2)}</div>
            </div>
            
            <Link href={`/payment/${course.id}`} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              سجل الآن
            </Link>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MonitorPlay size={16} /> وصول مدى الحياة للمحاضرات المسجلة</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} /> شهادة معتمدة بعد الإتمام</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> إجمالي الساعات: {totalHours.toFixed(1)} ساعة</div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Tabs & Content Area */}
      <div className="container-saas" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem' }}>
        
        {/* Main Content */}
        <div>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '3rem' }}>
            {['نظرة عامة', 'المنهج والمحاضرات', 'المحاضر', 'التقييمات'].map((tab, i) => (
              <div key={tab} style={{ padding: '1rem 0', fontWeight: '600', color: i === 0 ? 'var(--primary)' : 'var(--muted-foreground)', borderBottom: i === 0 ? '2px solid var(--primary)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                {tab}
              </div>
            ))}
          </div>
          
          {/* Overview Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>عن هذه الدورة</h2>
            <div style={{ lineHeight: '1.8', color: 'var(--muted-foreground)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {course.description || 'تعتبر هذه الدورة من أقوى الدورات المتخصصة في مجالها، حيث صممت خصيصاً لتزويدك بالمهارات العملية المطلوبة في سوق العمل.'}
            </div>
            
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>ماذا ستتعلم؟</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--foreground)' }}>
                  <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.95rem' }}>إتقان المهارات العملية الأساسية والمتقدمة وتطبيقها في مشاريع حقيقية.</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>منهج الدورة ({course.lectures?.length || 0} محاضرات)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!course.lectures || course.lectures.length === 0 ? (
                <div style={{ padding: '2rem', background: 'var(--muted)', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--muted-foreground)' }}>لم يتم إضافة محاضرات بعد.</div>
              ) : (
                course.lectures.map((l: any, idx: number) => (
                  <div key={l.id} className="saas-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{l.title}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} /> {l.date ? new Date(l.date).toLocaleString('ar-EG') : 'غير محدد'}
                        </div>
                      </div>
                    </div>
                    <div className="badge badge-accent"><MonitorPlay size={14} /> {l.type === 'LIVE' ? 'مباشر' : 'مسجل'}</div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
        
        <div></div>
      </div>

    </div>
  );
}
