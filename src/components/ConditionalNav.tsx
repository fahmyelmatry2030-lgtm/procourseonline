'use client';

import { usePathname } from 'next/navigation';

export function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = 
    pathname.startsWith('/student') || 
    pathname.startsWith('/instructor') || 
    pathname.startsWith('/admin');

  if (isDashboard) {
    return null;
  }

  return <>{children}</>;
}
