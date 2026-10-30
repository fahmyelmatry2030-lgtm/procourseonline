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

  try {
    const cls = await prisma.class.create({
      data: { name, gradeLevel, gradeNumber, section, description, academicYear },
    });
    redirect(`/admin/classes/${cls.id}`);
  } catch {
    return { error: 'حدث خطأ أثناء إنشاء الصف.' };
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
    redirect(`/admin/classes/${classId}`);
  } catch {
    return { error: 'حدث خطأ أثناء إضافة المادة.' };
  }
}

// ─── تسجيل طالب في صف (يتم من صفحة الصف) ───────────────────────────────

export async function enrollInClassAction(classId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/login');

  try {
    await prisma.classEnrollment.create({
      data: { studentId: userId, classId },
    });
    return { success: true };
  } catch {
    return { error: 'أنت مسجل في هذا الصف بالفعل.' };
  }
}

// ─── دفع مادة ──────────────────────────────────────────────────────────

export async function payForSubjectAction(subjectId: string, paymentMethod: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/login');

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return { error: 'المادة غير موجودة.' };

  try {
    await prisma.subjectPayment.create({
      data: {
        studentId: userId,
        subjectId,
        amount: subject.price,
        paymentMethod,
        status: 'COMPLETED',
      },
    });
    return { success: true };
  } catch {
    return { error: 'لقد دفعت هذه المادة مسبقاً.' };
  }
}

// ─── إضافة محاضرة لمادة (مدرس) ─────────────────────────────────────────

export async function createSubjectLectureAction(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const subjectId = formData.get('subjectId') as string;
  const type = formData.get('type') as string || 'RECORDED';
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
