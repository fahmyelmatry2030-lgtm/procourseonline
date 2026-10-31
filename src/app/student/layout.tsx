import Link from 'next/link';
import { BookOpen, User, ShieldCheck, LogOut, LayoutDashboard, Settings, Bell, School, Calendar, ClipboardCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import '../index.css';

export default async function StudentLayout({
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

  if (!user || user.role !== 'STUDENT') {
    redirect('/login');
  }

  const navItems = [
    { name: 'لوحة التحكم', href: '/student', icon: LayoutDashboard },
    { name: 'صفي الدراسي', href: '/student/classes', icon: School },
    { name: 'جدول الحصص والمواعيد', href: '/student/schedule', icon: Calendar },
    { name: 'الامتحانات والواجبات', href: '/student/assignments', icon: ClipboardCheck },
    { name: 'دوراتي التدريبية', href: '/student/courses', icon: BookOpen },
    { name: 'الشهادات المعتمدة', href: '/student/certificates', icon: ShieldCheck },
    { name: 'الملف الشخصي', href: '/student/profile', icon: User },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }} dir="rtl">
      
      {/* SaaS Sidebar - Deep Navy Theme */}
      <aside 
        style={{ 
          width: '280px', 
          background: 'linear-gradient(180deg, #1B2B5E 0%, #0F172A 100%)', 
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)', 
          boxShadow: '-4px 0 24px rgba(15, 23, 42, 0.08)',
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 40,
        }}
      >
        
        {/* Brand / Logo */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', padding: '0.45rem 1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textDecoration: 'none' }}>
            <img src="/logo.jpg" alt="ProCourse Online" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>
        </div>

        {/* User Profile Summary */}
        <div style={{ margin: '1.25rem 1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#0EA5E9', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.15rem', boxShadow: '0 4px 14px rgba(14,165,233,0.4)', flexShrink: 0 }}>
            {user.name?.charAt(0) || user.phone.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name || 'طالب'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{user.phone}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '0.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="student-nav-item"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.85rem', 
                padding: '0.8rem 1rem', 
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.92rem',
                textDecoration: 'none',
              }}
            >
              <item.icon size={19} color="#38BDF8" style={{ flexShrink: 0 }} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

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
              fontWeight: '700',
              fontSize: '0.9rem',
              textDecoration: 'none',
              background: 'rgba(239, 68, 68, 0.08)',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={18} />
            تسجيل الخروج
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header - Pure White */}
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1B2B5E', margin: 0 }}>
            مرحباً بك، {user.name || 'طالب'}! 👋
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} color="#64748B" />
              <span style={{ position: 'absolute', top: '9px', right: '10px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
            </button>
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Settings size={18} color="#64748B" />
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

    </div>
  );
}
