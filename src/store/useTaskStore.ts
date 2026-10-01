import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import { ActivityTask, TaskStatus } from '../types/schdlr';
import { INITIAL_TASKS } from '../data/seedData';

interface TaskState {
  tasks: ActivityTask[];
  addTask: (task: Omit<ActivityTask, 'id' | 'createdAt'>) => ActivityTask;
  updateTask: (id: string, updates: Partial<ActivityTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setAllTasks: (tasks: ActivityTask[]) => void;
  resetTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,

      addTask: (taskData) => {
        const newTask: ActivityTask = {
          ...taskData,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
      },

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      setTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              if (status === 'completed' && t.status !== 'completed') {
                confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
              }
              return { ...t, status };
            }
            return t;
          }),
        })),

      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              const nextStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
              if (nextStatus === 'completed') {
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
              }
              return { ...t, status: nextStatus };
            }
            return t;
          }),
        })),

      setAllTasks: (tasks) => set({ tasks }),
      resetTasks: () => set({ tasks: INITIAL_TASKS }),
    }),
    {
      name: 'schdlr_tasks_storage',
    }
  )
);
