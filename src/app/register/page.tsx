'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, BookOpen, Star, GraduationCap, School, Check } from 'lucide-react';
import { registerAction } from '@/actions/auth';

export default function RegisterPage() {
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('role', role);

    const res = await registerAction(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      if (res.role === 'TEACHER' || res.role === 'INSTRUCTOR') {
        router.push('/instructor');
      } else {
        router.push('/student');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFF]">
      
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[50%] xl:w-[45%] lg:px-16 relative z-10 py-12">
        
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0EA5E9] transition-colors mb-6 font-medium text-sm">
              <ArrowRight size={16} /> العودة للرئيسية
            </Link>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#1B2B5E] mb-2">أنشئ حسابك الآن 🚀</h2>
            <p className="text-slate-500 font-medium text-sm">انضم لمنصة ProCourse Online وابدأ رحلتك التعليمية</p>
          </div>

          <div className="friendly-card p-6 sm:p-8 border border-slate-100 shadow-sm">
            
            {/* Account Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-black text-slate-800 mb-2.5">نوع الحساب</label>
              <div className="grid grid-cols-2 gap-3">
                
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-right transition-all ${
                    role === 'STUDENT'
                      ? 'border-[#0EA5E9] bg-sky-50/60 text-[#1B2B5E]'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      role === 'STUDENT' ? 'bg-[#0EA5E9] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <div className="font-black text-sm">طالب</div>
                      <div className="text-[11px] text-slate-400 font-medium">صفوف ودورات</div>
                    </div>
                  </div>
                  {role === 'STUDENT' && (
                    <div className="w-5 h-5 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-right transition-all ${
                    role === 'TEACHER'
                      ? 'border-[#F97316] bg-orange-50/60 text-[#1B2B5E]'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      role === 'TEACHER' ? 'bg-[#F97316] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <School size={18} />
                    </div>
                    <div>
                      <div className="font-black text-sm">معلم / محاضر</div>
                      <div className="text-[11px] text-slate-400 font-medium">تدريس وإدارة</div>
                    </div>
                  </div>
                  {role === 'TEACHER' && (
                    <div className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>

              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">الاسم الكامل <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  placeholder={role === 'TEACHER' ? 'مثال: أ. أحمد السيد' : 'مثال: أحمد محمود'}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الهاتف <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="05xxxxxxxxx أو +2010xxxxxxxx"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  required 
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span></label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="example@procourse.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  dir="ltr"
                />
              </div>

              {role === 'TEACHER' && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">المادة أو التخصص <span className="text-slate-400 font-normal">(اختياري)</span></label>
                  <input 
                    type="text" 
                    name="bio"
                    placeholder="مثال: معلم أول لغة عربية ونصوص"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">كلمة المرور <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  required 
                  dir="ltr"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`btn w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg transition-all mt-3 ${
                  role === 'TEACHER'
                    ? 'bg-[#F97316] hover:bg-[#ea580c] text-white shadow-orange-500/25'
                    : 'bg-[#0EA5E9] hover:bg-[#0284c7] text-white shadow-sky-500/25'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري إنشاء الحساب...
                  </span>
                ) : (
                  <>
                    <UserPlus size={19} /> {role === 'TEACHER' ? 'إنشاء حساب معلم / محاضر' : 'إنشاء حساب طالب'}
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-slate-500 font-medium text-sm">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="font-bold text-[#0EA5E9] hover:underline">
              قم بتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* Left Side - Graphic */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-[#0EA5E9] to-[#1B2B5E] overflow-hidden rounded-r-[3rem] shadow-2xl my-4 mr-4">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:32px_32px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-xl relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-bounce">
              <Star size={16} className="text-white fill-white" />
            </div>
            <BookOpen size={48} className="text-white" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">رحلة تعلم <br/><span className="text-orange-200">تبدأ هنا</span></h2>
          <p className="text-lg lg:text-xl text-white/90 font-medium max-w-lg leading-relaxed">
            الوصول إلى مئات الدورات التدريبية المباشرة والمواد المدرسية لكافة المراحل، مع أفضل المعلمين والمحاضرين في الوطن العربي.
          </p>

          <div className="mt-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-right max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center font-bold">✔</div>
              <p className="font-bold">حسابات مخصصة للطلاب والمعلمين</p>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center font-bold">✔</div>
              <p className="font-bold">صفوف ومناهج معتمدة لكل المراحل</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center font-bold">✔</div>
              <p className="font-bold">شهادات إتمام موثقة برمز كودي</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
