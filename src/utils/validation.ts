import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name required'),
  color: z.string().regex(/^#([0-9a-fA-F]{3,8})$/, 'Format hex color tidak valid'),
  bgLight: z.string(),
  textColor: z.string(),
  borderColor: z.string(),
  icon: z.string().optional(),
});

export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Platform name required'),
  color: z.string().regex(/^#([0-9a-fA-F]{3,8})$/, 'Format hex color tidak valid'),
  bgLight: z.string(),
  textColor: z.string(),
  icon: z.string().optional(),
});

export const ActivityTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title required'),
  categoryId: z.string(),
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  durationMinutes: z.number().default(60),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const ContentAttachmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z
    .string()
    .url('URL tidak valid')
    .refine((val) => val.startsWith('http://') || val.startsWith('https://'), {
      message: 'Hanya protokol HTTP/HTTPS yang diperbolehkan',
    }),
  type: z.enum(['drive', 'figma', 'notion', 'video', 'link']),
});

export const ContentItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title required'),
  platformId: z.string(),
  categoryId: z.string(),
  stage: z.enum(['idea', 'script', 'shooting', 'editing', 'ready', 'scheduled', 'published']),
  targetDate: z.string(),
  uploadTime: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  notes: z.string().optional(),
  captionDraft: z.string().optional(),
  checklist: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        done: z.boolean(),
      })
    )
    .optional(),
  attachments: z.array(ContentAttachmentSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RoutineSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title required'),
  categoryId: z.string(),
  targetTime: z.string(),
  streak: z.number().default(0),
  frequency: z.enum(['daily', 'weekdays', 'weekends']),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']),
  notes: z.string().optional(),
});

export const RoutineLogSchema = z.object({
  id: z.string(),
  routineId: z.string(),
  date: z.string(),
  status: z.enum(['completed', 'skipped']),
  timestamp: z.string(),
});

export const BackupDataSchema = z.object({
  categories: z.array(CategorySchema),
  platforms: z.array(PlatformSchema).optional(),
  tasks: z.array(ActivityTaskSchema),
  contentItems: z.array(ContentItemSchema),
  routines: z.array(RoutineSchema),
  routineLogs: z.array(RoutineLogSchema).optional(),
  exportDate: z.string().optional(),
});

export type ValidatedBackupData = z.infer<typeof BackupDataSchema>;
