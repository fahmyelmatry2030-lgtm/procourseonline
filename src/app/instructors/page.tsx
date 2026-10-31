import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Star, BookOpen, Users, ChevronLeft, Award, GraduationCap, School } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const activeType = params?.type || 'all';

  let dbInstructors: any[] = [];
  let dbTeachers: any[] = [];

  try {
    dbInstructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      include: {
        courses: {
          include: { reviews: true, enrollments: true },
        },
      },
    });

    dbTeachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      include: {
        subjects: {
          include: { class: true },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching instructors/teachers:', error);
  }

  // Mock course instructors
  const mockInstructors = [
    {
      id: 'mock-inst-1',
      name: 'د. محمود سامي',
      bio: 'أستاذ جامعي ومحاضر في الذكاء الاصطناعي وهندسة البيانات، أشرف على تطوير مشاريع تقنية كبرى.',
      role: 'INSTRUCTOR',
      specialty: 'الذكاء الاصطناعي والبيانات',
      courseCount: 4,
      totalStudents: 1540,
      rating: 4.9,
    },
    {
      id: 'mock-inst-2',
      name: 'خالد السعيد',
      bio: 'مستشار أمن سيبراني ومدرب معتمد من عدة جهات دولية، متخصص في اختبار الاختراق وحماية الأنظمة.',
      role: 'INSTRUCTOR',
      specialty: 'الأمن السيبراني',
      courseCount: 3,
      totalStudents: 1200,
      rating: 5.0,
    },
    {
      id: 'mock-inst-3',
      name: 'سارة خالد',
      bio: 'مصممة واجهات وتجربة مستخدم (UI/UX) بخبرة تزيد عن 8 سنوات في تصميم المنتجات الرقمية الحديثة.',
      role: 'INSTRUCTOR',
      specialty: 'تصميم واجهات المستخدم UI/UX',
      courseCount: 3,
      totalStudents: 980,
      rating: 4.9,
    },
    {
      id: 'mock-inst-4',
      name: 'منى علي',
      bio: 'خبيرة في التسويق الرقمي وتنمية الأعمال، مدربة معتمدة في استراتيجيات الإعلانات الممولة.',
      role: 'INSTRUCTOR',
      specialty: 'التسويق الرقمي وإدارة النمو',
      courseCount: 5,
      totalStudents: 2100,
      rating: 4.8,
    },
  ];

  // Mock school teachers
  const mockTeachers = [
    {
      id: 'mock-teach-1',
      name: 'أ. أحمد السيد',
      bio: 'معلم أول مادة الرياضيات للمرحلتين الإعدادية والثانوية، أسلوب مبسط لحل أصعب المسائل بمهارة عالية.',
      role: 'TEACHER',
      specialty: 'الرياضيات — إعدادي وثانوي',
      subjectCount: 4,
      totalStudents: 850,
      rating: 5.0,
    },
    {
      id: 'mock-teach-2',
      name: 'أ. محمود عبد الرحمن',
      bio: 'معلم لغة عربية خبير في قواعد النحو والبلاغة والنصوص الأدبية، تدريب مكثف على أسئلة الامتحانات.',
      role: 'TEACHER',
      specialty: 'اللغة العربية والبلاغة',
      subjectCount: 3,
      totalStudents: 1100,
      rating: 4.9,
    },
    {
      id: 'mock-teach-3',
      name: 'د. سارة فؤاد',
      bio: 'دكتوراه في العلوم، معلمة لمادتي الكيمياء والفيزياء لطلاب المرحلة الثانوية بشرح تجارب عملية تفاعلية.',
      role: 'TEACHER',
      specialty: 'الكيمياء والفيزياء — ثانوي',
      subjectCount: 3,
      totalStudents: 920,
      rating: 4.9,
    },
    {
      id: 'mock-teach-4',
      name: 'أ. هالة إبراهيم',
      bio: 'معلمة لغة إنجليزية معتمدة، متخصصة في تأسيس القواعد والمحادثة وتدريب الطلاب على أعلى الدرجات.',
      role: 'TEACHER',
      specialty: 'اللغة الإنجليزية — كل المراحل',
      subjectCount: 4,
      totalStudents: 1300,
      rating: 4.8,
    },
  ];

  // Normalize items
  const formattedInstructors = [
    ...dbInstructors.map((inst) => {
      const allReviews = inst.courses?.flatMap((c: any) => c.reviews || []) || [];
      const rating =
        allReviews.length > 0
          ? (allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length).toFixed(1)
          : '4.9';
      const totalStudents = inst.courses?.reduce((acc: number, c: any) => acc + (c.enrollments?.length || 0), 0) || 0;
      return {
        id: inst.id,
        name: inst.name || inst.phone,
        bio: inst.bio || 'محاضر خبير معتمد في تقديم الدورات المهنية والتقنية.',
        role: 'INSTRUCTOR',
        specialty: 'دورات احترافية',
        courseCount: inst.courses?.length || 1,
        totalStudents: totalStudents || 120,
        rating: Number(rating),
      };
    }),
    ...mockInstructors,
  ];

  const formattedTeachers = [
    ...dbTeachers.map((teach) => ({
      id: teach.id,
      name: teach.name || teach.phone,
      bio: teach.bio || (teach.jobTitle ? `${teach.jobTitle} - خبرة ${teach.yearsOfExperience || 'ممتازة'}` : 'معلم متخصص في تدريس المناهج الدراسية ومتابعة الطلاب خطوة بخطوة.'),
      role: 'TEACHER',
      specialty: teach.subjectSpecialty || (teach.subjects?.[0]?.name ? `مادة ${teach.subjects[0].name}` : 'مناهج دراسية'),
      subjectCount: teach.subjects?.length || 1,
      totalStudents: 340,
      rating: 4.9,
    })),
    ...mockTeachers,
  ];

  let displayList: any[] = [];
  if (activeType === 'teachers') {
    displayList = formattedTeachers;
  } else if (activeType === 'instructors') {
    displayList = formattedInstructors;
  } else {
    // Interleave or combine both
    displayList = [...formattedTeachers.slice(0, 4), ...formattedInstructors.slice(0, 4)];
  }

  return (
    <div className="bg-[#F8FAFF] min-h-screen py-16 relative overflow-hidden">
      <div className="hero-glow opacity-50 hidden md:block"></div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-12 relative">
          <div className="friendly-badge mb-4 mx-auto w-fit">
            <GraduationCap size={16} /> فريق التدريس والخبراء
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1B2B5E] mb-4">
            نخبة <span className="text-[#0EA5E9]">المعلمين والمحاضرين</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            فخورون بضم نخبة من أفضل معلمي المناهج المدرسية ومحاضري الدورات التدريبية المعتمدة لتقديم تجربة تعليمية متميزة.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center items-center gap-3 mb-12 flex-wrap">
          <Link
            href="/instructors"
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
              activeType === 'all'
                ? 'bg-[#0EA5E9] text-white shadow-sky-500/25'
                : 'bg-white text-slate-600 hover:text-[#0EA5E9] border border-slate-200'
            }`}
          >
            الكل ({formattedTeachers.length + formattedInstructors.length})
          </Link>
          <Link
            href="/instructors?type=teachers"
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
              activeType === 'teachers'
                ? 'bg-[#F97316] text-white shadow-orange-500/25'
                : 'bg-white text-slate-600 hover:text-[#F97316] border border-slate-200'
            }`}
          >
            <School size={16} /> معلمو المناهج المدرسية ({formattedTeachers.length})
          </Link>
          <Link
            href="/instructors?type=instructors"
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
              activeType === 'instructors'
                ? 'bg-[#0EA5E9] text-white shadow-sky-500/25'
                : 'bg-white text-slate-600 hover:text-[#0EA5E9] border border-slate-200'
            }`}
          >
            <Award size={16} /> محاضرو الدورات التدريبية ({formattedInstructors.length})
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayList.map((item) => {
            const isTeacher = item.role === 'TEACHER';
            const badgeBg = isTeacher ? 'bg-orange-50 text-[#F97316]' : 'bg-sky-50 text-[#0EA5E9]';
            const bannerGradient = isTeacher
              ? 'from-orange-100 to-amber-50'
              : 'from-sky-100 to-teal-50';
            const avatarGradient = isTeacher
              ? 'from-[#F97316] to-[#FB923C]'
              : 'from-[#0EA5E9] to-[#0284C7]';

            return (
              <div
                key={item.id}
                className="friendly-card flex flex-col border border-slate-100 overflow-hidden group hover:border-slate-200"
              >
                {/* Header Banner */}
                <div className={`h-28 bg-gradient-to-r ${bannerGradient} relative`}>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full shadow-sm ${badgeBg}`}>
                      {isTeacher ? (
                        <>
                          <School size={13} /> معلم مدرسي
                        </>
                      ) : (
                        <>
                          <Award size={13} /> محاضر معتمد
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 text-center flex-1 flex flex-col">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-white p-1 mx-auto -mt-10 mb-3 relative z-10 shadow-md">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-2xl font-black text-white`}>
                      {(item.name || 'م').charAt(0)}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#1B2B5E] mb-1">{item.name}</h3>
                  <div className="text-xs font-bold text-slate-400 mb-3">
                    {item.specialty}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {item.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-6">
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-base mb-0.5">
                        <Star size={15} fill="currentColor" /> {item.rating}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">التقييم</div>
                    </div>
                    <div className="w-px h-7 bg-slate-100"></div>
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-1 text-[#0EA5E9] font-black text-base mb-0.5">
                        <BookOpen size={15} /> {isTeacher ? item.subjectCount : item.courseCount}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {isTeacher ? 'مواد' : 'دورات'}
                      </div>
                    </div>
                    <div className="w-px h-7 bg-slate-100"></div>
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-1 text-[#F97316] font-black text-base mb-0.5">
                        <Users size={15} /> {item.totalStudents}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">طالب</div>
                    </div>
                  </div>

                  <Link
                    href={isTeacher ? `/classes` : `/instructors/${item.id}`}
                    className={`btn btn-outline w-full rounded-full flex items-center justify-center gap-2 text-sm py-2.5 transition-all ${
                      isTeacher
                        ? 'hover:bg-[#F97316] hover:text-white hover:border-[#F97316]'
                        : 'hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9]'
                    }`}
                  >
                    {isTeacher ? 'عرض المواد والصفوف' : 'عرض الملف والدورات'}
                    <ChevronLeft size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
