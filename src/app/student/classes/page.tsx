import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { School, BookOpen, ArrowLeft, CheckCircle2, Sparkles, GraduationCap, User, Clock, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

const OFFICIAL_SUBJECTS: Record<string, Array<{ name: string; description: string; price: number; teacherName: string }>> = {
  'إعدادي': [
    { name: 'اللغة العربية', description: 'شرح فروع النحو، النصوص الأدبية، القراءة، والقصة المقررة وفق المنهج الحديث', price: 120, teacherName: 'أ. محمود سامي' },
    { name: 'الرياضيات', description: 'شرح الجبر والإحصاء والهندسة وحساب المثلثات مع تدريبات بنك الأسئلة', price: 120, teacherName: 'أ. أحمد السيد' },
    { name: 'العلوم', description: 'شرح المادة والتفاعلات الكيميائية والقوى والحركة مع تجارب مصورة', price: 100, teacherName: 'د. خالد السعيد' },
    { name: 'الدراسات الاجتماعية', description: 'شرح التاريخ والجغرافيا وتدريبات الخرائط والامتحانات الشهرية', price: 100, teacherName: 'أ. إبراهيم عادل' },
    { name: 'اللغة الإنجليزية', description: 'English - New Hello: المنهج المطور، القواعد والمفردات والمحادثات', price: 110, teacherName: 'أ. سارة خالد' },
  ],
  'ثانوي': [
    { name: 'اللغة العربية', description: 'النحو التطبيقي، البلاغة الشاملة، الأدب، والقراءة المتحررة والتدريب على التابلت', price: 150, teacherName: 'أ. محمود سامي' },
    { name: 'الرياضيات', description: 'الجبر، التفاضل والتكامل، وحساب المثلثات وفق مواصفات الوزارة الحديثة', price: 150, teacherName: 'أ. أحمد السيد' },
    { name: 'العلوم المتكاملة / الفيزياء', description: 'شرح منهج العلوم والفيزياء المطورة وحل أفكار ومسائل الامتحانات', price: 140, teacherName: 'د. خالد السعيد' },
    { name: 'اللغة الإنجليزية', description: 'شرح منهج الثانوية المطوّر، القواعد، المفردات، الترجمة، وكتابة المقال', price: 130, teacherName: 'أ. سارة خالد' },
    { name: 'التاريخ والجغرافيا', description: 'شرح نواتج التعلم وتدريبات الاستنتاج والتحليل والربط بين الأحداث', price: 120, teacherName: 'أ. إبراهيم عادل' },
    { name: 'الفلسفة والمنطق', description: 'شرح الفلسفة الحياتية والمنطق الحديث وتطبيقاته', price: 110, teacherName: 'أ. هاني فوزي' },
  ],
  'ابتدائي': [
    { name: 'اللغة العربية', description: 'تأسيس القراءة والكتابة والنصوص والقواعد النحوية بأسلوب تفاعلي ممتع', price: 90, teacherName: 'أ. محمود سامي' },
    { name: 'الرياضيات', description: 'الحساب والأشكال الهندسية والعمليات الحسابية وتطبيقات عملية', price: 90, teacherName: 'أ. أحمد السيد' },
    { name: 'العلوم', description: 'استكشاف الكائنات الحية والمادة والطاقة بأسلوب شيق ومبسط', price: 80, teacherName: 'د. خالد السعيد' },
    { name: 'الدراسات الاجتماعية', description: 'معالم مصر وتاريخها وجغرافيتها بأسلوب قصصي تفاعلي', price: 80, teacherName: 'أ. إبراهيم عادل' },
    { name: 'اللغة الإنجليزية', description: 'Connect: المفردات والمحادثات والقصص والقواعد الأساسية', price: 90, teacherName: 'أ. سارة خالد' },
  ],
};

export default async function StudentClassPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) redirect('/login');

  // 1. البحث عن الصفوف المسجل بها الطالب
  let classEnrollments = await prisma.classEnrollment.findMany({
    where: { studentId: userId },
    include: {
      class: {
        include: {
          subjects: {
            include: {
              teacher: true,
              payments: { where: { studentId: userId, status: 'COMPLETED' } },
              _count: { select: { lectures: true, files: true } },
            },
          },
        },
      },
    },
  });

  // 2. الربط التلقائي بالصف إذا لم يكن مربوطاً
  let targetClassId = classEnrollments[0]?.classId;

  if (!targetClassId && user.gradeName) {
    try {
      let targetClass = await prisma.class.findFirst({
        where: { name: user.gradeName },
      });

      if (!targetClass) {
        targetClass = await prisma.class.create({
          data: {
            name: user.gradeName,
            gradeLevel: user.gradeLevel || 'إعدادي',
            gradeNumber: 1,
            academicYear: '2025-2026',
            status: 'ACTIVE',
          },
        });
      }

      targetClassId = targetClass.id;

      await prisma.classEnrollment.create({
        data: {
          studentId: user.id,
          classId: targetClass.id,
        },
      });
    } catch (e) {
      console.error('Auto enrollment error:', e);
    }
  }

  // 3. التحقق من وجود المواد المدرسية للصف وإضافتها تلقائياً إذا كانت فارغة
  if (targetClassId) {
    try {
      const existingSubjects = await prisma.subject.findMany({
        where: { classId: targetClassId },
      });

      if (existingSubjects.length === 0) {
        const stageKey = user.gradeLevel?.includes('ثانوي') 
          ? 'ثانوي' 
          : user.gradeLevel?.includes('ابتدائي') 
          ? 'ابتدائي' 
          : 'إعدادي';

        const subjectsToCreate = OFFICIAL_SUBJECTS[stageKey] || OFFICIAL_SUBJECTS['إعدادي'];

        for (const sub of subjectsToCreate) {
          // جلب أو إنشاء المدرس
          let teacher = await prisma.user.findFirst({
            where: { name: sub.teacherName, role: 'TEACHER' },
          });

          if (!teacher) {
            teacher = await prisma.user.create({
              data: {
                name: sub.teacherName,
                phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
                role: 'TEACHER',
                bio: `معلم خبير ومتميز في مادة ${sub.name}`,
              },
            });
          }

          // إنشاء المادة وربطها بالصف والمعلم
          const createdSubject = await prisma.subject.create({
            data: {
              name: sub.name,
              description: sub.description,
              price: sub.price,
              classId: targetClassId,
              teacherId: teacher.id,
            },
          });

          // إضافة محاضرة تمهيدية للمادة
          await prisma.subjectLecture.create({
            data: {
              title: `المحاضرة التأسيسية الأولى — مادة ${sub.name}`,
              description: `مقدمة المنهج وخطة الشرح والتقييم للعام الدراسي 2025-2026`,
              type: 'RECORDED',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              duration: 50,
              subjectId: createdSubject.id,
            },
          });

          // إضافة ملخص ومذكرة للمادة
          await prisma.subjectFile.create({
            data: {
              title: `مذكرة الشرح والتدريبات — الوحدة الأولى (${sub.name})`,
              fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              type: 'PDF',
              subjectId: createdSubject.id,
            },
          });
        }
      }

      // إعادة جلب الصفوف والمواد بعد التحديث
      classEnrollments = await prisma.classEnrollment.findMany({
        where: { studentId: userId },
        include: {
          class: {
            include: {
              subjects: {
                include: {
                  teacher: true,
                  payments: { where: { studentId: userId, status: 'COMPLETED' } },
                  _count: { select: { lectures: true, files: true } },
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error('Auto populate subjects error:', err);
    }
  }

  // الصف الحالي المختار للطالب
  const currentEnrollment = classEnrollments[0];
  const currentClass = currentEnrollment?.class;
  const gradeDisplayName = user.gradeName || currentClass?.name || 'الصف الأول الإعدادي';
  const stageDisplayName = user.gradeLevel || currentClass?.gradeLevel || 'إعدادي';
  const subjectsList = currentClass?.subjects || [];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(14,165,233,0.12)', color: '#0EA5E9' }}>
              المرحلة {stageDisplayName}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16,185,129,0.12)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} /> مسجل ومفعل
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1B2B5E', margin: 0 }}>
            صفي الدراسي: <span style={{ color: '#0EA5E9' }}>{gradeDisplayName}</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            المناهج والمواد المدرسية الرسمية المقررة لصفك للعام الدراسي 2025 - 2026
          </p>
        </div>

        {/* Quick link to Schedule */}
        <Link href="/student/schedule" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
          📅 جدول الحصص الأسبوعي
        </Link>
      </div>

      {/* بطاقة الصف الرئيسية للطالب */}
      <div className="saas-card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(27,43,94,0.04))', border: '1px solid rgba(14,165,233,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #0EA5E9, #1B2B5E)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(14,165,233,0.25)' }}>
              <GraduationCap size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.35rem 0', color: '#1B2B5E' }}>{gradeDisplayName}</h2>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748B', flexWrap: 'wrap' }}>
                <span>📍 المحافظة: <strong>{user.governorate || 'القاهرة'}</strong></span>
                <span>•</span>
                <span>📚 المرحلة: <strong>{stageDisplayName}</strong></span>
                <span>•</span>
                <span>📖 المواد المقررة: <strong>{subjectsList.length} مواد أساسية</strong></span>
                <span>•</span>
                <span>📅 العام: <strong>2025 - 2026</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* عنوان قسم المواد المدرسية */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1B2B5E', marginBottom: '0.35rem' }}>
          المواد الدراسية المقررة لصفك
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
          قائمة المواد المدرسية التابعة لـ {gradeDisplayName}؛ اختر مادتك لمتابعة الحصص والشروحات وحل الواجبات
        </p>
      </div>

      {/* قائمة المواد المدرسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
        {subjectsList.map((subject) => {
          const isPaid = subject.payments.length > 0;
          return (
            <div 
              key={subject.id} 
              className="saas-card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderTop: isPaid ? '4px solid #10B981' : '4px solid #0EA5E9',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.65rem', borderRadius: '9999px', background: isPaid ? 'rgba(16,185,129,0.1)' : 'rgba(14,165,233,0.1)', color: isPaid ? '#10B981' : '#0EA5E9' }}>
                    {isPaid ? '✔️ مادة مفعلة' : 'متاحة للاشتراك'}
                  </span>
                  <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#1B2B5E' }}>
                    {subject.price === 0 ? 'مجاناً' : `${subject.price} ج.م / شهر`}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1B2B5E', marginBottom: '0.5rem' }}>
                  {subject.name}
                </h4>

                {subject.description && (
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                    {subject.description}
                  </p>
                )}

                {subject.teacher && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '10px', marginBottom: '1.25rem' }}>
                    <User size={15} color="#0EA5E9" />
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      المعلم: <strong style={{ color: '#1B2B5E' }}>{subject.teacher.name}</strong>
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} color="#0EA5E9" /> {subject._count.lectures} حصة
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={14} color="#F97316" /> {subject._count.files} مذكرة وتدريب
                  </span>
                </div>
              </div>

              <Link
                href={isPaid ? `/student/subjects/${subject.id}` : `/payment/subject/${subject.id}`}
                className={`btn ${isPaid ? 'btn-primary' : 'btn-outline'}`}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  fontSize: '0.9rem', 
                  textAlign: 'center', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  fontWeight: '800'
                }}
              >
                {isPaid ? 'الدخول للحصص والواجبات' : 'الاشتراك في المادة وتفعيلها'} <ArrowLeft size={16} />
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
