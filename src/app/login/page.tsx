'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { loginWithPasswordAction } from '@/actions/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const res = await loginWithPasswordAction(formData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        if (res?.role === 'ADMIN') {
          window.location.href = '/admin';
        } else if (res?.role === 'TEACHER') {
          window.location.href = '/teacher';
        } else if (res?.role === 'INSTRUCTOR') {
          window.location.href = '/instructor';
        } else {
          window.location.href = '/student';
        }
      }
    } catch (err: any) {
      console.error('Login submit error:', err);
      setError('حدث خطأ أثناء الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFF]">
      
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[50%] xl:w-[40%] lg:px-20 relative z-10 py-12">
        
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0EA5E9] transition-colors mb-8 font-medium text-sm">
              <ArrowRight size={16} /> العودة للرئيسية
            </Link>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#1B2B5E] mb-3">مرحباً بعودتك! 👋</h2>
            <p className="text-slate-500 font-medium">قم بتسجيل الدخول لمتابعة رحلتك التعليمية</p>
          </div>

          <div className="friendly-card p-8 border border-slate-100 shadow-sm bg-white rounded-3xl">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف أو البريد الإلكتروني</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="أدخل بريدك أو رقم هاتفك أو admin"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                    required 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">كلمة المرور</label>
                  <Link href="#" className="text-sm font-bold text-[#0EA5E9] hover:underline">نسيت الكلمة؟</Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pl-12 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                    required 
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري التحقق والدخول...
                  </span>
                ) : (
                  <>
                    <LogIn size={20} /> تسجيل الدخول
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-slate-500 font-medium">
            ليس لديك حساب بعد؟{' '}
            <Link href="/register" className="font-bold text-[#0EA5E9] hover:underline">
              أنشئ حساباً مجانياً
            </Link>
          </p>
        </div>
      </div>

      {/* Left Side - Graphic */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-[#1B2B5E] via-[#0F172A] to-[#0EA5E9] overflow-hidden rounded-r-[3rem] shadow-2xl my-4 mr-4">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:32px_32px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0EA5E9]/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-xl relative">
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles size={12} className="text-white fill-white" />
            </div>
            <ShieldCheck size={40} className="text-[#0EA5E9]" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">منصة تعليمية متكاملة <br/><span className="text-sky-300">للمستقبل</span></h2>
          <p className="text-lg text-white/80 font-medium max-w-md leading-relaxed">
            متابعة شاملة للمناهج الدراسية، حصص تفاعلية مباشرة، واختبارات دورية مع أفضل المعلمين المعتمدين.
          </p>
        </div>
      </div>

    </div>
  );
}
