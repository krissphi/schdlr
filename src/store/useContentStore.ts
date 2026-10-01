import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import { ContentItem, ContentStage, ContentAttachment } from '../types/schdlr';
import { INITIAL_CONTENT_ITEMS } from '../data/seedData';

interface ContentState {
  contentItems: ContentItem[];
  addContentItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => ContentItem;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  moveContentStage: (id: string, newStage: ContentStage) => void;
  toggleContentChecklist: (itemId: string, checkId: string) => void;
  addAttachment: (itemId: string, attachment: Omit<ContentAttachment, 'id'>) => void;
  removeAttachment: (itemId: string, attachmentId: string) => void;
  setAllContentItems: (items: ContentItem[]) => void;
  resetContent: () => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      contentItems: INITIAL_CONTENT_ITEMS,

      addContentItem: (itemData) => {
        const newItem: ContentItem = {
          ...itemData,
          id: `cnt-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ contentItems: [newItem, ...state.contentItems] }));
        return newItem;
      },

      updateContentItem: (id, updates) =>
        set((state) => ({
          contentItems: state.contentItems.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
        })),

      deleteContentItem: (id) =>
        set((state) => ({
          contentItems: state.contentItems.filter((item) => item.id !== id),
        })),

      moveContentStage: (id, newStage) =>
        set((state) => ({
          contentItems: state.contentItems.map((item) => {
            if (item.id === id) {
              if (newStage === 'published') {
                confetti({ particleCount: 75, spread: 90, origin: { y: 0.6 } });
              }
              return { ...item, stage: newStage, updatedAt: new Date().toISOString() };
            }
            return item;
          }),
        })),

      toggleContentChecklist: (itemId, checkId) =>
        set((state) => ({
          contentItems: state.contentItems.map((item) => {
            if (item.id === itemId && item.checklist) {
              const updated = item.checklist.map((c) =>
                c.id === checkId ? { ...c, done: !c.done } : c
              );
              return { ...item, checklist: updated, updatedAt: new Date().toISOString() };
            }
            return item;
          }),
        })),

      addAttachment: (itemId, attachmentData) =>
        set((state) => ({
          contentItems: state.contentItems.map((item) => {
            if (item.id === itemId) {
              const newAtt: ContentAttachment = {
                ...attachmentData,
                id: `att-${Date.now()}`,
              };
              const existing = item.attachments || [];
              return {
                ...item,
                attachments: [...existing, newAtt],
                updatedAt: new Date().toISOString(),
              };
            }
            return item;
          }),
        })),

      removeAttachment: (itemId, attachmentId) =>
        set((state) => ({
          contentItems: state.contentItems.map((item) => {
            if (item.id === itemId && item.attachments) {
              return {
                ...item,
                attachments: item.attachments.filter((a) => a.id !== attachmentId),
                updatedAt: new Date().toISOString(),
              };
            }
            return item;
          }),
        })),

      setAllContentItems: (items) => set({ contentItems: items }),
      resetContent: () => set({ contentItems: INITIAL_CONTENT_ITEMS }),
    }),
    {
      name: 'schdlr_content_storage',
    }
  )
);
