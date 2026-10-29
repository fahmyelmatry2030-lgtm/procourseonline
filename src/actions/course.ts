'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createCourseAction(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { error: 'غير مصرح لك بهذا الإجراء.' };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'INSTRUCTOR') {
    return { error: 'يجب أن تكون محاضراً لإنشاء دورة.' };
  }

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const shortDescription = (formData.get('shortDescription') as string)?.trim();
  const price = parseFloat(formData.get('price') as string) || 0;
  const startDate = formData.get('startDate') as string;
  const durationWeeks = parseInt(formData.get('durationWeeks') as string) || 1;
  const totalHours = parseInt(formData.get('totalHours') as string) || 0;
  const maxStudents = formData.get('maxStudents') ? parseInt(formData.get('maxStudents') as string) : null;
  const registrationEnd = formData.get('registrationEnd') as string;

  if (!title || !description || !startDate || !registrationEnd) {
    return { error: 'يرجى تعبئة جميع الحقول الإجبارية.' };
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        shortDescription: shortDescription || null,
        price,
        startDate: new Date(startDate),
        durationWeeks,
        totalHours,
        maxStudents,
        registrationEnd: new Date(registrationEnd),
        instructorId: userId,
        status: 'OPEN',
      },
    });
    redirect(`/instructor`);
  } catch (error) {
    console.error('Create Course Error:', error);
    return { error: 'حدث خطأ أثناء إنشاء الدورة.' };
  }
}

export async function updateCourseStatusAction(courseId: string, status: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { error: 'غير مصرح.' };

  await prisma.course.update({
    where: { id: courseId, instructorId: userId },
    data: { status },
  });
  return { success: true };
}
