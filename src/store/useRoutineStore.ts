import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import { Routine, RoutineLog, RoutineStatus } from '../types/schdlr';
import { INITIAL_ROUTINES, generateInitialRoutineLogs, getTodayString } from '../data/seedData';

interface RoutineState {
  routines: Routine[];
  routineLogs: RoutineLog[];
  addRoutine: (routine: Omit<Routine, 'id' | 'streak'>) => Routine;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  updateRoutineStatus: (id: string, status: RoutineStatus, date?: string) => void;
  getRoutineStatusForDate: (routineId: string, date: string) => RoutineStatus;
  setAllRoutines: (routines: Routine[], logs?: RoutineLog[]) => void;
  resetRoutines: () => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: INITIAL_ROUTINES,
      routineLogs: generateInitialRoutineLogs(),

      addRoutine: (routineData) => {
        const newRoutine: Routine = {
          ...routineData,
          id: `rtn-${Date.now()}`,
          streak: 1,
        };
        set((state) => ({ routines: [...state.routines, newRoutine] }));
        return newRoutine;
      },

      updateRoutine: (id, updates) =>
        set((state) => ({
          routines: state.routines.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
          routineLogs: state.routineLogs.filter((l) => l.routineId !== id),
        })),

      getRoutineStatusForDate: (routineId: string, date: string): RoutineStatus => {
        const log = get().routineLogs.find((l) => l.routineId === routineId && l.date === date);
        return log ? log.status : 'pending';
      },

      updateRoutineStatus: (id, status, targetDate = getTodayString(0)) =>
        set((state) => {
          const updatedRoutines = state.routines.map((r) => {
            if (r.id === id) {
              const prevStatus = state.routineLogs.find(
                (l) => l.routineId === id && l.date === targetDate
              )?.status;

              const nextStreak =
                status === 'completed' && prevStatus !== 'completed'
                  ? r.streak + 1
                  : status === 'skipped'
                  ? Math.max(0, r.streak - 1)
                  : r.streak;

              if (status === 'completed' && prevStatus !== 'completed') {
                confetti({ particleCount: 45, spread: 65, origin: { y: 0.7 } });
              }

              return { ...r, status, streak: nextStreak };
            }
            return r;
          });

          // Record or update in RoutineLog for that specific date
          let updatedLogs = [...state.routineLogs];
          const existingLogIdx = state.routineLogs.findIndex(
            (l) => l.routineId === id && l.date === targetDate
          );

          if (status === 'completed' || status === 'skipped') {
            const newLog: RoutineLog = {
              id: `log-${targetDate}-${id}`,
              routineId: id,
              date: targetDate,
              status,
              timestamp: new Date().toISOString(),
            };

            if (existingLogIdx >= 0) {
              updatedLogs[existingLogIdx] = newLog;
            } else {
              updatedLogs.push(newLog);
            }
          } else if (existingLogIdx >= 0) {
            // Remove log if reset to pending or in_progress
            updatedLogs.splice(existingLogIdx, 1);
          }

          return { routines: updatedRoutines, routineLogs: updatedLogs };
        }),

      setAllRoutines: (routines, logs) =>
        set((state) => ({
          routines,
          routineLogs: logs || state.routineLogs,
        })),

      resetRoutines: () =>
        set({
          routines: INITIAL_ROUTINES,
          routineLogs: generateInitialRoutineLogs(),
        }),
    }),
    {
      name: 'schdlr_routines_storage',
    }
  )
);
