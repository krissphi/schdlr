import React from 'react';
import { Plus } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { isTodayString } from '../../utils/dateUtils';

export const TimelineView: React.FC = () => {
  const {
    tasks,
    selectedDate,
    openTaskModal,
    getCategoryById,
    filterCategoryId,
  } = useScheduler();

  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 to 23:00

  const todayTasks = tasks.filter((t) => {
    if (t.date !== selectedDate) return false;
    if (filterCategoryId !== 'all' && t.categoryId !== filterCategoryId) return false;
    return true;
  });

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isToday = isTodayString(selectedDate);
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Timeline</h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual hour-by-hour time blocking for {formattedDate}.
          </p>
        </div>

        <button
          onClick={() =>
            openTaskModal({
              id: '',
              title: '',
              categoryId: '',
              date: selectedDate,
              startTime: '09:00',
              durationMinutes: 60,
              status: 'todo',
              createdAt: '',
            })
          }
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Time Block
        </button>
      </div>

      {/* Hourly Timeline Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
        <div className="relative">
          {hours.map((hour) => {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const hourTasks = todayTasks.filter((t) => {
              if (!t.startTime) return false;
              const [taskH] = t.startTime.split(':').map(Number);
              return taskH === hour;
            });

            const isCurrentTimeSlot = isToday && currentHour === hour;

            return (
              <div key={hour} className="flex gap-4 group min-h-[72px] border-b border-slate-100 last:border-b-0 py-2 relative">
                {/* Time Label */}
                <div className="w-16 shrink-0 text-right pr-2">
                  <span className="text-xs font-mono font-medium text-slate-400 group-hover:text-slate-700 transition-colors">
                    {timeString}
                  </span>
                </div>

                {/* Timeline Content Slot */}
                <div className="flex-1 relative pl-4 border-l border-slate-200 group-hover:border-slate-400 transition-colors">
                  {/* Current live time indicator line */}
                  {isCurrentTimeSlot && (
                    <div
                      className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                      style={{ top: `${(currentMinute / 60) * 100}%` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-[5px]" />
                      <div className="flex-1 h-[2px] bg-rose-500" />
                    </div>
                  )}

                  {hourTasks.length === 0 ? (
                    <div
                      onClick={() =>
                        openTaskModal({
                          id: '',
                          title: '',
                          categoryId: '',
                          date: selectedDate,
                          startTime: timeString,
                          durationMinutes: 60,
                          status: 'todo',
                          createdAt: '',
                        })
                      }
                      className="h-full min-h-[48px] rounded-lg border border-dashed border-transparent hover:border-slate-300 hover:bg-slate-50/50 flex items-center px-3 cursor-pointer text-slate-300 hover:text-slate-600 transition-all text-xs"
                    >
                      <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Schedule at {timeString}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {hourTasks.map((task) => {
                        const cat = getCategoryById(task.categoryId);

                        return (
                          <div
                            key={task.id}
                            onClick={() => openTaskModal(task)}
                            className="p-3 rounded-lg border cursor-pointer hover:shadow-subtle transition-all border-l-4"
                            style={{
                              backgroundColor: cat?.bgLight || '#f8fafc',
                              borderColor: cat?.borderColor || '#e2e8f0',
                              borderLeftColor: cat?.color || '#0f172a',
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-semibold text-slate-700">
                                  {task.startTime} {task.endTime ? `– ${task.endTime}` : ''}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-sm font-semibold text-slate-900">
                                  {task.title}
                                </span>
                              </div>
                            </div>

                            {task.notes && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                {task.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
