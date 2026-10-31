'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

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

  // بيانات المعلم الإضافية وإثبات الهوية
  const subjectSpecialty = (formData.get('subjectSpecialty') as string)?.trim() || null;
  const teachingStages = (formData.get('teachingStages') as string)?.trim() || null;
  const jobTitle = (formData.get('jobTitle') as string)?.trim() || null;
  const yearsOfExperience = (formData.get('yearsOfExperience') as string)?.trim() || null;
  const whatsappPhone = (formData.get('whatsappPhone') as string)?.trim() || null;
  const nationalId = (formData.get('nationalId') as string)?.trim() || null;
  const idCardFile = formData.get('idCardFile') as File | null;
  const idCardBase64Input = (formData.get('idCardBase64') as string)?.trim() || null;

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

  if (role === 'TEACHER') {
    if (!subjectSpecialty) {
      return { error: 'يرجى تحديد المادة أو التخصص الذي تقوم بتدريسه.' };
    }
    if (!nationalId || nationalId.length < 10) {
      return { error: 'يرجى إدخال رقم بطاقة الرقم القومي صحيحاً (14 رقم) للتحقق المهني.' };
    }
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

    // معالجة ملف إثبات الهوية للمعلم
    let idCardUrl: string | null = null;
    if (idCardBase64Input && idCardBase64Input.startsWith('data:')) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'id_cards');
        await fs.promises.mkdir(uploadDir, { recursive: true });
        const matches = idCardBase64Input.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mime = matches[1];
          const data = matches[2];
          const ext = mime.includes('pdf') ? 'pdf' : mime.includes('png') ? 'png' : 'jpg';
          const fileName = `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
          const filePath = path.join(uploadDir, fileName);
          await fs.promises.writeFile(filePath, Buffer.from(data, 'base64'));
          idCardUrl = `/uploads/id_cards/${fileName}`;
        } else {
          idCardUrl = idCardBase64Input;
        }
      } catch (e) {
        console.error('Error saving id card from base64:', e);
        idCardUrl = idCardBase64Input;
      }
    } else if (idCardFile && typeof idCardFile === 'object' && 'arrayBuffer' in idCardFile && idCardFile.size > 0) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'id_cards');
        await fs.promises.mkdir(uploadDir, { recursive: true });
        const bytes = await idCardFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = idCardFile.name?.split('.').pop() || 'jpg';
        const fileName = `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, buffer);
        idCardUrl = `/uploads/id_cards/${fileName}`;
      } catch (fileErr) {
        console.error('Error saving id card file:', fileErr);
        const bytes = await idCardFile.arrayBuffer();
        idCardUrl = `data:${idCardFile.type || 'image/jpeg'};base64,${Buffer.from(bytes).toString('base64')}`;
      }
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
        // بيانات المعلم
        subjectSpecialty: subjectSpecialty || undefined,
        teachingStages: teachingStages || undefined,
        jobTitle: jobTitle || undefined,
        yearsOfExperience: yearsOfExperience || undefined,
        whatsappPhone: whatsappPhone || undefined,
        nationalId: nationalId || undefined,
        idCardUrl: idCardUrl || undefined,
        isVerifiedTeacher: false,
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
