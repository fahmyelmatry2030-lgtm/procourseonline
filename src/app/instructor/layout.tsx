import Link from 'next/link';
import { LogOut, Bell, Clock, ShieldCheck, MessageCircle, FileText } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { InstructorSidebarNav } from '@/components/InstructorSidebarNav';
import '../index.css';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'TEACHER')) {
    redirect('/login');
  }

  // ─── بوابة اعتماد المعلم من الإدارة ───────────────────────────────────────
  if (!user.isVerifiedTeacher) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6" dir="rtl">
        
        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl text-center space-y-6 animate-fade-in">
          
          <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-md">
            <Clock size={40} className="animate-pulse" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-50 border border-amber-200 text-amber-700 mb-3">
              ⏳ طلبك قيد المراجعة والتدقيق من إدارة المنصة
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B2B5E] mb-2">
              أهلاً بك، {user.name || 'أستاذنا الفاضل'}! 🎓
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
              تم استلام بيانات تسجيلك كمعلم ومحاضر بنجاح. يقوم فريق إدارة ProCourse Online حالياً بمراجعة وثائق إثبات الهوية والمؤهلات لاعتماد وتفعيل حسابك رسمياً.
            </p>
          </div>

          {/* Teacher Summary Details */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-right space-y-2.5 text-xs font-semibold">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">المادة والتخصص:</span>
              <span className="text-[#1B2B5E] font-black">{user.subjectSpecialty || 'غير محدد'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">المراحل التعليمية:</span>
              <span className="text-slate-700">{user.teachingStages || 'المرحلة الثانوية'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">المسمى والخبرة:</span>
              <span className="text-slate-700">{user.jobTitle || 'معلم'} — {user.yearsOfExperience || 'خبرة معتمدة'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">الرقم القومي:</span>
              <span className="font-mono text-slate-700">{user.nationalId || 'مُرفق'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">إثبات الهوية (البطاقة / المؤهل):</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                ✔ تم إرفاق الوثيقة وبانتظار اعتماد الإدارة
              </span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-sky-800 text-xs font-medium text-right flex items-start gap-3">
            <ShieldCheck size={20} className="text-[#0EA5E9] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm mb-0.5 text-[#1B2B5E]">لماذا تتطلب المنصة الموافقة؟</p>
              <p className="opacity-90 leading-relaxed">
                لضمان أعلى معايير الجودة ومصداقية المعلمين وحماية حقوق الطلاب وأولياء الأمور، تُراجع إدارة المنصة بيانات كل معلم قبل فتح صلاحيات التدريس والدورات.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/201067825128?text=${encodeURIComponent(`مرحباً إدارة ProCourse Online، قمت بالتسجيل كمعلم باسم (${user.name}) ورقم هاتف (${user.phone})، وأرجو مراجعة واعتماد حسابي.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle size={16} />
              متابعة التفعيل عبر واتساب الإدارة
            </a>
            <Link
              href="/logout"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-5 py-3 rounded-2xl transition-colors"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </Link>
          </div>

        </div>

      </div>
    );
  }

  // ─── إذا تم اعتماد المعلم: تفتح له اللوحة بالكامل ──────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }} dir="rtl">
      
      {/* SaaS Sidebar - Deep Navy Theme & Sticky */}
      <aside 
        style={{ 
          width: '280px', 
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          background: 'linear-gradient(180deg, #1B2B5E 0%, #0F172A 100%)', 
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)', 
          boxShadow: '-4px 0 24px rgba(15, 23, 42, 0.12)',
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 40,
          overflowY: 'auto',
        }}
      >
        
        {/* Brand */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', padding: '0.45rem 1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textDecoration: 'none' }}>
            <img src="/logo.jpg" alt="ProCourse Online" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ marginTop: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', fontSize: '0.72rem', fontWeight: '800' }}>
            ✔ حساب معلم معتمد رسمياً
          </div>
        </div>

        {/* User Profile Summary */}
        <div style={{ margin: '1.25rem 1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.15rem', boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)', flexShrink: 0 }}>
            {(user.name || 'م').charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name || 'محاضر'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{user.subjectSpecialty || user.phone}</div>
          </div>
        </div>

        {/* Dynamic Interactive Navigation with Active State Highlighting */}
        <InstructorSidebarNav />

        {/* Bottom Actions */}
        <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link 
            href="/logout" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              color: '#F87171', 
              padding: '0.75rem 1rem', 
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'background 0.2s',
            }}
            className="hover:bg-red-500/10"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#F8FAFC' }}>
        
        {/* Top Header - Pure White & Sticky */}
        <header 
          style={{ 
            height: '72px', 
            background: '#FFFFFF', 
            borderBottom: '1px solid #E2E8F0', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1B2B5E' }}>لوحة المعلم والمحاضر</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              href="/instructor/courses/new" 
              className="btn btn-primary" 
              style={{ 
                padding: '0.55rem 1.25rem', 
                fontSize: '0.88rem', 
                borderRadius: '12px', 
                background: '#F97316', 
                borderColor: '#F97316', 
                color: '#FFFFFF', 
                fontWeight: '700', 
                boxShadow: '0 4px 12px rgba(249,115,22,0.25)' 
              }}
            >
              + إنشاء دورة جديدة
            </Link>
            <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>
            <button style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} color="#64748B" />
              <span style={{ position: 'absolute', top: '9px', right: '10px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

    </div>
  );
}
