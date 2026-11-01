import Link from 'next/link';
import { LogOut, Bell, Shield, Settings } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { AdminSidebarNav } from '@/components/AdminSidebarNav';
import '../index.css';

export default async function AdminLayout({
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

  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  // Count pending unverified teachers
  const pendingTeachersCount = await prisma.user.count({
    where: {
      role: { in: ['TEACHER', 'INSTRUCTOR'] },
      isVerifiedTeacher: false,
    },
  });

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
          <div style={{ marginTop: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', fontSize: '0.72rem', fontWeight: '800' }}>
            🛡️ لوحة الإدارة العليا
          </div>
        </div>

        {/* Admin Profile Summary Link */}
        <Link 
          href="/admin/profile"
          style={{ 
            margin: '1.25rem 1rem 0.75rem 1rem', 
            padding: '0.85rem 1rem', 
            background: 'rgba(255, 255, 255, 0.06)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '0.75rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          className="hover:bg-white/10 group"
          title="عرض وتعديل الملف الشخصي"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)', flexShrink: 0 }}>
              <Shield size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name || 'مدير المنصة'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user.phone}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-md text-slate-300 group-hover:text-white transition-colors">
            تعديل
          </span>
        </Link>

        {/* Navigation */}
        <AdminSidebarNav pendingTeachersCount={pendingTeachersCount} />

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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1B2B5E' }}>لوحة التحكم والسيطرة العامة</h2>
            {pendingTeachersCount > 0 && (
              <Link 
                href="/admin/teachers/pending"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-colors"
              >
                ⏳ {pendingTeachersCount} طلب اعتماد جديد
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link 
              href="/admin/classes/new" 
              className="btn btn-primary" 
              style={{ 
                padding: '0.55rem 1.15rem', 
                fontSize: '0.85rem', 
                borderRadius: '12px', 
                background: '#0EA5E9', 
                borderColor: '#0EA5E9', 
                color: '#FFFFFF', 
                fontWeight: '700', 
                boxShadow: '0 4px 12px rgba(14,165,233,0.25)' 
              }}
            >
              + إضافة صف أو مادة
            </Link>

            <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>

            {/* Direct Platform Settings Shortcut */}
            <Link 
              href="/admin/settings"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                padding: '0.5rem 0.85rem', 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0', 
                background: '#F8FAFC', 
                color: '#1B2B5E', 
                fontWeight: '700', 
                fontSize: '0.82rem', 
                textDecoration: 'none' 
              }}
              className="hover:bg-slate-100 transition-colors shadow-xs"
              title="إعدادات المنصة"
            >
              <Settings size={16} className="text-[#0EA5E9]" />
              <span>إعدادات المنصة</span>
            </Link>

            {/* Direct Admin Profile Shortcut */}
            <Link 
              href="/admin/profile"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                padding: '0.4rem 0.85rem', 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0', 
                background: '#FFFFFF', 
                color: '#1B2B5E', 
                fontWeight: '700', 
                fontSize: '0.82rem', 
                textDecoration: 'none' 
              }}
              className="hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
              title="الملف الشخصي للإدارة"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                <Shield size={16} />
              </div>
              <div className="text-right">
                <div style={{ fontSize: '0.82rem', lineHeight: '1.2' }}>{user.name || 'مدير المنصة'}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>الملف الشخصي</div>
              </div>
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
