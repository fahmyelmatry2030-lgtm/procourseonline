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

export async function createCouponAction(formData: FormData) {
  const admin = await checkAdmin();
  if (!admin) return { error: 'غير مصرح لك بتنفيذ هذا الإجراء.' };

  const code = (formData.get('code') as string)?.trim().toUpperCase();
  const type = (formData.get('type') as string) || 'PERCENTAGE';
  const value = parseFloat(formData.get('value') as string);
  const maxUsesStr = formData.get('maxUses') as string;
  const expiryDateStr = formData.get('expiryDate') as string;

  if (!code || isNaN(value) || value <= 0) {
    return { error: 'يرجى إدخال كود صحيح وقيمة خصم صالحة.' };
  }

  // Check unique
  const existing = await prisma.coupon.findUnique({
    where: { code },
  });

  if (existing) {
    return { error: 'هذا الكود مسجل بالفعل، يرجى اختيار كود آخر.' };
  }

  const maxUses = maxUsesStr && parseInt(maxUsesStr, 10) > 0 ? parseInt(maxUsesStr, 10) : null;
  const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

  try {
    await prisma.coupon.create({
      data: {
        code,
        type,
        value,
        maxUses,
        expiryDate,
      },
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return { error: 'حدث خطأ أثناء حفظ الكوبون.' };
  }
}

export async function deleteCouponAction(couponId: string) {
  const admin = await checkAdmin();
  if (!admin) return { error: 'غير مصرح لك بتنفيذ هذا الإجراء.' };

  try {
    await prisma.coupon.delete({
      where: { id: couponId },
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return { error: 'حدث خطأ أثناء حذف الكوبون.' };
  }
}
