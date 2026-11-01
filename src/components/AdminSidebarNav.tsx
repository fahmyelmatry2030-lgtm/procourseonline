'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  GraduationCap, 
  School, 
  BookOpen, 
  CreditCard,
  ShieldAlert,
  User,
  Settings
} from 'lucide-react';

interface AdminNavProps {
  pendingTeachersCount: number;
}

export function AdminSidebarNav({ pendingTeachersCount }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'اللوحة الرئيسية', href: '/admin', icon: LayoutDashboard },
    { 
      name: 'طلبات اعتماد المعلمين', 
      href: '/admin/teachers/pending', 
      icon: UserCheck, 
      badge: pendingTeachersCount > 0 ? pendingTeachersCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-black animate-pulse'
    },
    { name: 'دليل المعلمين', href: '/admin/teachers', icon: Users },
    { name: 'سجل الطلاب', href: '/admin/students', icon: GraduationCap },
    { name: 'الصفوف والمواد المدرسية', href: '/admin/classes', icon: School },
    { name: 'الدورات التدريبية', href: '/admin/courses', icon: BookOpen },
    { name: 'حسابات المنصة والمالية', href: '/admin/payments', icon: CreditCard },
    { name: 'الملف الشخصي للإدارة', href: '/admin/profile', icon: User },
    { name: 'إعدادات المنصة', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav style={{ padding: '0.4rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
      {navItems.map((item) => {
        const isActive = item.href === '/admin'
          ? pathname === '/admin'
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
              padding: '0.62rem 0.85rem',
              borderRadius: '12px',
              fontWeight: isActive ? '800' : '600',
              fontSize: '0.88rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(239, 68, 68, 0.08) 100%)' 
                : 'transparent',
              color: isActive ? '#FFFFFF' : '#CBD5E1',
              border: isActive 
                ? '1px solid rgba(239, 68, 68, 0.35)' 
                : '1px solid transparent',
              boxShadow: isActive ? '0 4px 14px rgba(239, 68, 68, 0.15)' : 'none',
            }}
            className="hover:bg-white/10"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon 
                size={18} 
                color={isActive ? '#F87171' : '#94A3B8'} 
                style={{ flexShrink: 0 }} 
              />
              <span>{item.name}</span>
            </div>

            {item.badge !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
