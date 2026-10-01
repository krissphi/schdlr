export type ViewMode = 
  | 'today'
  | 'tasks'
  | 'calendar'
  | 'timeline'
  | 'content-board'
  | 'upload-schedule'
  | 'routines'
  | 'analytics';

export interface Category {
  id: string;
  name: string;
  color: string;         // Primary accent color (hex)
  bgLight: string;       // Soft pastel background (hex / rgba)
  textColor: string;     // High readability text color
  borderColor: string;   // Light matching border
  icon?: string;
}

export interface Platform {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  textColor: string;
  icon?: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export type RoutineStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export type ContentStage = 
  | 'idea' 
  | 'script' 
  | 'shooting' 
  | 'editing' 
  | 'ready' 
  | 'scheduled' 
  | 'published';

export interface ContentStageConfig {
  id: ContentStage;
  label: string;
  description: string;
  dotColor: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ContentAttachment {
  id: string;
  label: string;
  url: string;
  type: 'drive' | 'figma' | 'notion' | 'video' | 'link';
}

export interface ActivityTask {
  id: string;
  title: string;
  categoryId: string;    // References Category.id (dynamic)
  date: string;          // YYYY-MM-DD
  startTime?: string;    // HH:mm (e.g. "09:00")
  endTime?: string;      // HH:mm (e.g. "10:30")
  durationMinutes: number;
  priority?: Priority;
  status: TaskStatus;
  notes?: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platformId: string;    // References Platform.id (dynamic)
  categoryId: string;    // References Category.id
  stage: ContentStage;
  targetDate: string;    // YYYY-MM-DD
  uploadTime?: string;   // HH:mm (e.g. "16:30" or "20:00")
  priority?: Priority;
  notes?: string;
  captionDraft?: string;
  checklist?: ChecklistItem[];
  attachments?: ContentAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Routine {
  id: string;
  title: string;
  categoryId: string;    // References Category.id
  targetTime: string;    // e.g. "06:30"
  streak: number;
  frequency: 'daily' | 'weekdays' | 'weekends';
  status: RoutineStatus;
  notes?: string;
}

export interface RoutineLog {
  id: string;
  routineId: string;
  date: string;          // YYYY-MM-DD
  status: 'completed' | 'skipped';
  timestamp: string;
}
