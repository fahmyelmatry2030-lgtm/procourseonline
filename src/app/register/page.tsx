'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  ArrowRight, 
  Star, 
  GraduationCap, 
  School, 
  Check, 
  Phone, 
  MapPin, 
  Lock, 
  BookOpen, 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  Briefcase, 
  Award, 
  MessageCircle, 
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { registerAction } from '@/actions/auth';

const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'القليوبية',
  'البحيرة',
  'الغربية',
  'بورسعيد',
  'دمياط',
  'الإسماعيلية',
  'السويس',
  'كفر الشيخ',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء',
  'خارج مصر / دولة أخرى',
];

const STAGES = {
  ابتدائي: [
    'الصف الرابع الابتدائي',
    'الصف الخامس الابتدائي',
    'الصف السادس الابتدائي',
  ],
  إعدادي: [
    'الصف الأول الإعدادي',
    'الصف الثاني الإعدادي',
    'الصف الثالث الإعدادي',
  ],
  ثانوي: [
    'الصف الأول الثانوي',
    'الصف الثاني الثانوي (علمي)',
    'الصف الثاني الثانوي (أدبي)',
    'الصف الثالث الثانوي (علمي علوم)',
    'الصف الثالث الثانوي (علمي رياضة)',
    'الصف الثالث الثانوي (أدبي)',
  ],
};

const TEACHER_SUBJECTS = [
  'اللغة العربية',
  'الرياضيات (عامة وتخصصية)',
  'العلوم المتكاملة',
  'الفيزياء',
  'الكيمياء',
  'الأحياء',
  'الجيولوجيا وعلوم البيئة',
  'اللغة الإنجليزية',
  'اللغة الفرنسية',
  'اللغة الألمانية',
  'اللغة الإيطالية',
  'التاريخ',
  'الجغرافيا',
  'الفلسفة والمنطق',
  'علم النفس والاجتماع',
  'الدراسات الاجتماعية',
  'الحاسب الآلي وتكنولوجيا المعلومات',
  'برمجة وذكاء اصطناعي',
  'تخصص أو مادة أخرى',
];

const TEACHING_STAGES_LIST = [
  'المرحلة الثانوية',
  'المرحلة الإعدادية',
  'المرحلة الابتدائية',
  'دورات تدريبية عامة',
];

const JOB_TITLES = [
  'معلم أول أ',
  'معلم أول',
  'معلم خبير',
  'كبير معلمين',
  'معلم / مدرس',
  'دكتور / محاضر جامعي',
  'مدرب ومحاضر معتمد',
];

const EXPERIENCE_YEARS = [
  'أقل من 3 سنوات',
  'من 3 إلى 5 سنوات',
  'من 5 إلى 10 سنوات',
  'من 10 إلى 15 سنة',
  'أكثر من 15 سنة خبرة',
];

