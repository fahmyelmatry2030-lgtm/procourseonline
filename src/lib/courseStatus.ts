export function getDynamicCourseStatus(course: {
  status?: string;
  startDate?: Date | string | null;
  registrationEnd?: Date | string | null;
}) {
  if (!course || !course.status) return 'OPEN';
  if (course.status === 'CANCELLED') return '🔴 تم الإلغاء';
  if (course.status === 'ENDED') return '⚪ انتهت الدورة';

  try {
    const now = new Date();
    const startDate = course.startDate ? new Date(course.startDate) : null;
    const registrationEnd = course.registrationEnd ? new Date(course.registrationEnd) : null;

    if (course.status === 'OPEN' || course.status === 'ACTIVE') {
      if (registrationEnd && startDate && now > registrationEnd && now < startDate) {
        return '🟡 التسجيل مغلق';
      }

      if (startDate) {
        const daysUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (daysUntilStart > 0 && daysUntilStart <= 7) {
          return '🔵 ستبدأ قريباً';
        }

        if (now >= startDate) {
          return '🟠 الدورة قيد التنفيذ';
        }
      }

      return '🟢 التسجيل مفتوح';
    }
  } catch {
    return course.status;
  }

  return course.status;
}
