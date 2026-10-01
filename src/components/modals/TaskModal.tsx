import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { TaskStatus } from '../../types/schdlr';
import { useToastStore } from '../../store/useToastStore';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    addTask,
    updateTask,
    deleteTask,
    categories,
    selectedDate,
  } = useScheduler();

  const showToast = useToastStore((state) => state.showToast);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [notes, setNotes] = useState('');

  // Helper to re-actively calculate endTime
  const calculateEndTime = (start: string, duration: number): string => {
    if (!start) return '10:00';
    const [h, m] = start.split(':').map(Number);
    const totalMin = (h || 0) * 60 + (m || 0) + (duration || 60);
    const endH = Math.floor(totalMin / 60) % 24;
    const endM = totalMin % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const computedEndTime = calculateEndTime(startTime, durationMinutes);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategoryId(editingTask.categoryId || categories[0]?.id || '');
      setSubCategoryId(editingTask.subCategoryId || '');
      setDate(editingTask.date || selectedDate);
      setStartTime(editingTask.startTime || '09:00');
      setDurationMinutes(editingTask.durationMinutes || 60);
      setStatus(editingTask.status || 'todo');
      setNotes(editingTask.notes || '');
    } else {
      setTitle('');
      setCategoryId(categories[0]?.id || '');
      setSubCategoryId('');
      setDate(selectedDate);
      setStartTime('09:00');
      setDurationMinutes(60);
      setStatus('todo');
      setNotes('');
    }
  }, [editingTask, isTaskModalOpen, categories, selectedDate]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask && editingTask.id) {
      updateTask(editingTask.id, {
        title: title.trim(),
        categoryId: categoryId || categories[0]?.id,
        subCategoryId: subCategoryId || undefined,
        date,
        startTime,
        endTime: computedEndTime,
        durationMinutes: Number(durationMinutes),
        status,
        notes: notes.trim(),
      });
    } else {
      addTask({
        title: title.trim(),
        categoryId: categoryId || categories[0]?.id,
        subCategoryId: subCategoryId || undefined,
        date,
        startTime,
        endTime: computedEndTime,
        durationMinutes: Number(durationMinutes),
        status,
        notes: notes.trim(),
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {editingTask && editingTask.id ? 'Edit Activity Task' : 'New Activity Task'}
          </h2>
          <button
            onClick={closeTaskModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Review Mainan, Morning Coding, Gym Session..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Category & Sub-category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubCategoryId('');
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-category (Optional)
              </label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!selectedCategory?.subCategories || selectedCategory.subCategories.length === 0}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
              >
                <option value="">None</option>
                {selectedCategory?.subCategories?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Start Time & Reactive End Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                step="15"
                min="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Ends at ~{computedEndTime}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <div className="grid grid-cols-4 gap-2">
              {(['todo', 'in_progress', 'completed', 'cancelled'] as TaskStatus[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`text-xs py-1.5 px-2 rounded-lg font-medium border capitalize transition-all ${
                    status === s
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Description</label>
            <textarea
              rows={3}
              placeholder="Additional details, agenda, links..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            {editingTask && editingTask.id ? (
              <button
                type="button"
                onClick={() => {
                  const backup = { ...editingTask };
                  deleteTask(editingTask.id);
                  closeTaskModal();
                  showToast({
                    message: `Task "${editingTask.title}" deleted`,
                    type: 'info',
                    durationMs: 5000,
                    undoLabel: 'Undo',
                    undoAction: () => addTask(backup),
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
              >
                {editingTask && editingTask.id ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
