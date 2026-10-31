import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AssignmentsClient } from './AssignmentsClient';

export const dynamic = 'force-dynamic';

export default async function StudentAssignmentsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      classEnrollments: {
        include: {
          class: true,
        },
      },
    },
  });

  if (!user) redirect('/login');

  const gradeName = user.gradeName || user.classEnrollments[0]?.class?.name || 'الصف الدراسي';

  return (
    <AssignmentsClient 
      studentName={user.name || 'طالب'} 
      gradeName={gradeName} 
    />
  );
}
