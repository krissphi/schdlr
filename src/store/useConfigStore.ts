import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode, Category, Platform, ActivityTask, ContentItem, Routine } from '../types/schdlr';
import { INITIAL_CATEGORIES, INITIAL_PLATFORMS, getTodayString } from '../data/seedData';
import { useTaskStore } from './useTaskStore';
import { useContentStore } from './useContentStore';
import { useRoutineStore } from './useRoutineStore';

interface ConfigState {
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

  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;

  platforms: Platform[];
  addPlatform: (plat: Omit<Platform, 'id'>) => Platform;
  updatePlatform: (id: string, updates: Partial<Platform>) => void;
  deletePlatform: (id: string) => void;
  getPlatformById: (id: string) => Platform | undefined;

  // Global Modals State
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
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      currentView: 'today',
      setCurrentView: (view) => set({ currentView: view }),

      selectedDate: getTodayString(0),
      setSelectedDate: (date) => set({ selectedDate: date }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      filterPlatformId: 'all',
      setFilterPlatformId: (id) => set({ filterPlatformId: id }),

      filterCategoryId: 'all',
      setFilterCategoryId: (id) => set({ filterCategoryId: id }),

      categories: INITIAL_CATEGORIES,
      addCategory: (catData) => {
        const newCat: Category = {
          ...catData,
          id: `cat-${Date.now()}`,
        };
        set((state) => ({ categories: [...state.categories, newCat] }));
        return newCat;
      },
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCategory: (id) => {
        const remaining = get().categories.filter((c) => c.id !== id);
        const fallbackCat = remaining[0] || INITIAL_CATEGORIES[0];

        // Cascade reassign orphaned tasks, content, and routines!
        useTaskStore.setState((state) => ({
          tasks: state.tasks.map((t) => (t.categoryId === id ? { ...t, categoryId: fallbackCat.id } : t)),
        }));
        useContentStore.setState((state) => ({
          contentItems: state.contentItems.map((c) =>
            c.categoryId === id ? { ...c, categoryId: fallbackCat.id } : c
          ),
        }));
        useRoutineStore.setState((state) => ({
          routines: state.routines.map((r) =>
            r.categoryId === id ? { ...r, categoryId: fallbackCat.id } : r
          ),
        }));

        set({ categories: remaining });
      },
      getCategoryById: (id) => {
        const list = get().categories;
        return list.find((c) => c.id === id) || list[0];
      },

      platforms: INITIAL_PLATFORMS,
      addPlatform: (platData) => {
        const newPlat: Platform = {
          ...platData,
          id: `plat-${Date.now()}`,
        };
        set((state) => ({ platforms: [...state.platforms, newPlat] }));
        return newPlat;
      },
      updatePlatform: (id, updates) =>
        set((state) => ({
          platforms: state.platforms.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePlatform: (id) => {
        const remaining = get().platforms.filter((p) => p.id !== id);
        const fallbackPlat = remaining[0] || INITIAL_PLATFORMS[0];

        useContentStore.setState((state) => ({
          contentItems: state.contentItems.map((c) =>
            c.platformId === id ? { ...c, platformId: fallbackPlat.id } : c
          ),
        }));

        set({ platforms: remaining });
      },
      getPlatformById: (id) => {
        const list = get().platforms;
        return list.find((p) => p.id === id) || list[0];
      },

      // Modals
      isTaskModalOpen: false,
      editingTask: null,
      openTaskModal: (task = null) => set({ isTaskModalOpen: true, editingTask: task }),
      closeTaskModal: () => set({ isTaskModalOpen: false, editingTask: null }),

      isContentModalOpen: false,
      editingContent: null,
      openContentModal: (content = null) => set({ isContentModalOpen: true, editingContent: content }),
      closeContentModal: () => set({ isContentModalOpen: false, editingContent: null }),

      isRoutineModalOpen: false,
      editingRoutine: null,
      openRoutineModal: (routine = null) => set({ isRoutineModalOpen: true, editingRoutine: routine }),
      closeRoutineModal: () => set({ isRoutineModalOpen: false, editingRoutine: null }),

      isConfigModalOpen: false,
      openConfigModal: () => set({ isConfigModalOpen: true }),
      closeConfigModal: () => set({ isConfigModalOpen: false }),
    }),
    {
      name: 'schdlr_config_storage',
      partialize: (state) => ({
        categories: state.categories,
        platforms: state.platforms,
      }),
    }
  )
);
