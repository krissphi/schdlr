import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit3,
  Calendar,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { StatusBadge } from '../common/Badges';
import { useToastStore } from '../../store/useToastStore';

export const TasksView: React.FC = () => {
  const {
    tasks,
    categories,
    addTask,
    toggleTaskStatus,
    openTaskModal,
    deleteTask,
    searchQuery,
    getCategoryById,
    filterCategoryId,
  } = useScheduler();

  const showToast = useToastStore((state) => state.showToast);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [visibleCount, setVisibleCount] = useState<number>(15);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    const activeCat = filterCategoryId !== 'all' ? filterCategoryId : selectedCategory;
    if (activeCat !== 'all' && task.categoryId !== activeCat) {
      return false;
    }

    if (selectedStatus !== 'all' && task.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tasks</h1>
          <p className="text-xs text-slate-500 mt-1">
            Minimalist activity list with category tinting, status badges, and instant filtering.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filter and Control Bar (No priority clutter) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-subtle flex flex-wrap items-center gap-3">
        {/* Category filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Status</option>
            <option value="todo">To-do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="date">Date & Time</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Task List with Category Body Tinting */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-slate-600">No tasks found</p>
            <p className="text-xs mt-1">Try resetting your filters or add a new task.</p>
          </div>
        ) : (
          sortedTasks.slice(0, visibleCount).map((task) => {
            const isDone = task.status === 'completed';
            const cat = getCategoryById(task.categoryId);

            return (
              <div
                key={task.id}
                className={`group p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all shadow-subtle hover:shadow-card cursor-pointer border-l-4 ${
                  isDone ? 'opacity-60' : ''
                }`}
                style={{
                  backgroundColor: cat?.bgLight || '#ffffff',
                  borderColor: cat?.borderColor || '#e2e8f0',
                  borderLeftColor: cat?.color || '#0f172a',
                }}
              >
                {/* Left: Checkmark & Content */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskStatus(task.id);
                    }}
                    className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div onClick={() => openTaskModal(task)} className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold hover:text-blue-600 transition-colors ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-xs text-slate-500 truncate mt-0.5 max-w-md">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle: Clean Date/Time & Status */}
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={task.status} />

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{task.date}</span>
                    {task.startTime && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{task.startTime}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openTaskModal(task)}
                    title="Edit task"
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white rounded-md transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const deleted = { ...task };
                      deleteTask(task.id);
                      showToast({
                        message: `Task "${task.title}" deleted`,
                        type: 'info',
                        durationMs: 5000,
                        undoLabel: 'Undo',
                        undoAction: () => {
                          addTask(deleted);
                        },
                      });
                    }}
                    title="Delete task (Undo available)"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Client-side Pagination Footer */}
        {sortedTasks.length > visibleCount && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-700">{Math.min(visibleCount, sortedTasks.length)}</span> of{' '}
              <span className="font-semibold text-slate-700">{sortedTasks.length}</span> tasks
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 15)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-subtle transition-all"
              >
                Load More (+15)
              </button>
              <button
                onClick={() => setVisibleCount(sortedTasks.length)}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                Show All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
