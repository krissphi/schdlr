import { ActivityTask, ContentItem, Platform } from '../types/schdlr';

export const generateICalendar = (
  tasks: ActivityTask[],
  contentItems: ContentItem[],
  getPlatformById: (id: string) => Platform | undefined
): string => {
  const formatICSDate = (dateStr: string, timeStr?: string): string => {
    const cleanDate = dateStr.replace(/-/g, '');
    if (!timeStr) {
      return `${cleanDate}`;
    }
    const cleanTime = timeStr.replace(/:/g, '') + '00';
    return `${cleanDate}T${cleanTime}`;
  };

  const escapeText = (text?: string): string => {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Schdlr//Personal Life & Content Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Schdlr Agenda',
  ];

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Export Tasks
  tasks.forEach((task) => {
    const dtStart = formatICSDate(task.date, task.startTime || '09:00');
    const dtEnd = formatICSDate(task.date, task.endTime || '10:00');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:task-${task.id}@schdlr.app`);
    lines.push(`DTSTAMP:${nowStamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeText(task.title)}`);
    if (task.notes) {
      lines.push(`DESCRIPTION:${escapeText(task.notes)}`);
    }
    lines.push(`STATUS:${task.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}`);
    lines.push('END:VEVENT');
  });

  // Export Scheduled Content Releases
  contentItems.forEach((content) => {
    const platform = getPlatformById(content.platformId);
    const dtStart = formatICSDate(content.targetDate, content.uploadTime || '17:00');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:content-${content.id}@schdlr.app`);
    lines.push(`DTSTAMP:${nowStamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`SUMMARY:[Upload ${platform?.name || 'Content'}] ${escapeText(content.title)}`);
    lines.push(
      `DESCRIPTION:Stage: ${content.stage}\\nPlatform: ${platform?.name || 'Web'}${
        content.notes ? `\\nNotes: ${escapeText(content.notes)}` : ''
      }`
    );
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
};

export const downloadICalendarFile = (
  tasks: ActivityTask[],
  contentItems: ContentItem[],
  getPlatformById: (id: string) => Platform | undefined
) => {
  const icsData = generateICalendar(tasks, contentItems, getPlatformById);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schdlr-agenda-${new Date().toISOString().slice(0, 10)}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};
