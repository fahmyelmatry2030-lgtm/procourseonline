import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, PlayCircle, Settings, DollarSign, LogOut, Bell, Award } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
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

  const navItems = [
    { name: 'اللوحة الرئيسية', href: '/instructor', icon: LayoutDashboard },
    { name: 'إدارة الدورات', href: '/instructor/courses', icon: BookOpen },
    { name: 'الطلاب', href: '/instructor/students', icon: Users },
    { name: 'المحاضرات المباشرة', href: '/instructor/lectures', icon: PlayCircle },
    { name: 'الكويزات', href: '/instructor/quizzes', icon: Award },
    { name: 'الأرباح', href: '/instructor/revenue', icon: DollarSign },
    { name: 'الإعدادات', href: '/instructor/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }} dir="rtl">
      
      {/* SaaS Sidebar - Deep Navy Theme */}
      <aside 
        style={{ 
          width: '280px', 
          background: 'linear-gradient(180deg, #1B2B5E 0%, #0F172A 100%)', 
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)', 
          boxShadow: '-4px 0 24px rgba(15, 23, 42, 0.12)',
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 40,
        }}
      >
        
        {/* Brand */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', padding: '0.45rem 1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', textDecoration: 'none' }}>
            <img src="/logo.jpg" alt="ProCourse Online" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ marginTop: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.18)', border: '1px solid rgba(249, 115, 22, 0.3)', color: '#FB923C', fontSize: '0.72rem', fontWeight: '800' }}>
            🎓 حساب معلم ومحاضر
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

        {/* Navigation */}
        <nav style={{ padding: '0.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="instructor-nav-item" 
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F8FAFC' }}>
        
        {/* Top Header */}
        <header style={{ height: '72px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1B2B5E' }}>لوحة المعلم والمحاضر</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/instructor/courses/new" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem', borderRadius: '12px', background: '#F97316', borderColor: '#F97316', color: '#FFFFFF', fontWeight: '700', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}>
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
