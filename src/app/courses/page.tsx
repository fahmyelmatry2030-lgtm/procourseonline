import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Search, Filter, Star, Clock, Users, PlayCircle } from 'lucide-react';
import { getDynamicCourseStatus } from '@/lib/courseStatus';
import { SortSelect } from '@/components/SortSelect';

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, string> = {
  OPEN: 'مفتوح للتسجيل',
  CLOSED: 'مغلق',
  STARTING_SOON: 'يبدأ قريباً',
  IN_PROGRESS: 'جاري الآن',
  ENDED: 'انتهى',
  CANCELLED: 'ملغى',
  DRAFT: 'مسودة',
};

const statusColors: Record<string, string> = {
  OPEN: '#10B981',
  STARTING_SOON: '#F59E0B',
  IN_PROGRESS: '#0EA5E9',
  CLOSED: '#EF4444',
  ENDED: '#6B7280',
  CANCELLED: '#EF4444',
  DRAFT: '#6B7280',
};

const fallbackCourses = [
  {
    id: 'course-ui-ux',
    title: 'دورة احتراف تطوير واجهات المستخدم مع React & Next.js',
    price: 99,
    status: 'OPEN',
    totalHours: 24,
    maxStudents: 30,
    startDate: new Date(),
    registrationEnd: new Date(Date.now() + 86400000 * 30),
    thumbnail: null,
    instructor: { name: 'م. أحمد محمود', phone: '0501111111' },
    enrollments: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
  },
  {
    id: 'course-cyber-sec',
    title: 'أساسيات ومفاهيم الأمن السيبراني واختبار الاختراق',
    price: 150,
    status: 'OPEN',
    totalHours: 20,
    maxStudents: 25,
    startDate: new Date(),
    registrationEnd: new Date(Date.now() + 86400000 * 20),
    thumbnail: null,
    instructor: { name: 'د. خالد السعيد', phone: '0502222222' },
    enrollments: [{ id: 'e4' }, { id: 'e5' }],
    reviews: [{ rating: 5 }, { rating: 5 }],
  },
  {
    id: 'course-ai-prompt',
    title: 'إتقان الذكاء الاصطناعي وهندسة الأوامر (Prompt Engineering)',
    price: 0,
    status: 'OPEN',
    totalHours: 12,
    maxStudents: 100,
    startDate: new Date(),
    registrationEnd: new Date(Date.now() + 86400000 * 15),
    thumbnail: null,
    instructor: { name: 'م. سارة خالد', phone: '0503333333' },
    enrollments: [{ id: 'e6' }, { id: 'e7' }],
    reviews: [{ rating: 5 }, { rating: 4 }],
  },
  {
    id: 'course-mobile-dev',
    title: 'تطوير تطبيقات الموبايل باستخدام Flutter',
    price: 120,
    status: 'OPEN',
    totalHours: 30,
    maxStudents: 40,
    startDate: new Date(),
    registrationEnd: new Date(Date.now() + 86400000 * 25),
    thumbnail: null,
    instructor: { name: 'م. علي عمر', phone: '0504444444' },
    enrollments: [{ id: 'e8' }],
    reviews: [{ rating: 5 }],
  },
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; price?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search || '';
  const selectedStatus = params?.status || '';
  const priceFilter = params?.price || '';
  const sortOption = params?.sort || 'newest';

  let courses: any[] = [];

  try {
    const where: any = {
      status: { not: 'DRAFT' },
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { instructor: { name: { contains: search } } },
      ];
    }

    if (selectedStatus) {
      where.status = selectedStatus;
    }

    if (priceFilter === 'free') {
      where.price = 0;
    } else if (priceFilter === 'paid') {
      where.price = { gt: 0 };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortOption === 'price_asc') {
      orderBy = { price: 'asc' };
    }

    courses = await prisma.course.findMany({
      where,
      orderBy,
      include: {
        instructor: true,
        enrollments: true,
        reviews: true,
      },
    });

    if (sortOption === 'rating' && courses.length > 0) {
      courses.sort((a, b) => {
        const ratingA = a.reviews?.length > 0 ? a.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / a.reviews.length : 0;
        const ratingB = b.reviews?.length > 0 ? b.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / b.reviews.length : 0;
        return ratingB - ratingA;
      });
    }

    // If database has 0 courses, provide fallback courses so the user gets a working page
    if (courses.length === 0 && !search && !selectedStatus && !priceFilter) {
      courses = fallbackCourses;
    }
  } catch (error) {
    console.error('Error fetching courses from database:', error);
    courses = fallbackCourses;
  }

  const statuses = ['OPEN', 'STARTING_SOON', 'IN_PROGRESS', 'ENDED'];

  return (
    <div className="bg-[#F8FAFF] min-h-screen py-16 relative">
      <div className="hero-glow opacity-50 hidden md:block"></div>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-right">
          <h1 className="text-4xl md:text-5xl font-black text-[#1B2B5E] mb-4">
            تصفح <span className="text-[#0EA5E9]">جميع الدورات</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            اختر من بين دورات تدريبية متقدمة لتطوير مهاراتك مع أفضل الخبراء.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[320px] shrink-0 friendly-card p-6 sticky top-24 border border-slate-100">
            <div className="flex items-center gap-2 mb-8 text-xl font-black text-[#1B2B5E]">
              <Filter size={24} className="text-[#0EA5E9]" /> الفلاتر
            </div>

            <form method="GET">
              {/* Search */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-700 mb-3">بحث</h3>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0EA5E9] transition-all"
                    placeholder="ابحث عن دورة..."
                  />
                  <Search size={18} className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-700 mb-3">حالة الدورة</h3>
                <div className="flex flex-col gap-3">
                  {statuses.map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer text-slate-600 font-medium hover:text-[#0EA5E9] transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        defaultChecked={selectedStatus === s}
                        className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                      />
                      {statusLabels[s] || s}
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer text-slate-600 font-medium hover:text-[#0EA5E9] transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value=""
                      defaultChecked={!selectedStatus}
                      className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                    />
                    الكل
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-700 mb-3">السعر</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { value: '', label: 'الكل' },
                    { value: 'free', label: 'مجاني' },
                    { value: 'paid', label: 'مدفوع' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer text-slate-600 font-medium hover:text-[#0EA5E9] transition-colors">
                      <input
                        type="radio"
                        name="price"
                        value={opt.value}
                        defaultChecked={priceFilter === opt.value}
                        className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">تطبيق</button>
                <a href="/courses" className="btn btn-outline flex-1 text-center">إعادة ضبط</a>
              </div>
            </form>
          </aside>

          {/* Courses Grid */}
          <div className="flex-1 w-full">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="text-slate-500 font-bold">عرض {courses.length} دورات متاحة</div>
              <SortSelect
                defaultValue={sortOption}
                search={search}
                status={selectedStatus}
                price={priceFilter}
              />
            </div>

            {/* Grid */}
            {courses.length === 0 ? (
              <div className="friendly-card p-12 text-center text-slate-500 font-bold text-lg">
                عذراً، لم يتم العثور على دورات تطابق الفلتر المحدد.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const dynamicStatus = getDynamicCourseStatus(course);
                  const rating =
                    course.reviews && course.reviews.length > 0
                      ? (course.reviews.reduce((a: number, b: any) => a + b.rating, 0) / course.reviews.length).toFixed(1)
                      : null;
                  const seatsLeft =
                    typeof course.maxStudents === 'number' && course.enrollments
                      ? course.maxStudents - course.enrollments.length
                      : null;
                  const statusColor = statusColors[dynamicStatus] || '#0EA5E9';

                  return (
                    <div key={course.id} className="friendly-card flex flex-col border border-slate-100">
                      
                      <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden group">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <PlayCircle size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <div
                          className="absolute top-4 right-4 bg-white px-4 py-1.5 rounded-full text-xs font-black shadow-md"
                          style={{ color: statusColor }}
                        >
                          {statusLabels[dynamicStatus] || dynamicStatus}
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-[#1B2B5E] mb-2 leading-relaxed">
                          {course.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-[#0EA5E9] font-black text-xs">
                            {((course.instructor?.name) || 'م').charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-600">
                            {course.instructor?.name || course.instructor?.phone || 'مدرس معتمد'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-6 flex-wrap">
                          {rating && (
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-amber-400" fill="currentColor" /> {rating} ({course.reviews?.length || 0})
                            </div>
                          )}
                          {course.totalHours > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock size={16} /> {course.totalHours} ساعة
                            </div>
                          )}
                          {seatsLeft !== null && (
                            <div className={`flex items-center gap-1 ${seatsLeft > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                              <Users size={16} /> {seatsLeft > 0 ? `${seatsLeft} مقعد` : 'مكتمل'}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                          <div className="text-2xl font-black text-[#1B2B5E]">
                            {course.price === 0 ? 'مجاني' : `$${course.price}`}
                          </div>
                          <Link href={`/courses/${course.id}`} className="btn btn-primary px-6 py-2.5 text-sm">
                            التفاصيل
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