export default function RegisterPage() {
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [stage, setStage] = useState<'ابتدائي' | 'إعدادي' | 'ثانوي'>('ثانوي');
  const [selectedGrade, setSelectedGrade] = useState<string>('الصف الأول الثانوي');
  const [phoneVal, setPhoneVal] = useState<string>('');
  const [whatsappVal, setWhatsappVal] = useState<string>('');
  
  // بيانات المعلم
  const [selectedSubject, setSelectedSubject] = useState<string>('اللغة العربية');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [selectedTeacherStages, setSelectedTeacherStages] = useState<string[]>(['المرحلة الثانوية']);
  const [jobTitleVal, setJobTitleVal] = useState<string>('معلم أول');
  const [experienceVal, setExperienceVal] = useState<string>('من 3 إلى 5 سنوات');
  const [nationalIdVal, setNationalIdVal] = useState<string>('');
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [idCardBase64, setIdCardBase64] = useState<string>('');
  const [idCardFileName, setIdCardFileName] = useState<string>('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStageChange = (newStage: 'ابتدائي' | 'إعدادي' | 'ثانوي') => {
    setStage(newStage);
    setSelectedGrade(STAGES[newStage][0]);
  };

  const toggleTeacherStage = (stageName: string) => {
    setSelectedTeacherStages(prev => 
      prev.includes(stageName)
        ? (prev.length > 1 ? prev.filter(s => s !== stageName) : prev)
        : [...prev, stageName]
    );
  };

  const copyPhoneToWhatsapp = () => {
    if (phoneVal) {
      setWhatsappVal(phoneVal);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الملف كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت.');
        return;
      }
      setIdCardFileName(file.name);

      if (file.type.startsWith('image/')) {
        // ضغط الصورة تلقائياً لتسريع الرفع وتجنب قيود السيرفر
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setIdCardPreview(compressedDataUrl);
            setIdCardBase64(compressedDataUrl);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setIdCardPreview(result);
          setIdCardBase64(result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearFile = () => {
    setIdCardPreview(null);
    setIdCardBase64('');
    setIdCardFileName('');
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('role', role);

    if (role === 'STUDENT') {
      formData.set('gradeLevel', stage);
      formData.set('gradeName', selectedGrade);
    } else {
      const subjectToSubmit = selectedSubject === 'تخصص أو مادة أخرى' && customSubject.trim() 
        ? customSubject.trim() 
        : selectedSubject;
      formData.set('subjectSpecialty', subjectToSubmit);
      formData.set('teachingStages', selectedTeacherStages.join('، '));
      formData.set('jobTitle', jobTitleVal);
      formData.set('yearsOfExperience', experienceVal);
      formData.set('whatsappPhone', whatsappVal || phoneVal);
      formData.set('nationalId', nationalIdVal.trim());
      if (idCardBase64) {
        formData.set('idCardBase64', idCardBase64);
      }
    }

    try {
      const res = await registerAction(formData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        if (res?.role === 'TEACHER' || res?.role === 'INSTRUCTOR') {
          router.push('/instructor');
        } else {
          router.push('/student');
        }
      }
    } catch (err: any) {
      console.error('Registration submit error:', err);
      const detail = err?.message || '';
      setError(detail ? `حدث خطأ في الاتصال: ${detail}` : 'حدث خطأ أثناء الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFF]">
      
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[58%] xl:w-[52%] lg:px-12 relative z-10 py-10">
        
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0EA5E9] transition-colors mb-3 font-medium text-sm">
              <ArrowRight size={16} /> العودة للرئيسية
            </Link>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#1B2B5E] mb-1.5 flex items-center gap-2">
              {role === 'TEACHER' ? 'انضم كمعلم ومحاضر 🎓' : 'أنشئ حسابك كطالب 🚀'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {role === 'TEACHER' 
                ? 'أنشئ صفوفك الدراسية، أدر دوراتك، وتواصل مع طلابك بكل سهولة واحترافية'
                : 'أدخل بياناتك كاملة للبدء في تجربة تعليمية مخصصة ومتابعة درجاتك وحصصك'
              }
            </p>
          </div>

          <div className="friendly-card p-6 sm:p-8 border border-slate-100 shadow-sm bg-white rounded-3xl">
            
            {/* Account Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-black text-slate-800 mb-2">نوع الحساب</label>
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
                      <div className="font-black text-sm">حساب طالب</div>
                      <div className="text-[11px] text-slate-400 font-medium">متابعة صفوف ومواد</div>
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
                      <div className="text-[11px] text-slate-400 font-medium">تدريس وإدارة دورات</div>
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
              
              {/* الاسم الكامل */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {role === 'TEACHER' ? 'الاسم الكامل واللقب العلمي' : 'الاسم الكامل'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  placeholder={role === 'TEACHER' ? 'مثال: أ. أحمد السيد محمد أو د. محمود علي' : 'مثال: أحمد محمود محمد'}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  required 
                />
              </div>

              {/* أرقام الهواتف */}
              {role === 'STUDENT' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      رقم هاتف الطالب <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="010xxxxxxxx"
                      value={phoneVal}
                      onChange={(e) => setPhoneVal(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                      required 
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Phone size={14} className="text-[#0EA5E9]" /> رقم ولي الأمر <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="parentPhone"
                      placeholder="رقم والدك أو والدتك"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>
              ) : (
                /* أرقام المعلم: الهاتف الشخصي + الواتساب للتواصل */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      رقم الهاتف الشخصي <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="010xxxxxxxx"
                      value={phoneVal}
                      onChange={(e) => setPhoneVal(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                      required 
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-bold text-slate-700 flex items-center gap-1">
                        <MessageCircle size={14} className="text-emerald-500" /> رقم الواتساب للتواصل
                      </label>
                      {phoneVal && (
                        <button
                          type="button"
                          onClick={copyPhoneToWhatsapp}
                          className="text-[11px] font-bold text-[#0EA5E9] hover:underline"
                        >
                          ⚡ نفس رقم الهاتف
                        </button>
                      )}
                    </div>
                    <input 
                      type="tel" 
                      name="whatsappPhone"
                      placeholder="للتواصل مع الطلاب وأولياء الأمور"
                      value={whatsappVal}
                      onChange={(e) => setWhatsappVal(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {/* قسم خاص بالمعلم: المادة والمراحل التعليمية */}
              {role === 'TEACHER' && (
                <div className="bg-orange-50/40 p-4 sm:p-5 rounded-2xl border border-orange-100/80 space-y-4 animate-fade-in">
                  
                  <div className="flex items-center gap-2 text-sm font-black text-[#1B2B5E]">
                    <Briefcase size={16} className="text-[#F97316]" />
                    البيانات التخصصية والمهنية
                  </div>

                  {/* المادة أو التخصص */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      المادة أو التخصص الأساسي <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-[#F97316] focus:outline-none cursor-pointer"
                    >
                      {TEACHER_SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>

                    {selectedSubject === 'تخصص أو مادة أخرى' && (
                      <input
                        type="text"
                        placeholder="اكتب اسم المادة أو التخصص هنا..."
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-orange-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 focus:border-[#F97316] focus:outline-none animate-fade-in"
                        required
                      />
                    )}
                  </div>

                  {/* المراحل الدراسية التي يدرسها */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      المراحل الدراسية التي تقوم بتدريسها <span className="text-slate-400 font-normal">(يمكن تحديد أكثر من مرحلة)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TEACHING_STAGES_LIST.map((stg) => {
                        const isSelected = selectedTeacherStages.includes(stg);
                        return (
                          <button
                            key={stg}
                            type="button"
                            onClick={() => toggleTeacherStage(stg)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>{stg}</span>
                            {isSelected && <Check size={13} strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* المسمى الوظيفي وسنوات الخبرة */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">المسمى الوظيفي</label>
                      <select
                        value={jobTitleVal}
                        onChange={(e) => setJobTitleVal(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-[#F97316] focus:outline-none cursor-pointer"
                      >
                        {JOB_TITLES.map((title) => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">سنوات الخبرة</label>
                      <select
                        value={experienceVal}
                        onChange={(e) => setExperienceVal(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-[#F97316] focus:outline-none cursor-pointer"
                      >
                        {EXPERIENCE_YEARS.map((exp) => (
                          <option key={exp} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* اسم المدرسة أو السنتر أو نبذة */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      اسم المدرسة / السنتر أو نبذة تعريفية <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <input 
                      type="text" 
                      name="bio"
                      placeholder="مثال: معلم لغة عربية بمدرسة المتفوقين وسنتر الأوائل"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 focus:border-[#F97316] focus:outline-none"
                    />
                  </div>

                </div>
              )}

              {/* قسم إثبات الهوية والتحقق المهني (للمعلم فقط) */}
              {role === 'TEACHER' && (
                <div className="bg-sky-50/50 p-4 sm:p-5 rounded-2xl border border-sky-100 space-y-3.5 animate-fade-in">
                  
                  <div className="flex items-center gap-2 text-sm font-black text-[#1B2B5E]">
                    <ShieldCheck size={18} className="text-[#0EA5E9]" />
                    توثيق الحساب وإثبات الهوية
                  </div>
                  
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    لضمان مصداقية المنصة وحماية حقوق الطلاب، يرجى إدخال رقم بطاقتك القومية ورفع صورة لإثبات الهوية (بطاقة الرقم القومي أو كارنيه النقابة أو المؤهل).
                  </p>

                  {/* رقم بطاقة الرقم القومي */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم بطاقة الرقم القومي (14 رقماً) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="nationalId"
                      maxLength={14}
                      value={nationalIdVal}
                      onChange={(e) => setNationalIdVal(e.target.value.replace(/\D/g, ''))}
                      placeholder="أدخل الـ 14 رقماً للرقم القومي المصري"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 tracking-wider focus:border-[#0EA5E9] focus:outline-none"
                      required
                      dir="ltr"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {nationalIdVal.length}/14 رقماً
                    </span>
                  </div>

                  {/* رفع صورة البطاقة أو كارنيه النقابة */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      صورة إثبات الهوية (وجه البطاقة أو كارنيه النقابة / المؤهل)
                    </label>

                    {!idCardPreview ? (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-200 hover:border-[#0EA5E9] bg-white rounded-2xl p-4 cursor-pointer transition-all group">
                        <UploadCloud size={28} className="text-[#0EA5E9] group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-xs font-bold text-slate-700">اضغط لرفع الصورة أو اسحب الملف هنا</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">صورة JPG أو PNG أو مستند PDF (بحد أقصى 5 ميجابايت)</span>
                        <input 
                          type="file" 
                          accept="image/*,.pdf" 
                          onChange={handleFileChange}
                          className="hidden" 
                        />
                      </label>
                    ) : (
                      <div className="relative bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {idCardPreview.startsWith('data:image') ? (
                            <img 
                              src={idCardPreview} 
                              alt="معاينة إثبات الهوية" 
                              className="w-14 h-14 object-cover rounded-xl border border-slate-100 shadow-xs"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-sky-100 text-[#0EA5E9] rounded-xl flex items-center justify-center font-bold">
                              <FileText size={24} />
                            </div>
                          )}
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{idCardFileName || 'مستند إثبات الهوية'}</p>
                            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                              <Check size={12} /> تم إرفاق الملف بنجاح
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={clearFile}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title="حذف الملف"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-sky-100/60 text-[11px] text-slate-500">
                    <Info size={14} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                    <span>تُحفظ وثائق إثبات الهوية بسرية تامة ومحمية بتشفير عالي، وتُستخدم حصرياً لمراجعة واعتماد حساب المعلم ولن تظهر للعامة.</span>
                  </div>

                </div>
              )}

              {/* المحافظة والبريد الإلكتروني */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <MapPin size={14} className="text-[#F97316]" /> المحافظة / المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="governorate"
                    defaultValue="القاهرة"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                    required
                  >
                    {GOVERNORATES.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
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
              </div>

              {/* قسم خاص بالطالب: المرحلة والصف الدراسي */}
              {role === 'STUDENT' && (
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#1B2B5E]">
                    <BookOpen size={16} className="text-[#0EA5E9]" />
                    المرحلة والصف الدراسي
                  </div>

                  {/* أزرار المراحل */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['ابتدائي', 'إعدادي', 'ثانوي'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStageChange(s)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          stage === s
                            ? 'bg-[#0EA5E9] text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        المرحلة ال{s}
                      </button>
                    ))}
                  </div>

                  {/* اختيار الصف المباشر */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">الصف المحدد</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-[#0EA5E9] focus:outline-none cursor-pointer"
                    >
                      {STAGES[stage].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* كلمة المرور وتأكيد كلمة المرور */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Lock size={14} className="text-slate-400" /> كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                    required 
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Lock size={14} className="text-slate-400" /> تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                    required 
                    dir="ltr"
                  />
                </div>
              </div>

              {/* زر التسجيل */}
              <button 
                type="submit" 
                disabled={loading}
                className={`btn w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-lg transition-all mt-4 ${
                  role === 'TEACHER'
                    ? 'bg-[#F97316] hover:bg-[#ea580c] text-white shadow-orange-500/25'
                    : 'bg-[#0EA5E9] hover:bg-[#0284c7] text-white shadow-sky-500/25'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري إنشاء الحساب والتحقق...
                  </span>
                ) : (
                  <>
                    <UserPlus size={19} /> {role === 'TEACHER' ? 'إنشاء حساب وتوثيق المعلم' : 'إنشاء حساب طالب الآن'}
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

      {/* Left Side - Graphic Banner */}
      <div className={`hidden lg:block relative flex-1 transition-all duration-700 overflow-hidden rounded-r-[3rem] shadow-2xl my-4 mr-4 ${
        role === 'TEACHER'
          ? 'bg-gradient-to-br from-[#1B2B5E] via-[#0F172A] to-[#C2410C]'
          : 'bg-gradient-to-br from-[#0EA5E9] to-[#1B2B5E]'
      }`}>
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:32px_32px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
          
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-xl relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-bounce">
              <Star size={16} className="text-white fill-white" />
            </div>
            {role === 'TEACHER' ? (
              <School size={48} className="text-amber-300" />
            ) : (
              <BookOpen size={48} className="text-white" />
            )}
          </div>
          
          {role === 'TEACHER' ? (
            <>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                منصة المعلم المتميز <br/>
                <span className="text-orange-300">أدر طلابك باحترافية</span>
              </h2>
              <p className="text-lg lg:text-xl text-white/90 font-medium max-w-lg leading-relaxed">
                انضم إلى نخبة المحاضرين والمعلمين، وأنشئ فصولك الافتراضية، وقدم حصصك المباشرة وسجل حضور الطلاب وحصّل الاشتراكات بكل مرونة.
              </p>

              <div className="mt-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-right max-w-sm w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm">✔</div>
                  <p className="font-bold text-sm">إدارة الحصص المباشرة ومواعيد الجدول</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm">✔</div>
                  <p className="font-bold text-sm">بنك أسئلة واختبارات وتصحيح واجبات تلقائي</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm">✔</div>
                  <p className="font-bold text-sm">اعتماد موثق وشهادات رسمية للمشتركين</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                رحلة تعلم متكاملة <br/>
                <span className="text-orange-200">تبدأ هنا</span>
              </h2>
              <p className="text-lg lg:text-xl text-white/90 font-medium max-w-lg leading-relaxed">
                الوصول إلى المناهج المدرسية لجميع الصفوف والدورات التدريبية المعتمدة، مع أفضل المعلمين ونظام متابعة مستمر لأولياء الأمور.
              </p>

              <div className="mt-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-right max-w-sm w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold text-sm">✔</div>
                  <p className="font-bold text-sm">متابعة دراسية دقيقة مع ولي الأمر</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold text-sm">✔</div>
                  <p className="font-bold text-sm">تحديد تلقائي للصف الدراسي والمواد</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold text-sm">✔</div>
                  <p className="font-bold text-sm">اختبارات دورية وشهادات إتمام موثقة</p>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
