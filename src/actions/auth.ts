'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function registerAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const roleInput = formData.get('role') as string;
  const bio = (formData.get('bio') as string)?.trim();

  // بيانات الطالب الإضافية
  const parentPhone = (formData.get('parentPhone') as string)?.trim() || null;
  const governorate = (formData.get('governorate') as string)?.trim() || null;
  const gradeLevel = (formData.get('gradeLevel') as string)?.trim() || null;
  const gradeName = (formData.get('gradeName') as string)?.trim() || null;

  // التحقق من نوع الحساب
  const role = roleInput === 'TEACHER' ? 'TEACHER' : 'STUDENT';

  if (!phone || !password || !name) {
    return { error: 'يرجى تعبئة الحقول الإجبارية (الاسم، رقم الهاتف، وكلمة المرور).' };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'كلمة المرور وتأكيد كلمة المرور غير متطابقين.' };
  }

  if (role === 'STUDENT' && !parentPhone) {
    return { error: 'يرجى إدخال رقم هاتف ولي الأمر لمتابعة الطالب.' };
  }

  try {
    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone },
          ...(email ? [{ email: email }] : []),
        ],
      },
    });

    if (existingUser) {
      return { error: 'رقم الهاتف أو البريد الإلكتروني مسجل مسبقاً.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || undefined,
        password: hashedPassword,
        role: role,
        bio: bio || undefined,
        parentPhone: parentPhone || undefined,
        governorate: governorate || undefined,
        gradeLevel: gradeLevel || undefined,
        gradeName: gradeName || undefined,
      },
    });

    // ربط الطالب تلقائياً بالصف الذي اختاره أثناء التسجيل
    if (role === 'STUDENT' && gradeName) {
      try {
        let targetClass = await prisma.class.findFirst({
          where: { name: gradeName },
        });

        if (!targetClass) {
          targetClass = await prisma.class.create({
            data: {
              name: gradeName,
              gradeLevel: gradeLevel || 'ثانوي',
              gradeNumber: 1,
              academicYear: '2025-2026',
              status: 'ACTIVE',
            },
          });
        }

        await prisma.classEnrollment.create({
          data: {
            studentId: user.id,
            classId: targetClass.id,
          },
        });
      } catch (clsErr) {
        console.error('Auto class enrollment error:', clsErr);
      }
    }

    // تسجيل الدخول التلقائي بعد التسجيل
    await setAuthCookie(user.id);
    return { success: true, role: user.role };
  } catch (error: any) {
    console.error('Registration Error:', error);
    const msg = error?.message?.includes('Can\'t reach database server') || error?.message?.includes('connection')
      ? 'تعذر الاتصال بقاعدة البيانات. يرجى مراجعة إعدادات الاتصال.'
      : 'حدث خطأ أثناء التسجيل. يرجى المحاولة لاحقاً.';
    return { error: msg };
  }
}

export async function loginWithPasswordAction(formData: FormData) {
  const phone = (formData.get('phone') as string)?.trim();
  const password = formData.get('password') as string;

  if (!phone || !password) {
    return { error: 'رقم الهاتف وكلمة المرور مطلوبان.' };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone },
          { email: phone },
        ],
      },
    });

    if (!user || !user.password) {
      return { error: 'بيانات الدخول غير صحيحة.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'بيانات الدخول غير صحيحة.' };
    }

    await setAuthCookie(user.id);
    return { success: true, role: user.role };
  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'حدث خطأ أثناء تسجيل الدخول.' };
  }
}

async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('userId', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  redirect('/login');
}

export async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    return null;
  }
}
