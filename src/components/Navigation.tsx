'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الصفوف الدراسية', href: '/classes' },
    { name: 'الدورات', href: '/courses' },
    { name: 'المعلمون والمحاضرون', href: '/instructors' },
    { name: 'التحقق من الشهادات', href: '/verify' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {links.map((link) => {
        const isActive = link.href === '/' 
          ? pathname === '/'
          : pathname.startsWith(link.href);
        
        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${
              isActive 
                ? 'bg-sky-50 text-[#0EA5E9]' 
                : 'text-slate-600 hover:text-[#0EA5E9] hover:bg-slate-50'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
