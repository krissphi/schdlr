import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Calendar,
  ExternalLink,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { PlatformIcon, StageBadge } from '../common/Badges';
import { formatDateString, getTodayString } from '../../utils/dateUtils';

export const UploadScheduleView: React.FC = () => {
  const {
    contentItems,
    selectedDate,
    setSelectedDate,
    openContentModal,
    moveContentStage,
    platforms,
    searchQuery,
    exportICalendar,
    getCategoryById,
    filterPlatformId,
    filterCategoryId,
  } = useScheduler();

  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date(selectedDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [activeDate, setActiveDate] = useState<string>(selectedDate);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const jumpToToday = () => {
    const today = getTodayString(0);
    const now = new Date();
    setCurrentMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setActiveDate(today);
    setSelectedDate(today);
  };

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days: { dateString: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    days.push({
      dateString: formatDateString(prevDate),
      dayNumber: dayNum,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dateString: formatDateString(d),
      dayNumber: i,
      isCurrentMonth: true,
    });
  }

  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({
      dateString: formatDateString(nextDate),
      dayNumber: i,
      isCurrentMonth: false,
    });
  }

  const todayStr = getTodayString(0);

  // Filter content items by global filters + search
  const filteredContent = contentItems.filter((c) => {
    if (filterCategoryId !== 'all' && c.categoryId !== filterCategoryId) return false;
    if (filterPlatformId !== 'all' && c.platformId !== filterPlatformId) return false;
    return true;
  });

  // Daily contents for activeDate, sorted by uploadTime
  const dailyUploads = filteredContent
    .filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.title.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q);
      }
      return c.targetDate === activeDate;
    })
    .sort((a, b) => (a.uploadTime || '99:99').localeCompare(b.uploadTime || '99:99'));

  // Monthly stats
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthlyScheduled = filteredContent.filter((c) => c.targetDate.startsWith(currentMonthPrefix));
  const publishedThisMonth = monthlyScheduled.filter((c) => c.stage === 'published').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Upload Scheduler
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dedicated release calendar: track upload dates, daily post counts, and exact publishing hours.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportICalendar}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-subtle transition-all"
            title="Export to Apple / Google Calendar (.ics)"
          >
            <CalendarDays className="w-4 h-4 text-slate-500" />
            Export .ics
          </button>

          <button
            onClick={() =>
              openContentModal({
                id: '',
                title: '',
                platformId: platforms[0]?.id || '',
                categoryId: 'cat-content',
                stage: 'scheduled',
                targetDate: activeDate,
                uploadTime: '17:00',
                createdAt: '',
                updatedAt: '',
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Schedule Upload
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-400">Scheduled This Month</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{monthlyScheduled.length} posts</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all social platforms</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-400">Published This Month</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{publishedThisMonth} live</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Successfully distributed</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-400">Selected Date Queue</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {dailyUploads.length} {dailyUploads.length === 1 ? 'upload' : 'uploads'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {new Date(activeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Daily Release Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Content Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
                <button
                  onClick={prevMonth}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-xs text-slate-800 px-3 min-w-[110px] text-center">
                  {monthName}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={jumpToToday}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                Today
              </button>
            </div>

            <div className="text-xs text-slate-400 font-medium">Click day to view timeline</div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 text-center text-[11px] font-semibold text-slate-400 py-2">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {days.map((day, idx) => {
              const dayContent = filteredContent.filter((c) => c.targetDate === day.dateString);
              const isToday = day.dateString === todayStr;
              const isSelected = day.dateString === activeDate;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveDate(day.dateString);
                    setSelectedDate(day.dateString);
                  }}
                  className={`min-h-[96px] p-2 flex flex-col justify-between cursor-pointer transition-all ${
                    !day.isCurrentMonth
                      ? 'bg-slate-50/30 text-slate-300'
                      : isSelected
                      ? 'bg-blue-50/20 ring-2 ring-inset ring-slate-900 z-10'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-slate-900 text-white'
                          : isSelected
                          ? 'font-bold text-slate-900 bg-slate-200'
                          : day.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-300'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {dayContent.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-white">
                        {dayContent.length}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Items Preview with Upload Time */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayContent.slice(0, 2).map((item) => {
                      const cat = getCategoryById(item.categoryId);
                      return (
                        <div
                          key={item.id}
                          className="truncate text-[10px] px-1.5 py-0.5 rounded font-medium border flex items-center justify-between gap-1 shadow-subtle border-l-2"
                          style={{
                            backgroundColor: cat?.bgLight || '#ffffff',
                            borderColor: cat?.borderColor || '#e2e8f0',
                            borderLeftColor: cat?.color || '#0f172a',
                            color: cat?.textColor || '#1e293b',
                          }}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.uploadTime && (
                            <span className="font-mono text-[9px] font-semibold opacity-75 shrink-0">
                              {item.uploadTime}
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {dayContent.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-semibold pl-1">
                        +{dayContent.length - 2} more uploads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Upload Queue Timeline (Right Panel) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Selected Date Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {new Date(activeDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
                <p className="text-xs text-slate-400">
                  {dailyUploads.length} {dailyUploads.length === 1 ? 'content piece' : 'content pieces'} queued
                </p>
              </div>

              <button
                onClick={() =>
                  openContentModal({
                    id: '',
                    title: '',
                    platformId: platforms[0]?.id || '',
                    categoryId: 'cat-content',
                    stage: 'scheduled',
                    targetDate: activeDate,
                    uploadTime: '18:00',
                    createdAt: '',
                    updatedAt: '',
                  })
                }
                className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Schedule post for this day"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List of Scheduled Uploads */}
            {dailyUploads.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium text-slate-600">No uploads scheduled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click the plus button to schedule an upload for this day.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyUploads.map((item) => {
                  const isPublished = item.stage === 'published';
                  const cat = getCategoryById(item.categoryId);

                  return (
                    <div
                      key={item.id}
                      onClick={() => openContentModal(item)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-subtle hover:shadow-card group border-l-4 ${
                        isPublished
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'hover:border-slate-300'
                      }`}
                      style={{
                        backgroundColor: isPublished ? undefined : cat?.bgLight || '#ffffff',
                        borderColor: isPublished ? undefined : cat?.borderColor || '#e2e8f0',
                        borderLeftColor: cat?.color || '#0f172a',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{item.uploadTime || 'Time unset'}</span>
                          </div>
                          <PlatformIcon platformId={item.platformId} />
                        </div>

                        <StageBadge stage={item.stage} />
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                        {item.title}
                      </h4>

                      {/* Attachments preview with sanitized safeUrl */}
                      {item.attachments && item.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                          {item.attachments.map((att) => {
                            const safeUrl =
                              att.url.startsWith('http://') || att.url.startsWith('https://')
                                ? att.url
                                : '#';

                            return (
                              <a
                                key={att.id}
                                href={safeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                              >
                                <span>{att.label}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* Quick mark as published */}
                      <div className="mt-2.5 flex items-center justify-end text-[11px]">
                        {!isPublished && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveContentStage(item.id, 'published');
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Mark Published
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
