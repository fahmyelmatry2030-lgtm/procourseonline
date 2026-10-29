import './index.css';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { MobileNav } from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'ProCourse Online | رحلتك نحو التعلم',
  description: 'منصة ProCourse Online للتعليم المباشر والتفاعلي',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col pb-[76px] lg:pb-0 relative">
        
        {/* Friendly Navbar */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Logo (Right) */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/logo.jpg"
                    alt="ProCourse Online"
                    width={200}
                    height={60}
                    className="h-14 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* Navigation Links (Center) */}
              <Navigation />

              {/* Actions (Left) */}
              <div className="flex items-center gap-3">
                <Link href="/login" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 transition-colors">
                  تسجيل الدخول
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0EA5E9] text-white text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-200">
                  إنشاء حساب
                </Link>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 relative">
          {children}
        </main>

        {/* Detailed Footer */}
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8 mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Logo & About */}
              <div>
                <Link href="/" className="flex items-center gap-2 text-slate-800 font-bold text-2xl mb-6">
                  <Image
                    src="/logo.jpg"
                    alt="ProCourse Online"
                    width={180}
                    height={54}
                    className="h-12 w-auto object-contain mb-2"
                  />
                </Link>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  منصتك الموثوقة للتعليم المباشر والتفاعلي مع نخبة من الخبراء المعتمدين في مختلف المجالات.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#0EA5E9] hover:text-white transition-colors">W</a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#0EA5E9] hover:text-white transition-colors">T</a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#0EA5E9] hover:text-white transition-colors">F</a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#0EA5E9] hover:text-white transition-colors">L</a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#0EA5E9] hover:text-white transition-colors">E</a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-6">روابط سريعة</h4>
                <ul className="space-y-4">
                  <li><Link href="/" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">الرئيسية</Link></li>
                  <li><Link href="/courses" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">الدورات</Link></li>
                  <li><Link href="/instructors" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">المحاضرون</Link></li>
                  <li><Link href="/verify" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">التحقق من الشهادات</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-6">الدعم</h4>
                <ul className="space-y-4">
                  <li><Link href="/contact" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">تواصل معنا</Link></li>
                  <li><Link href="/faq" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">الأسئلة الشائعة</Link></li>
                  <li><Link href="/privacy" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">سياسة الخصوصية</Link></li>
                  <li><Link href="/terms" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">الشروط والأحكام</Link></li>
                  <li><Link href="/refunds" className="text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors">سياسة الاسترجاع</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-6">تواصل معنا</h4>
                <ul className="space-y-4 text-slate-500 font-medium">
                  <li>البريد: info@almanassa.com</li>
                  <li>الهاتف: +966 50 123 4567</li>
                  <li>المقر: الرياض، المملكة العربية السعودية</li>
                </ul>
              </div>

            </div>

            <div className="pt-8 border-t border-slate-100 text-center text-slate-500 font-medium">
              <p>جميع الحقوق محفوظة © 2026</p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}

