'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

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

export async function updateAdminProfileAction(formData: FormData) {
  const admin = await checkAdmin();
  if (!admin) return { error: 'غير مصرح لك بهذا الإجراء.' };

  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const newPassword = formData.get('newPassword') as string;

  if (!name || !phone) {
    return { error: 'الاسم ورقم الهاتف مطلوبان.' };
  }

  const updateData: any = {
    name,
    phone,
    email: email || null,
  };

  if (newPassword && newPassword.trim()) {
    if (newPassword.length < 6) {
      return { error: 'كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف.' };
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    updateData.password = hashed;
  }

  try {
    await prisma.user.update({
      where: { id: admin.id },
      data: updateData,
    });
    revalidatePath('/admin');
    revalidatePath('/admin/profile');
    return { success: true };
  } catch (err: any) {
    console.error('Update admin profile error:', err);
    return { error: 'حدث خطأ أثناء حفظ التعديلات.' };
  }
}

