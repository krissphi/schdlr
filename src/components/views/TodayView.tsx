import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Flame,
  ArrowRight,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { PlatformIcon } from '../common/Badges';

export const TodayView: React.FC = () => {
  const {
    tasks,
    contentItems,
    routines,
    selectedDate,
    toggleTaskStatus,
    openTaskModal,
    openContentModal,
    setCurrentView,
    updateRoutineStatus,
    getRoutineStatusForDate,
    addTask,
    categories,
    getCategoryById,
    searchQuery,
    filterCategoryId,
    filterPlatformId,
  } = useScheduler();

  const [quickInput, setQuickInput] = useState('');
  const [quickCategory, setQuickCategory] = useState(categories[0]?.id || '');

  // Calculate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter tasks for today / search query / category filter
  const todayTasks = tasks.filter((t) => {
    if (filterCategoryId !== 'all' && t.categoryId !== filterCategoryId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q);
    }
    return t.date === selectedDate;
  });

  const completedCount = todayTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = todayTasks.filter((t) => t.status === 'in_progress').length;
  const upcomingCount = todayTasks.filter((t) => t.status === 'todo').length;

  // Next up tasks (not completed, sorted by startTime)
  const nextUpTasks = [...todayTasks]
    .filter((t) => t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99'));

  // Completed tasks for today
  const completedTasks = todayTasks.filter((t) => t.status === 'completed');

  // Filter routines by active day frequency (weekdays vs weekends) and category
  const [y, m, d] = selectedDate.split('-').map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const todayRoutines = routines.filter((r) => {
    if (r.frequency === 'weekdays' && isWeekend) return false;
    if (r.frequency === 'weekends' && !isWeekend) return false;
    if (filterCategoryId !== 'all' && r.categoryId !== filterCategoryId) return false;
    return true;
  });

  // Content items in production
  const activeContent = contentItems
    .filter((c) => {
      if (filterCategoryId !== 'all' && c.categoryId !== filterCategoryId) return false;
      if (filterPlatformId !== 'all' && c.platformId !== filterPlatformId) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.title.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q);
      }
      return c.stage !== 'published' && c.stage !== 'idea';
    })
    .slice(0, 3);

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    addTask({
      title: quickInput.trim(),
      categoryId: quickCategory || categories[0]?.id || 'cat-personal',
      date: selectedDate,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      durationMinutes: 45,
      status: 'todo',
      notes: '',
    });

    setQuickInput('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Intimate, Personal Header */}
      <div className="border-b border-slate-200/80 pb-5 pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {getGreeting()}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="text-slate-900 font-semibold">Today: {formattedDate}</span>
          <span className="text-slate-300">•</span>
          <span>{todayTasks.length} tasks</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-600 font-semibold">{completedCount} completed</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">{upcomingCount + inProgressCount} upcoming</span>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-subtle flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center text-slate-400 pl-2">
          <Plus className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Add a task for today (press Enter)..."
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          className="flex-1 text-sm bg-transparent border-none focus:outline-none placeholder-slate-400 text-slate-800"
        />
        <select
          value={quickCategory}
          onChange={(e) => setQuickCategory(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Add
        </button>
      </form>

      {/* Next Up Section - Body Color Coded by Category (No Priority Clutter) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400">
            Next Up
          </h2>
          <button
            onClick={() => setCurrentView('tasks')}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
          >
            View all tasks <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nextUpTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-700">All caught up for today!</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Enjoy your time or add new tasks whenever you are ready.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {nextUpTasks.map((task) => {
              const cat = getCategoryById(task.categoryId);

              return (
                <div
                  key={task.id}
                  className="group rounded-xl border p-3 flex items-center justify-between transition-all shadow-subtle hover:shadow-card cursor-pointer border-l-4"
                  style={{
                    backgroundColor: cat?.bgLight || '#ffffff',
                    borderColor: cat?.borderColor || '#e2e8f0',
                    borderLeftColor: cat?.color || '#0f172a',
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskStatus(task.id);
                      }}
                      className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0 p-0.5"
                      title="Mark as completed"
                    >
                      <Circle className="w-4 h-4" />
                    </button>

                    <div
                      onClick={() => openTaskModal(task)}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-600 shrink-0">
                          {task.startTime || '--:--'}
                        </span>
                        <span className="text-slate-300 text-xs">—</span>
                        <span className="text-sm font-semibold text-slate-900 hover:text-blue-600 truncate transition-colors">
                          {task.title}
                        </span>
                      </div>

                      {task.notes && (
                        <p className="text-xs text-slate-500 truncate mt-0.5 max-w-lg">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Clean Right Area: Only Chevron */}
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={() => openTaskModal(task)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Routines Check-in - Dynamic by Date */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Daily Routines
            </h2>
            <span className="text-xs font-normal text-slate-400">
              ({routines.filter((r) => getRoutineStatusForDate(r.id, selectedDate) === 'completed').length}/{routines.length} done)
            </span>
          </div>
          <button
            onClick={() => setCurrentView('routines')}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
          >
            Manage routines <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {todayRoutines.map((routine) => {
            const currentStatus = getRoutineStatusForDate(routine.id, selectedDate);
            const isDone = currentStatus === 'completed';
            const isSkipped = currentStatus === 'skipped';
            const isInProgress = currentStatus === 'in_progress';
            const cat = getCategoryById(routine.categoryId);

            return (
              <div
                key={routine.id}
                className={`rounded-xl border p-3 flex items-center justify-between transition-all border-l-4 ${
                  isDone
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : isSkipped
                    ? 'border-slate-200 opacity-60 bg-white'
                    : 'shadow-subtle'
                }`}
                style={{
                  backgroundColor: !isDone && !isSkipped ? cat?.bgLight || '#ffffff' : undefined,
                  borderColor: !isDone && !isSkipped ? cat?.borderColor || '#e2e8f0' : undefined,
                  borderLeftColor: cat?.color || '#0f172a',
                }}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-slate-500">{routine.targetTime}</span>
                    <span className="text-slate-300">•</span>
                    <span
                      className={`text-sm font-semibold truncate ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {routine.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {routine.streak}d streak
                    </span>
                  </div>
                </div>

                {/* Routine status buttons for the specific selected date */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() =>
                      updateRoutineStatus(
                        routine.id,
                        isDone ? 'pending' : 'completed',
                        selectedDate
                      )
                    }
                    title={isDone ? 'Completed' : 'Mark done'}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      updateRoutineStatus(
                        routine.id,
                        isInProgress ? 'pending' : 'in_progress',
                        selectedDate
                      )
                    }
                    title="In progress"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      isInProgress
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      updateRoutineStatus(
                        routine.id,
                        isSkipped ? 'pending' : 'skipped',
                        selectedDate
                      )
                    }
                    title="Skip today"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      isSkipped
                        ? 'bg-slate-300 text-slate-700'
                        : 'bg-white/80 border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content in Production (Mini Spotlight) with PlatformIcon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400">
            Content in Production
          </h2>
          <button
            onClick={() => setCurrentView('content-board')}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
          >
            Open pipeline board <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeContent.map((item) => (
            <div
              key={item.id}
              onClick={() => openContentModal(item)}
              className="group bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 p-4 transition-all shadow-subtle hover:shadow-card cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <PlatformIcon platformId={item.platformId} />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                    {item.stage}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">
                  {item.title}
                </h3>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">
                  {item.targetDate} {item.uploadTime ? `• ${item.uploadTime}` : ''}
                </span>
                {item.checklist && (
                  <span className="font-medium text-slate-500">
                    {item.checklist.filter((c) => c.done).length}/{item.checklist.length} tasks
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Tasks section (clean & compact) */}
      {completedTasks.length > 0 && (
        <div className="pt-2">
          <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Completed Today ({completedTasks.length})
          </div>
          <div className="space-y-1.5 opacity-75 hover:opacity-100 transition-opacity">
            {completedTasks.map((task) => {
              const cat = getCategoryById(task.categoryId);

              return (
                <div
                  key={task.id}
                  className="rounded-lg border p-2 flex items-center justify-between text-xs border-l-2"
                  style={{
                    backgroundColor: cat?.bgLight || '#f8fafc',
                    borderColor: cat?.borderColor || '#e2e8f0',
                    borderLeftColor: cat?.color || '#94a3b8',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="text-emerald-600 hover:text-slate-400 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <span className="line-through text-slate-500">{task.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{task.startTime}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
