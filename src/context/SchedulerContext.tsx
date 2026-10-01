import React, { createContext, useContext } from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { useTaskStore } from '../store/useTaskStore';
import { useContentStore } from '../store/useContentStore';
import { useRoutineStore } from '../store/useRoutineStore';
import { BackupDataSchema } from '../utils/validation';
import { downloadICalendarFile } from '../utils/icalExport';
import {
  ViewMode,
  Category,
  Platform,
  ActivityTask,
  ContentItem,
  Routine,
  RoutineLog,
  ContentStage,
  RoutineStatus,
  TaskStatus,
  ContentAttachment,
} from '../types/schdlr';

interface SchedulerContextType {
  // Navigation & Config
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPlatformId: string;
  setFilterPlatformId: (id: string) => void;
  filterCategoryId: string;
  setFilterCategoryId: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;

  // Platforms
  platforms: Platform[];
  addPlatform: (plat: Omit<Platform, 'id'>) => Platform;
  updatePlatform: (id: string, updates: Partial<Platform>) => void;
  deletePlatform: (id: string) => void;
  getPlatformById: (id: string) => Platform | undefined;

  // Tasks
  tasks: ActivityTask[];
  addTask: (task: Omit<ActivityTask, 'id' | 'createdAt'>) => ActivityTask;
  updateTask: (id: string, updates: Partial<ActivityTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;

  // Content Items
  contentItems: ContentItem[];
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => ContentItem;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  moveContentStage: (id: string, newStage: ContentStage) => void;
  toggleContentChecklist: (itemId: string, checkId: string) => void;
  addAttachment: (itemId: string, attachment: Omit<ContentAttachment, 'id'>) => void;
  removeAttachment: (itemId: string, attachmentId: string) => void;

  // Routines & Logs
  routines: Routine[];
  routineLogs: RoutineLog[];
  addRoutine: (routine: Omit<Routine, 'id' | 'streak'>) => Routine;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  updateRoutineStatus: (id: string, status: RoutineStatus, date?: string) => void;
  getRoutineStatusForDate: (routineId: string, date: string) => RoutineStatus;

  // Modals
  isTaskModalOpen: boolean;
  editingTask: ActivityTask | null;
  openTaskModal: (task?: ActivityTask | null) => void;
  closeTaskModal: () => void;

  isContentModalOpen: boolean;
  editingContent: ContentItem | null;
  openContentModal: (content?: ContentItem | null) => void;
  closeContentModal: () => void;

  isRoutineModalOpen: boolean;
  editingRoutine: Routine | null;
  openRoutineModal: (routine?: Routine | null) => void;
  closeRoutineModal: () => void;

  isConfigModalOpen: boolean;
  openConfigModal: () => void;
  closeConfigModal: () => void;

  // Backup & Reset & iCal
  resetToDefaults: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  exportICalendar: () => void;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

export const SchedulerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useConfigStore();
  const taskStore = useTaskStore();
  const contentStore = useContentStore();
  const routineStore = useRoutineStore();

  const resetToDefaults = () => {
    if (window.confirm('Reset semua data ke sampel awal? Perubahan kustom Anda akan diperbarui.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const exportDataJSON = () => {
    const backup = {
      categories: config.categories,
      platforms: config.platforms,
      tasks: taskStore.tasks,
      contentItems: contentStore.contentItems,
      routines: routineStore.routines,
      routineLogs: routineStore.routineLogs,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schdlr-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const validated = BackupDataSchema.parse(parsed);

      useConfigStore.setState({
        categories: validated.categories,
        platforms: validated.platforms || config.platforms,
      });
      taskStore.setAllTasks(validated.tasks);
      contentStore.setAllContentItems(validated.contentItems);
      routineStore.setAllRoutines(validated.routines, validated.routineLogs);

      return true;
    } catch (err) {
      console.error('Validation error on import JSON:', err);
      return false;
    }
  };

  const exportICalendar = () => {
    downloadICalendarFile(taskStore.tasks, contentStore.contentItems, config.getPlatformById);
  };

  const value: SchedulerContextType = {
    currentView: config.currentView,
    setCurrentView: config.setCurrentView,
    selectedDate: config.selectedDate,
    setSelectedDate: config.setSelectedDate,
    searchQuery: config.searchQuery,
    setSearchQuery: config.setSearchQuery,
    filterPlatformId: config.filterPlatformId,
    setFilterPlatformId: config.setFilterPlatformId,
    filterCategoryId: config.filterCategoryId,
    setFilterCategoryId: config.setFilterCategoryId,

    categories: config.categories,
    addCategory: config.addCategory,
    updateCategory: config.updateCategory,
    deleteCategory: config.deleteCategory,
    getCategoryById: config.getCategoryById,
    platforms: config.platforms,
    addPlatform: config.addPlatform,
    updatePlatform: config.updatePlatform,
    deletePlatform: config.deletePlatform,
    getPlatformById: config.getPlatformById,

    tasks: taskStore.tasks,
    addTask: taskStore.addTask,
    updateTask: taskStore.updateTask,
    deleteTask: taskStore.deleteTask,
    toggleTaskStatus: taskStore.toggleTaskStatus,
    setTaskStatus: taskStore.setTaskStatus,

    contentItems: contentStore.contentItems,
    addContentItem: contentStore.addContentItem,
    updateContentItem: contentStore.updateContentItem,
    deleteContentItem: contentStore.deleteContentItem,
    moveContentStage: contentStore.moveContentStage,
    toggleContentChecklist: contentStore.toggleContentChecklist,
    addAttachment: contentStore.addAttachment,
    removeAttachment: contentStore.removeAttachment,

    routines: routineStore.routines,
    routineLogs: routineStore.routineLogs,
    addRoutine: routineStore.addRoutine,
    updateRoutine: routineStore.updateRoutine,
    deleteRoutine: routineStore.deleteRoutine,
    updateRoutineStatus: routineStore.updateRoutineStatus,
    getRoutineStatusForDate: routineStore.getRoutineStatusForDate,

    isTaskModalOpen: config.isTaskModalOpen,
    editingTask: config.editingTask,
    openTaskModal: config.openTaskModal,
    closeTaskModal: config.closeTaskModal,
    isContentModalOpen: config.isContentModalOpen,
    editingContent: config.editingContent,
    openContentModal: config.openContentModal,
    closeContentModal: config.closeContentModal,
    isRoutineModalOpen: config.isRoutineModalOpen,
    editingRoutine: config.editingRoutine,
    openRoutineModal: config.openRoutineModal,
    closeRoutineModal: config.closeRoutineModal,
    isConfigModalOpen: config.isConfigModalOpen,
    openConfigModal: config.openConfigModal,
    closeConfigModal: config.closeConfigModal,

    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    exportICalendar,
  };

  return <SchedulerContext.Provider value={value}>{children}</SchedulerContext.Provider>;
};

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};
