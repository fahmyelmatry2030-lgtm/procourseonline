'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, PlayCircle, Settings, DollarSign, Award } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const navItems: NavItem[] = [
  { name: 'اللوحة الرئيسية', href: '/instructor', icon: LayoutDashboard },
  { name: 'إدارة الدورات', href: '/instructor/courses', icon: BookOpen },
  { name: 'الطلاب', href: '/instructor/students', icon: Users },
  { name: 'المحاضرات المباشرة', href: '/instructor/lectures', icon: PlayCircle },
  { name: 'الكويزات', href: '/instructor/quizzes', icon: Award },
  { name: 'الأرباح', href: '/instructor/revenue', icon: DollarSign },
  { name: 'الإعدادات', href: '/instructor/settings', icon: Settings },
];

export function InstructorSidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ padding: '0.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
      {navItems.map((item) => {
        const isActive = item.href === '/instructor' 
          ? pathname === '/instructor'
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
                ? 'linear-gradient(90deg, rgba(249, 115, 22, 0.22) 0%, rgba(249, 115, 22, 0.08) 100%)' 
                : 'transparent',
              color: isActive ? '#FFFFFF' : '#CBD5E1',
              border: isActive 
                ? '1px solid rgba(249, 115, 22, 0.4)' 
                : '1px solid transparent',
              boxShadow: isActive ? '0 4px 14px rgba(249, 115, 22, 0.18)' : 'none',
            }}
            className={isActive ? '' : 'instructor-nav-item'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Icon 
                size={19} 
                color={isActive ? '#FB923C' : '#94A3B8'} 
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
                  background: '#FB923C',
                  boxShadow: '0 0 8px #FB923C'
                }} 
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
