import Link from 'next/link';
import { LogOut, Bell, Clock, ShieldCheck, MessageCircle, School, ArrowRightLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { TeacherSidebarNav } from '@/components/TeacherSidebarNav';
import '../index.css';

export default async function TeacherLayout({
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

  if (!user || (user.role !== 'TEACHER' && user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  // Gate check: Admin approval required
  if (!user.isVerifiedTeacher && user.role !== 'ADMIN') {
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
              أهلاً بك يا أستاذ {user.name || 'الفاضل'}! 🏫
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
              تم استلام بياناتك وتخصصك التعليمي بنجاح. تقوم إدارة المنصة حالياً بمراجعة واعتماد حسابك لفتح لوحة الصفوف والمناهج المدرسية.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-right space-y-2.5 text-xs font-semibold">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">المادة المدرسية والتخصص:</span>
              <span className="text-[#1B2B5E] font-black">{user.subjectSpecialty || 'غير محدد'}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">المراحل التعليمية:</span>
              <span className="text-slate-700">{user.teachingStages || 'المرحلة الثانوية'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">الرقم القومي وإثبات الهوية:</span>
              <span className="text-emerald-600 font-bold">✔ مُرفق وبانتظار اعتماد الإدارة</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/201067825128?text=${encodeURIComponent(`مرحباً إدارة ProCourse Online، قمت بالتسجيل كمعلم مدرسي باسم (${user.name}) ورقم هاتف (${user.phone})، وأرجو اعتماد حسابي.`)}`}
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
          <div style={{ marginTop: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.18)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#38BDF8', fontSize: '0.72rem', fontWeight: '800' }}>
            🏫 لوحة المعلم المدرسي
          </div>
        </div>

        {/* User Card */}
        <div style={{ margin: '1.25rem 1rem 0.75rem 1rem', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)', flexShrink: 0 }}>
            {(user.name || 'م').charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name || 'المعلم'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user.subjectSpecialty || 'المناهج المدرسية'}</div>
          </div>
        </div>

        {/* Workspace Switcher (If instructor mode is also needed) */}
        <div style={{ padding: '0 1rem 0.75rem 1rem' }}>
          <Link
            href="/instructor"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 transition-colors"
            title="الانتقال إلى لوحة الكورسات والتدريب الحر"
          >
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft size={13} className="text-amber-400" />
              <span>لوحة الكورسات الحرة</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md">تبديل</span>
          </Link>
        </div>

        {/* Navigation */}
        <TeacherSidebarNav />

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
          <div className="flex items-center gap-3">
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#1B2B5E' }}>
              لوحة المناهج والصفوف المدرسية
            </h2>
            <span className="text-xs font-bold text-slate-400">العام الدراسي 2025 - 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link 
              href="/teacher/lectures" 
              className="btn btn-primary" 
              style={{ 
                padding: '0.55rem 1.25rem', 
                fontSize: '0.85rem', 
                borderRadius: '12px', 
                background: '#0EA5E9', 
                borderColor: '#0EA5E9', 
                color: '#FFFFFF', 
                fontWeight: '700', 
                boxShadow: '0 4px 12px rgba(14,165,233,0.25)' 
              }}
            >
              + إضافة حصة مدرسية
            </Link>
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
