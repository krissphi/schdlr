import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { CategoryBadge, PlatformIcon } from '../common/Badges';
import { formatDateString, getTodayString } from '../../utils/dateUtils';

export const CalendarView: React.FC = () => {
  const {
    tasks,
    contentItems,
    selectedDate,
    setSelectedDate,
    openTaskModal,
    openContentModal,
    toggleTaskStatus,
    getCategoryById,
    filterPlatformId,
    filterCategoryId,
  } = useScheduler();

  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date(selectedDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [activeInspectorDate, setActiveInspectorDate] = useState<string | null>(selectedDate);

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
    setSelectedDate(today);
    setActiveInspectorDate(today);
  };

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calendar cells
  const days: { dateString: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    days.push({
      dateString: formatDateString(prevMonthDate),
      dayNumber: dayNum,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dateString: formatDateString(d),
      dayNumber: i,
      isCurrentMonth: true,
    });
  }

  // Next month leading days (to fill 35 or 42 grid slots)
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    days.push({
      dateString: formatDateString(nextMonthDate),
      dayNumber: i,
      isCurrentMonth: false,
    });
  }

  const todayStr = getTodayString(0);

  // Apply global filters
  const filteredTasks = tasks.filter((t) => {
    if (filterCategoryId !== 'all' && t.categoryId !== filterCategoryId) return false;
    return true;
  });

  const filteredContent = contentItems.filter((c) => {
    if (filterCategoryId !== 'all' && c.categoryId !== filterCategoryId) return false;
    if (filterPlatformId !== 'all' && c.platformId !== filterPlatformId) return false;
    return true;
  });

  // Events for inspector day
  const inspectorTasks = activeInspectorDate
    ? filteredTasks.filter((t) => t.date === activeInspectorDate)
    : [];
  const inspectorContent = activeInspectorDate
    ? filteredContent.filter((c) => c.targetDate === activeInspectorDate)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Calendar</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse schedule by date, inspect planned tasks, and monitor content release dates.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-subtle">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-xs text-slate-800 px-3 min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={jumpToToday}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-subtle transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar Grid (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60 text-center text-[11px] font-semibold text-slate-400 py-2.5">
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
              const dayTasks = filteredTasks.filter((t) => t.date === day.dateString);
              const dayContent = filteredContent.filter((c) => c.targetDate === day.dateString);
              const isToday = day.dateString === todayStr;
              const isSelected = day.dateString === activeInspectorDate;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveInspectorDate(day.dateString);
                    setSelectedDate(day.dateString);
                  }}
                  className={`min-h-[92px] p-2 flex flex-col justify-between cursor-pointer transition-colors relative ${
                    !day.isCurrentMonth
                      ? 'bg-slate-50/30 text-slate-300'
                      : isSelected
                      ? 'bg-slate-50 ring-1 ring-inset ring-slate-900'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Day Number Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-slate-900 text-white'
                          : isSelected
                          ? 'font-bold text-slate-900'
                          : day.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-300'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {(dayTasks.length > 0 || dayContent.length > 0) && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {dayTasks.length + dayContent.length}
                      </span>
                    )}
                  </div>

                  {/* Badges / Dots preview */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => {
                      const cat = getCategoryById(t.categoryId);
                      return (
                        <div
                          key={t.id}
                          className="truncate text-[10px] px-1.5 py-0.5 rounded font-medium border"
                          style={{
                            backgroundColor: cat?.bgLight || '#f1f5f9',
                            color: cat?.textColor || '#334155',
                            borderColor: cat?.borderColor || '#e2e8f0',
                          }}
                        >
                          {t.title}
                        </div>
                      );
                    })}

                    {dayContent.slice(0, 1).map((c) => {
                      const cat = getCategoryById(c.categoryId);
                      return (
                        <div
                          key={c.id}
                          className="truncate text-[10px] px-1.5 py-0.5 rounded font-medium border flex items-center gap-1 border-l-2"
                          style={{
                            backgroundColor: cat?.bgLight || '#fff1f2',
                            borderColor: cat?.borderColor || '#fecdd3',
                            borderLeftColor: cat?.color || '#e11d48',
                            color: cat?.textColor || '#be123c',
                          }}
                        >
                          <Layers className="w-2.5 h-2.5 shrink-0" />
                          <span>{c.title}</span>
                        </div>
                      );
                    })}

                    {dayTasks.length + dayContent.length > 3 && (
                      <div className="text-[9px] text-slate-400 font-medium pl-1">
                        +{dayTasks.length + dayContent.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Inspector Panel */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-5 flex flex-col justify-between h-fit">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {activeInspectorDate
                    ? new Date(activeInspectorDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Select a Day'}
                </h3>
                <p className="text-xs text-slate-400">
                  {inspectorTasks.length} tasks · {inspectorContent.length} content scheduled
                </p>
              </div>

              {activeInspectorDate && (
                <button
                  onClick={() => openTaskModal()}
                  className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Add task on this date"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tasks list for this day */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Scheduled Tasks
              </div>
              {inspectorTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No tasks scheduled for this day.</p>
              ) : (
                <div className="space-y-2">
                  {inspectorTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                        >
                          {t.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span
                          onClick={() => openTaskModal(t)}
                          className={`font-medium truncate cursor-pointer hover:text-blue-600 ${
                            t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <CategoryBadge categoryId={t.categoryId} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content items for this day */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Content Pipeline Releases
              </div>
              {inspectorContent.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No content due for this date.</p>
              ) : (
                <div className="space-y-2">
                  {inspectorContent.map((c) => {
                    const cat = getCategoryById(c.categoryId);
                    return (
                      <div
                        key={c.id}
                        onClick={() => openContentModal(c)}
                        className="p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs cursor-pointer hover:shadow-subtle transition-all border-l-4"
                        style={{
                          backgroundColor: cat?.bgLight || '#fff1f2',
                          borderColor: cat?.borderColor || '#fecdd3',
                          borderLeftColor: cat?.color || '#e11d48',
                        }}
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 truncate">{c.title}</div>
                          <div className="text-[10px] text-slate-500 capitalize mt-0.5">
                            Stage: {c.stage}
                          </div>
                        </div>
                        <PlatformIcon platformId={c.platformId} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
