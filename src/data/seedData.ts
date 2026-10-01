import { format, addDays } from 'date-fns';
import {
  Category,
  Platform,
  ContentStageConfig,
  ActivityTask,
  ContentItem,
  Routine,
  RoutineLog,
} from '../types/schdlr';

export const CONTENT_STAGES: ContentStageConfig[] = [
  { id: 'idea', label: 'Idea', description: 'Brainstorm & hook concepts', dotColor: 'bg-zinc-400' },
  { id: 'script', label: 'Script', description: 'Outline & speaking notes', dotColor: 'bg-amber-500' },
  { id: 'shooting', label: 'Shooting', description: 'Filming, recording, B-roll', dotColor: 'bg-indigo-500' },
  { id: 'editing', label: 'Editing', description: 'Cutting, audio & color grade', dotColor: 'bg-purple-500' },
  { id: 'ready', label: 'Ready', description: 'Thumbnail & captions ready', dotColor: 'bg-blue-500' },
  { id: 'scheduled', label: 'Scheduled', description: 'Queued on target platform', dotColor: 'bg-teal-500' },
  { id: 'published', label: 'Published', description: 'Live & distributed', dotColor: 'bg-emerald-500' },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-content',
    name: 'Content',
    color: '#e11d48',
    bgLight: '#fff1f2',
    textColor: '#be123c',
    borderColor: '#fecdd3',
    icon: 'Video',
  },
  {
    id: 'cat-coding',
    name: 'Coding',
    color: '#2563eb',
    bgLight: '#eff6ff',
    textColor: '#1d4ed8',
    borderColor: '#bfdbfe',
    icon: 'Code2',
  },
  {
    id: 'cat-business',
    name: 'Business',
    color: '#059669',
    bgLight: '#ecfdf5',
    textColor: '#047857',
    borderColor: '#a7f3d0',
    icon: 'Briefcase',
  },
  {
    id: 'cat-learning',
    name: 'Learning',
    color: '#7c3aed',
    bgLight: '#f5f3ff',
    textColor: '#6d28d9',
    borderColor: '#ddd6fe',
    icon: 'BookOpen',
  },
  {
    id: 'cat-personal',
    name: 'Personal',
    color: '#0891b2',
    bgLight: '#ecfeff',
    textColor: '#0e7490',
    borderColor: '#a5f3fc',
    icon: 'User',
  },
  {
    id: 'cat-hobby',
    name: 'Hobby',
    color: '#d97706',
    bgLight: '#fffbeb',
    textColor: '#b45309',
    borderColor: '#fde68a',
    icon: 'Sparkles',
  },
];

export const INITIAL_PLATFORMS: Platform[] = [
  {
    id: 'plat-tiktok',
    name: 'TikTok',
    color: '#000000',
    bgLight: '#f4f4f5',
    textColor: '#18181b',
    icon: 'Music2',
  },
  {
    id: 'plat-instagram',
    name: 'Instagram',
    color: '#d946ef',
    bgLight: '#fdf4ff',
    textColor: '#a21caf',
    icon: 'Instagram',
  },
  {
    id: 'plat-youtube',
    name: 'YouTube',
    color: '#dc2626',
    bgLight: '#fef2f2',
    textColor: '#b91c1c',
    icon: 'Youtube',
  },
  {
    id: 'plat-x',
    name: 'X (Twitter)',
    color: '#27272a',
    bgLight: '#f4f4f5',
    textColor: '#18181b',
    icon: 'Twitter',
  },
  {
    id: 'plat-linkedin',
    name: 'LinkedIn',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    textColor: '#0369a1',
    icon: 'Linkedin',
  },
  {
    id: 'plat-blog',
    name: 'Blog / Web',
    color: '#4f46e5',
    bgLight: '#eef2ff',
    textColor: '#4338ca',
    icon: 'Globe',
  },
];

// Timezone-safe local date helper using date-fns
export const getTodayString = (offsetDays = 0): string => {
  return format(addDays(new Date(), offsetDays), 'yyyy-MM-dd');
};

