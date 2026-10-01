import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';

export const RoutineModal: React.FC = () => {
  const {
    isRoutineModalOpen,
    editingRoutine,
    closeRoutineModal,
    addRoutine,
    updateRoutine,
    categories,
  } = useScheduler();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [targetTime, setTargetTime] = useState('08:00');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingRoutine) {
      setTitle(editingRoutine.title);
      setCategoryId(editingRoutine.categoryId || categories[0]?.id || '');
      setTargetTime(editingRoutine.targetTime || '08:00');
      setFrequency(editingRoutine.frequency || 'daily');
      setNotes(editingRoutine.notes || '');
    } else {
      setTitle('');
      setCategoryId(categories[0]?.id || '');
      setTargetTime('08:00');
      setFrequency('daily');
      setNotes('');
    }
  }, [editingRoutine, isRoutineModalOpen, categories]);

  if (!isRoutineModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingRoutine && editingRoutine.id) {
      updateRoutine(editingRoutine.id, {
        title: title.trim(),
        categoryId: categoryId || categories[0]?.id,
        targetTime,
        frequency,
        notes: notes.trim(),
      });
    } else {
      addRoutine({
        title: title.trim(),
        categoryId: categoryId || categories[0]?.id,
        targetTime,
        frequency,
        status: 'pending',
        notes: notes.trim(),
      });
    }

    closeRoutineModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {editingRoutine && editingRoutine.id ? 'Edit Routine' : 'New Daily Routine'}
          </h2>
          <button
            onClick={closeRoutineModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Routine Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Coding & DSA, Afternoon Workout..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category (Dynamic)
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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
                Target Time
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekdays', 'weekends'] as const).map((freq) => (
                <button
                  type="button"
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`text-xs py-1.5 px-2 rounded-lg font-medium border capitalize transition-all ${
                    frequency === freq
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Focus Prompt
            </label>
            <input
              type="text"
              placeholder="e.g. Min 20 mins without phone distraction"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeRoutineModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
            >
              {editingRoutine && editingRoutine.id ? 'Save Routine' : 'Create Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
