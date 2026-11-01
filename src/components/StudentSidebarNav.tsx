'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, School, Calendar, ClipboardCheck, BookOpen, ShieldCheck, User } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const navItems: NavItem[] = [
  { name: 'لوحة التحكم', href: '/student', icon: LayoutDashboard },
  { name: 'صفي الدراسي', href: '/student/classes', icon: School },
  { name: 'جدول الحصص والمواعيد', href: '/student/schedule', icon: Calendar },
  { name: 'الامتحانات والواجبات', href: '/student/assignments', icon: ClipboardCheck },
  { name: 'دوراتي التدريبية', href: '/student/courses', icon: BookOpen },
  { name: 'الشهادات المعتمدة', href: '/student/certificates', icon: ShieldCheck },
  { name: 'الملف الشخصي', href: '/student/profile', icon: User },
];

export function StudentSidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ padding: '0.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
      {navItems.map((item) => {
        const isActive = item.href === '/student' 
          ? pathname === '/student'
          : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              fontWeight: isActive ? '800' : '600',
              fontSize: '0.92rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0.08) 100%)' 
                : 'transparent',
              color: isActive ? '#FFFFFF' : '#CBD5E1',
              border: isActive 
                ? '1px solid rgba(14, 165, 233, 0.35)' 
                : '1px solid transparent',
              boxShadow: isActive ? '0 4px 14px rgba(14, 165, 233, 0.15)' : 'none',
            }}
            className={isActive ? '' : 'student-nav-item'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Icon 
                size={19} 
                color={isActive ? '#38BDF8' : '#94A3B8'} 
                style={{ flexShrink: 0 }} 
              />
              <span>{item.name}</span>
            </div>
            {isActive && (
              <span 
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#38BDF8',
                  boxShadow: '0 0 8px #38BDF8'
                }} 
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
