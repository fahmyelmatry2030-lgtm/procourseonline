'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

export async function approveTeacherAction(teacherId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { error: 'غير مصرح لك بتنفيذ هذا الإجراء.' };
  }

  try {
    await prisma.user.update({
      where: { id: teacherId },
      data: {
        isVerifiedTeacher: true,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/teachers');
    revalidatePath('/instructor');
    return { success: true };
  } catch (error: any) {
    console.error('Error approving teacher:', error);
    return { error: 'حدث خطأ أثناء اعتماد المعلم.' };
  }
}

export async function rejectTeacherAction(teacherId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { error: 'غير مصرح لك بتنفيذ هذا الإجراء.' };
  }

  try {
    // Delete or mark unverified
    await prisma.user.update({
      where: { id: teacherId },
      data: {
        isVerifiedTeacher: false,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/teachers');
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting teacher:', error);
    return { error: 'حدث خطأ أثناء معالجة الطلب.' };
  }
}

export async function deleteTeacherAction(teacherId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { error: 'غير مصرح لك بتنفيذ هذا الإجراء.' };
  }

  try {
    await prisma.user.delete({
      where: { id: teacherId },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/teachers');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting teacher:', error);
    return { error: 'حدث خطأ أثناء حذف الحساب.' };
  }
}