export const INITIAL_TASKS: ActivityTask[] = [
  {
    id: 'task-1',
    title: 'Morning Routine & Coffee Prep',
    categoryId: 'cat-personal',
    date: getTodayString(0),
    startTime: '07:00',
    endTime: '08:00',
    durationMinutes: 60,
    status: 'completed',
    notes: 'Hydrate, light stretching, and brew pour-over coffee.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Morning Coding: Refactor Scheduler State',
    categoryId: 'cat-coding',
    date: getTodayString(0),
    startTime: '08:30',
    endTime: '11:00',
    durationMinutes: 150,
    status: 'completed',
    notes: 'Make Category & Platform dynamic models with local storage sync.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Review Q3 Freelance Proposal & Invoices',
    categoryId: 'cat-business',
    date: getTodayString(0),
    startTime: '11:15',
    endTime: '12:30',
    durationMinutes: 75,
    status: 'completed',
    notes: 'Send revised contract agreement to client.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Lunch Break & Tech Reading',
    categoryId: 'cat-learning',
    date: getTodayString(0),
    startTime: '12:30',
    endTime: '13:30',
    durationMinutes: 60,
    status: 'completed',
    notes: 'Read updates on TypeScript 5.8 & React 19 architecture.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Shooting B-Roll: Review Mainan Vintage',
    categoryId: 'cat-content',
    date: getTodayString(0),
    startTime: '16:30',
    endTime: '18:00',
    durationMinutes: 90,
    status: 'in_progress',
    notes: 'Macro shots of articulation & packaging box details.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Rack Display & Desk Organization',
    categoryId: 'cat-hobby',
    date: getTodayString(0),
    startTime: '19:30',
    endTime: '20:45',
    durationMinutes: 75,
    status: 'todo',
    notes: 'Assemble acrylic stand for figure showcase and cable routing.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    title: 'Hobby Content: Night Photography Edit',
    categoryId: 'cat-hobby',
    date: getTodayString(0),
    startTime: '22:30',
    endTime: '23:30',
    durationMinutes: 60,
    status: 'todo',
    notes: 'Color grading lighting mood in Lightroom.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-8',
    title: 'Deploy Production Release Candidate',
    categoryId: 'cat-coding',
    date: getTodayString(1),
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    status: 'todo',
    notes: 'Run E2E smoke tests and tag v1.0 on git repository.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-9',
    title: 'Weekly Budget & Expenses Audit',
    categoryId: 'cat-business',
    date: getTodayString(2),
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    status: 'todo',
    notes: 'Update spreadsheet and categorize receipts.',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cnt-1',
    title: 'Review Mainan: Unboxing Robot Mecha 90s',
    platformId: 'plat-tiktok',
    categoryId: 'cat-content',
    stage: 'shooting',
    targetDate: getTodayString(0),
    uploadTime: '17:30',
    notes: 'Format 9:16 vertical short. Highlight articulation and nostalgia.',
    captionDraft: 'Nemu lagi mainan mecha favorit jaman dulu! Masih worth it gak di 2026? #Nostalgia #ToyCollector #Mecha',
    attachments: [
      { id: 'att-1', label: 'Raw Footage GDrive', url: 'https://drive.google.com', type: 'drive' },
      { id: 'att-2', label: 'Audio SFX Track', url: 'https://youtube.com', type: 'video' },
    ],
    checklist: [
      { id: 'c1', text: 'Hook kalimat pertama (3 detik pertama)', done: true },
      { id: 'c2', text: 'Close-up detail cat & sendi', done: true },
      { id: 'c3', text: 'B-roll rotating turntable', done: false },
      { id: 'c4', text: 'Voiceover kesimpulan & CTA follow', done: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-2',
    title: 'Setup Clean Minimalist Desk: Rack Display Tour',
    platformId: 'plat-instagram',
    categoryId: 'cat-hobby',
    stage: 'editing',
    targetDate: getTodayString(0),
    uploadTime: '20:00',
    notes: 'Reels 60 detik dengan audio lofi santai. Estetika white clean.',
    captionDraft: 'Workspace minimalis yang bikin betah coding berjam-jam. Rate 1-10? ✨',
    attachments: [
      { id: 'att-3', label: 'Figma Thumbnail Cover', url: 'https://figma.com', type: 'figma' },
    ],
    checklist: [
      { id: 'c2-1', text: 'Color grade warm white balance', done: true },
      { id: 'c2-2', text: 'Tambahkan sound effects typing & click', done: true },
      { id: 'c2-3', text: 'Tulis captions deskripsi gear', done: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-3',
    title: 'Ide: Kenapa Clean Architecture Bikin Developer Tenang',
    platformId: 'plat-youtube',
    categoryId: 'cat-coding',
    stage: 'idea',
    targetDate: getTodayString(5),
    uploadTime: '19:00',
    notes: 'Konsep studi kasus refactor spaghetti code jadi modul rapi.',
    attachments: [
      { id: 'att-4', label: 'Notion Architecture Outline', url: 'https://notion.so', type: 'notion' },
    ],
    checklist: [
      { id: 'c3-1', text: 'Kumpulkan contoh code anti-pattern', done: false },
      { id: 'c3-2', text: 'Buat outline diagram Mermaid', done: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-4',
    title: 'Scripting: 5 Tools Produktivitas Developer 2026',
    platformId: 'plat-x',
    categoryId: 'cat-learning',
    stage: 'script',
    targetDate: getTodayString(1),
    uploadTime: '11:00',
    notes: 'Thread Twitter 7 tweet dengan screenshot & perbandingan.',
    captionDraft: '5 tools minimalis yang bikin daily workflow saya 2x lebih fokus tahun ini 🧵👇',
    checklist: [
      { id: 'c4-1', text: 'Drafting tweet 1-5', done: true },
      { id: 'c4-2', text: 'Siapkan visual mockup resolusi tinggi', done: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-5',
    title: 'Carousel: Belajar TypeScript Generic dalam 3 Menit',
    platformId: 'plat-instagram',
    categoryId: 'cat-coding',
    stage: 'ready',
    targetDate: getTodayString(1),
    uploadTime: '18:30',
    notes: 'Desain slide monokrom dengan syntax highlight.',
    captionDraft: 'Masih bingung bedanya Type vs Interface vs Generics? Slide ini buat kamu!',
    attachments: [
      { id: 'att-5', label: 'Figma Carousel Slides', url: 'https://figma.com', type: 'figma' },
    ],
    checklist: [
      { id: 'c5-1', text: 'Slide 1-6 proofread', done: true },
      { id: 'c5-2', text: 'Export PNG 1080x1350', done: true },
      { id: 'c5-3', text: 'Hashtag research siap', done: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-6',
    title: 'Mengatur Waktu Coding & Konten Tanpa Burnout',
    platformId: 'plat-linkedin',
    categoryId: 'cat-business',
    stage: 'scheduled',
    targetDate: getTodayString(1),
    uploadTime: '09:00',
    notes: 'Sharing pengalaman membagi peran developer dan creator.',
    checklist: [
      { id: 'c6-1', text: 'Review tone of voice profesional', done: true },
      { id: 'c6-2', text: 'Schedule via LinkedIn Post Planner (09:00 WIB)', done: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cnt-7',
    title: 'Life Scheduler: Portfolio Architecture Showcase',
    platformId: 'plat-blog',
    categoryId: 'cat-coding',
    stage: 'published',
    targetDate: getTodayString(-2),
    uploadTime: '14:00',
    notes: 'Artikel teknis lengkap mengulas React, TypeScript, dan state management.',
    checklist: [
      { id: 'c7-1', text: 'Publish ke web domain', done: true },
      { id: 'c7-2', text: 'Share snippet ke social media', done: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rtn-1',
    title: 'Morning Coding & Focus Block',
    categoryId: 'cat-coding',
    targetTime: '08:30',
    streak: 18,
    frequency: 'daily',
    status: 'pending',
    notes: 'Deep work zone tanpa notifikasi HP.',
  },
  {
    id: 'rtn-2',
    title: 'Quick 20-min Workout / Mobility',
    categoryId: 'cat-personal',
    targetTime: '16:00',
    streak: 6,
    frequency: 'daily',
    status: 'pending',
    notes: 'Push up, pull up bar, dan hamstring stretch.',
  },
  {
    id: 'rtn-3',
    title: 'Content Pipeline Check & Asset Backup',
    categoryId: 'cat-content',
    targetTime: '19:00',
    streak: 12,
    frequency: 'daily',
    status: 'pending',
    notes: 'Pindahkan footage kamera ke SSD eksternal.',
  },
  {
    id: 'rtn-4',
    title: 'Night Tech Reading / Docs Review',
    categoryId: 'cat-learning',
    targetTime: '22:00',
    streak: 24,
    frequency: 'daily',
    status: 'pending',
    notes: 'Minimal 15 menit sebelum istirahat tidur.',
  },
];

export const generateInitialRoutineLogs = (): RoutineLog[] => {
  const logs: RoutineLog[] = [];
  const routinesList = ['rtn-1', 'rtn-2', 'rtn-3', 'rtn-4'];

  for (let i = 34; i >= 1; i--) {
    const dateStr = getTodayString(-i);
    routinesList.forEach((rId, idx) => {
      const pseudoRandom = (i * 7 + idx * 13) % 10;
      if (pseudoRandom < 8) {
        logs.push({
          id: `log-${dateStr}-${rId}`,
          routineId: rId,
          date: dateStr,
          status: 'completed',
          timestamp: `${dateStr}T10:00:00Z`,
        });
      } else if (pseudoRandom === 8) {
        logs.push({
          id: `log-${dateStr}-${rId}`,
          routineId: rId,
          date: dateStr,
          status: 'skipped',
          timestamp: `${dateStr}T10:00:00Z`,
        });
      }
    });
  }

  return logs;
};
