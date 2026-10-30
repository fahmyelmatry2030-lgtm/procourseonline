import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding classes and subjects...');

  // 1. إنشاء مدرسين
  const teacherPass = await bcrypt.hash('teacher123', 10);
  
  const teacherMath = await prisma.user.upsert({
    where: { phone: '0501111111' },
    update: {},
    create: {
      phone: '0501111111',
      name: 'أ. أحمد السيد',
      email: 'ahmed.math@procourse.com',
      password: teacherPass,
      role: 'TEACHER',
      bio: 'مدرس أول رياضيات خبرة 15 عاماً في المناهج المصرية والسعودية',
    },
  });

  const teacherArabic = await prisma.user.upsert({
    where: { phone: '0502222222' },
    update: {},
    create: {
      phone: '0502222222',
      name: 'أ. محمود عبد الرحمن',
      email: 'mahmoud.arabic@procourse.com',
      password: teacherPass,
      role: 'TEACHER',
      bio: 'معلم لغة عربية ونصوص متقدمة',
    },
  });

  const teacherScience = await prisma.user.upsert({
    where: { phone: '0503333333' },
    update: {},
    create: {
      phone: '0503333333',
      name: 'د. سارة فؤاد',
      email: 'sara.science@procourse.com',
      password: teacherPass,
      role: 'TEACHER',
      bio: 'دكتوراه في الكيمياء، تدريس العلوم والفيزياء للمرحلتين الإعدادية والثانوية',
    },
  });

  // 2. إنشاء الصفوف
  const classesData = [
    // ابتدائي
    { name: 'الصف الرابع الابتدائي', gradeLevel: 'ابتدائي', gradeNumber: 4, section: 'عام' },
    { name: 'الصف الخامس الابتدائي', gradeLevel: 'ابتدائي', gradeNumber: 5, section: 'عام' },
    { name: 'الصف السادس الابتدائي', gradeLevel: 'ابتدائي', gradeNumber: 6, section: 'عام' },
    // إعدادي
    { name: 'الصف الأول الإعدادي', gradeLevel: 'إعدادي', gradeNumber: 1, section: 'عام' },
    { name: 'الصف الثاني الإعدادي', gradeLevel: 'إعدادي', gradeNumber: 2, section: 'عام' },
    { name: 'الصف الثالث الإعدادي', gradeLevel: 'إعدادي', gradeNumber: 3, section: 'عام' },
    // ثانوي
    { name: 'الصف الأول الثانوي', gradeLevel: 'ثانوي', gradeNumber: 1, section: 'عام' },
    { name: 'الصف الثاني الثانوي', gradeLevel: 'ثانوي', gradeNumber: 2, section: 'علمي' },
    { name: 'الصف الثالث الثانوي', gradeLevel: 'ثانوي', gradeNumber: 3, section: 'علمي علوم' },
  ];

  for (const c of classesData) {
    const existing = await prisma.class.findFirst({
      where: { name: c.name, academicYear: '2025-2026' },
    });

    if (!existing) {
      const cls = await prisma.class.create({
        data: {
          name: c.name,
          gradeLevel: c.gradeLevel,
          gradeNumber: c.gradeNumber,
          section: c.section,
          description: `المناهج الدراسية الكاملة لـ ${c.name} للعام الدراسي 2025-2026 مع نخبة من أفضل المدرسين.`,
          academicYear: '2025-2026',
        },
      });

      // إضافة مواد نموذجية لكل صف
      const subjects = [
        { name: 'الرياضيات', price: 25, teacherId: teacherMath.id, description: 'شرح كامل للمنهج وحل جميع تمارين الكتاب والامتحانات' },
        { name: 'اللغة العربية', price: 20, teacherId: teacherArabic.id, description: 'قواعد النحو والبلاغة والنصوص والقراءة' },
        { name: c.gradeLevel === 'ثانوي' ? 'الفيزياء' : 'العلوم', price: 30, teacherId: teacherScience.id, description: 'شرح التجارب العلمية والمفاهيم بطريقة تفاعلية مبسطة' },
        { name: 'اللغة الإنجليزية', price: 20, teacherId: null, description: 'محادثة وقواعد وكتابة متقدمة' },
      ];

      for (const s of subjects) {
        await prisma.subject.create({
          data: {
            name: s.name,
            price: s.price,
            description: s.description,
            classId: cls.id,
            teacherId: s.teacherId,
          },
        });
      }
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
