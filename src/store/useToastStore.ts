import { create } from 'zustand';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
  undoAction?: () => void;
  undoLabel?: string;
  createdAt: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => string;
  dismissToast: (id: string) => void;
  triggerUndo: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (toastData) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const duration = toastData.durationMs ?? 5000;
    const newToast: ToastItem = {
      ...toastData,
      id,
      createdAt: Date.now(),
    };

    set((state) => ({
      // Keep at most 3 visible toasts to prevent screen clutter
      toasts: [...state.toasts.slice(-2), newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }

    return id;
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  triggerUndo: (id) => {
    const toast = get().toasts.find((t) => t.id === id);
    if (toast?.undoAction) {
      toast.undoAction();
    }
    get().dismissToast(id);
  },
}));
