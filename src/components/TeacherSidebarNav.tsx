'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  PlayCircle, 
  Award, 
  CalendarCheck, 
  Settings,
  School,
  FileCheck2
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const teacherNavItems: NavItem[] = [
  { name: 'اللوحة الرئيسية للمعلم', href: '/teacher', icon: LayoutDashboard },
  { name: 'صفوفي وموادي الدراسية', href: '/teacher/subjects', icon: School },
  { name: 'جدول الحصص واللقاءات', href: '/teacher/lectures', icon: PlayCircle },
  { name: 'سجل الطلاب والصفوف', href: '/teacher/students', icon: Users },
  { name: 'الواجبات وبنك الأسئلة', href: '/teacher/quizzes', icon: Award },
  { name: 'سجل الحضور والغياب', href: '/teacher/attendance', icon: CalendarCheck },
  { name: 'الإعدادات الشخصية', href: '/teacher/settings', icon: Settings },
];

export function TeacherSidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ padding: '0.4rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
      {teacherNavItems.map((item) => {
        const isActive = item.href === '/teacher'
          ? pathname === '/teacher'
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
              padding: '0.65rem 0.9rem',
              borderRadius: '12px',
              fontWeight: isActive ? '800' : '600',
              fontSize: '0.88rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0.08) 100%)' 
                : 'transparent',
              color: isActive ? '#FFFFFF' : '#CBD5E1',
              border: isActive 
                ? '1px solid rgba(14, 165, 233, 0.45)' 
                : '1px solid transparent',
              boxShadow: isActive ? '0 4px 14px rgba(14, 165, 233, 0.2)' : 'none',
            }}
            className="hover:bg-white/10"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon 
                size={18} 
                color={isActive ? '#38BDF8' : '#94A3B8'} 
                style={{ flexShrink: 0 }} 
              />
              <span>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
