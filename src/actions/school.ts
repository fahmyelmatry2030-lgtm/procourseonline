'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

// ─── إنشاء صف جديد (أدمن) ───────────────────────────────────────────────

export async function createClassAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const gradeLevel = formData.get('gradeLevel') as string;
  const gradeNumber = parseInt(formData.get('gradeNumber') as string);
  const section = (formData.get('section') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const academicYear = (formData.get('academicYear') as string) || '2025-2026';

  if (!name || !gradeLevel || !gradeNumber) {
    return { error: 'يرجى تعبئة جميع الحقول الإجبارية.' };
  }

  let newClassId = '';
  try {
    const cls = await prisma.class.create({
      data: { name, gradeLevel, gradeNumber, section, description, academicYear },
    });
    newClassId = cls.id;
  } catch {
    return { error: 'حدث خطأ أثناء إنشاء الصف.' };
  }

  if (newClassId) {
    redirect(`/admin/classes/${newClassId}`);
  }
}

// ─── إضافة مادة للصف (أدمن) ────────────────────────────────────────────

export async function createSubjectAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const price = parseFloat(formData.get('price') as string) || 0;
  const classId = formData.get('classId') as string;
  const teacherId = (formData.get('teacherId') as string) || null;

  if (!name || !classId) {
    return { error: 'اسم المادة والصف مطلوبان.' };
  }

  try {
    await prisma.subject.create({
      data: { name, description, price, classId, teacherId },
    });
  } catch {
    return { error: 'حدث خطأ أثناء إضافة المادة.' };
  }

  redirect(`/admin/classes/${classId}`);
}

// ─── تسجيل طالب في صف (يتم من صفحة الصف) ───────────────────────────────

export async function enrollInClassAction(formData: FormData) {
  const classId = formData.get('classId') as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/login');
  if (!classId) return;

  try {
    await prisma.classEnrollment.upsert({
      where: {
        studentId_classId: {
          studentId: userId,
          classId: classId,
        },
      },
      update: {},
      create: {
        studentId: userId,
        classId: classId,
      },
    });
  } catch (error) {
    console.error('Enroll Error:', error);
  }

  redirect(`/classes/${classId}`);
}

// ─── دفع مادة ──────────────────────────────────────────────────────────

export async function payForSubjectAction(formData: FormData) {
  const subjectId = formData.get('subjectId') as string;
  const paymentMethod = (formData.get('method') as string) || 'VISA';
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/login');
  if (!subjectId) return;

  let classId = '';
  try {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) return;
    classId = subject.classId;

    await prisma.subjectPayment.upsert({
      where: {
        studentId_subjectId: {
          studentId: userId,
          subjectId: subjectId,
        },
      },
      update: {
        status: 'COMPLETED',
        paymentMethod,
      },
      create: {
        studentId: userId,
        subjectId: subjectId,
        amount: subject.price,
        paymentMethod,
        status: 'COMPLETED',
      },
    });
  } catch (error) {
    console.error('Payment Error:', error);
  }

  if (classId) {
    redirect(`/classes/${classId}`);
  }
}

// ─── إضافة محاضرة لمادة (مدرس) ─────────────────────────────────────────

export async function createSubjectLectureAction(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const subjectId = formData.get('subjectId') as string;
  const type = (formData.get('type') as string) || 'RECORDED';
  const videoUrl = (formData.get('videoUrl') as string)?.trim() || null;
  const liveUrl = (formData.get('liveUrl') as string)?.trim() || null;
  const dateStr = formData.get('date') as string;
  const date = dateStr ? new Date(dateStr) : null;

  if (!title || !subjectId) return { error: 'العنوان والمادة مطلوبان.' };

  try {
    await prisma.subjectLecture.create({
      data: { title, subjectId, type, videoUrl, liveUrl, date },
    });
    return { success: true };
  } catch {
    return { error: 'حدث خطأ أثناء إضافة المحاضرة.' };
  }
}
