import React from 'react';
import {
  Plus,
  Flame,
  Check,
  Clock,
  X,
  Edit3,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { getTodayString } from '../../data/seedData';
import { useToastStore } from '../../store/useToastStore';

export const RoutinesView: React.FC = () => {
  const {
    routines,
    routineLogs,
    addRoutine,
    updateRoutineStatus,
    openRoutineModal,
    deleteRoutine,
    getCategoryById,
    filterCategoryId,
  } = useScheduler();

  const showToast = useToastStore((state) => state.showToast);

  const completedCount = routines.filter((r) => r.status === 'completed').length;
  const inProgressCount = routines.filter((r) => r.status === 'in_progress').length;
  const completionPercentage =
    routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

  const maxStreak = routines.reduce((max, r) => Math.max(max, r.streak), 0);

  // Generate 35 days (5 weeks) for compact GitHub-style consistency grid
  const daysGrid: { dateStr: string; label: string; rate: number; completedCount: number }[] = [];
  for (let i = 34; i >= 0; i--) {
    const dateStr = getTodayString(-i);
    const dayLogs = routineLogs.filter((l) => l.date === dateStr);
    const dayCompleted = dayLogs.filter((l) => l.status === 'completed').length;
    const totalPossible = Math.max(routines.length, 1);
    const rate = Math.min(100, Math.round((dayCompleted / totalPossible) * 100));

    daysGrid.push({
      dateStr,
      label: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate,
      completedCount: dayCompleted,
    });
  }

  // Get color for contribution intensity
  const getCellColor = (rate: number) => {
    if (rate === 0) return 'bg-slate-100 border-slate-200/70 hover:border-slate-400';
    if (rate <= 40) return 'bg-emerald-200 border-emerald-300 hover:border-emerald-400';
    if (rate <= 75) return 'bg-emerald-400 border-emerald-500 hover:border-emerald-600';
    return 'bg-emerald-600 border-emerald-700 hover:border-emerald-800';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Routines & Habits</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build consistency with recurring daily activities, morning coding, workouts, and content uploads.
          </p>
        </div>

        <button
          onClick={() => openRoutineModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Routine
        </button>
      </div>

      {/* Routine Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-400">Today's Consistency</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{completionPercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {completedCount} of {routines.length} completed
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-400">In Progress Now</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active habit blocks</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
          <div className="text-xs font-medium text-slate-400">Longest Active Streak</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            {maxStreak} days
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Keep momentum going</div>
        </div>
      </div>

      {/* Ultra-Compact Minimalist Consistency Heatmap */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">35-Day Consistency Heatmap</span>
        </div>

        {/* Small compact squares (like GitHub) */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex flex-wrap items-center gap-1">
            {daysGrid.map((day) => (
              <div
                key={day.dateStr}
                title={`${day.label}: ${day.completedCount} completed (${day.rate}%)`}
                className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-transform hover:scale-125 ${getCellColor(
                  day.rate
                )}`}
              />
            ))}
          </div>

          {/* Minimalist Legend */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 pl-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-200 border border-emerald-300" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600 border border-emerald-700" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Routines List with Category Body Tinting */}
      <div className="space-y-2.5">
        {routines
          .filter((r) => filterCategoryId === 'all' || r.categoryId === filterCategoryId)
          .map((routine) => {
          const isDone = routine.status === 'completed';
          const isSkipped = routine.status === 'skipped';
          const isInProgress = routine.status === 'in_progress';
          const cat = getCategoryById(routine.categoryId);

          return (
            <div
              key={routine.id}
              className={`rounded-xl border p-3.5 transition-all shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/20'
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
              {/* Routine Info */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                    {routine.targetTime}
                  </span>
                  <h3
                    className={`text-sm font-semibold truncate ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {routine.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 pt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {routine.streak}d streak
                  </span>

                  <span className="text-[11px] text-slate-400 capitalize">
                    {routine.frequency}
                  </span>

                  {routine.notes && (
                    <span className="text-[11px] text-slate-500 italic truncate max-w-xs">
                      — "{routine.notes}"
                    </span>
                  )}
                </div>
              </div>

              {/* Status Toggle Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateRoutineStatus(routine.id, isDone ? 'pending' : 'completed')
                    }
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>

                  <button
                    onClick={() =>
                      updateRoutineStatus(
                        routine.id,
                        isInProgress ? 'pending' : 'in_progress'
                      )
                    }
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isInProgress
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>In Progress</span>
                  </button>

                  <button
                    onClick={() =>
                      updateRoutineStatus(routine.id, isSkipped ? 'pending' : 'skipped')
                    }
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSkipped
                        ? 'bg-slate-300 text-slate-700'
                        : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Skip</span>
                  </button>
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                  <button
                    onClick={() => openRoutineModal(routine)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-md transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const deleted = { ...routine };
                      deleteRoutine(routine.id);
                      showToast({
                        message: `Routine "${routine.title}" deleted`,
                        type: 'info',
                        durationMs: 5000,
                        undoLabel: 'Undo',
                        undoAction: () => {
                          addRoutine(deleted);
                        },
                      });
                    }}
                    title="Delete routine (Undo available)"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
