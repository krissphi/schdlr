import React from 'react';
import { RotateCcw, X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, triggerUndo } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const hasUndo = typeof toast.undoAction === 'function';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 p-3.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {(!toast.type || toast.type === 'info') && <Info className="w-4 h-4 text-blue-400 shrink-0" />}

              <p className="text-xs font-medium text-slate-100 truncate">{toast.message}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasUndo && (
                <button
                  onClick={() => triggerUndo(toast.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 rounded-lg transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{toast.undoLabel || 'Undo'}</span>
                </button>
              )}

              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
