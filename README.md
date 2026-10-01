# Schdlr

Schdlr is a local-first personal scheduler and content creation hub built around three core pillars: Plan, Create, and Track. It integrates daily task management, a multi-stage content publishing pipeline, and habit consistency tracking into a single web application.

## Overview

### Plan
- Today View: Daily dashboard featuring greetings, next-up task queues, and quick task entry.
- Tasks: Activity manager with category color-tinting, status filtering, debounced search, and pagination.
- Calendar: Monthly overview displaying scheduled tasks and content release previews with a daily inspector panel.
- Timeline: Hour-by-hour time blocking (06:00 to 23:00) with a live real-time indicator.

### Create
- Content Pipeline: 7-stage Kanban board (Idea, Script, Shooting, Editing, Ready, Scheduled, Published) featuring drag-and-drop support, checklists, asset links, and celebration effects.
- Upload Schedule: Creator release calendar displaying monthly post counters, daily queues, and release times.

### Track
- Routines: Habit tracker supporting streak calculation, completion history logs, weekday/weekend frequency filtering, and a 35-day consistency heat map grid.
- Analytics: Metrics dashboard tracking task completion rates, content pipeline funnels, weekly publishing cadence targets, and category time allocation.

## Key Features

- Local-First Data Storage: All user data is stored locally in browser storage via Zustand persistence.
- Timezone-Safe Date Utility: Date formatting and interval calculations powered by date-fns.
- Optimized Performance: Route-level code splitting via React.lazy and Suspense, Vite Rollup manual chunking, debounced search inputs, and non-blocking Google Fonts loading.
- PWA & Push Notifications: Progressive Web App capabilities via vite-plugin-pwa, Service Worker caching, RFC 5545 iCalendar (.ics) export, and 15-minute background upload reminders.
- Data Security: Zod schema runtime validation for URL protocol sanitization, hex color regex verification, and JSON backup import/export with undo actions.

## Tech Stack

- Framework: React 18, TypeScript, Vite 6
- Styling: Tailwind CSS, Lucide React Icons
- State Management: Zustand 5 (modular stores with persistence)
- Utilities: date-fns 4, Zod 4, @hello-pangea/dnd, canvas-confetti, vite-plugin-pwa

## Project Structure

```
schdlr/
├── src/
│   ├── components/
│   │   ├── common/       # Badges, ToastContainer, ViewSkeleton
│   │   ├── layout/       # Sidebar, Header
│   │   ├── modals/       # TaskModal, ContentModal, RoutineModal, ConfigModal
│   │   └── views/        # TodayView, TasksView, CalendarView, etc.
│   ├── context/          # SchedulerContext facade
│   ├── data/             # Seed data and stage configurations
│   ├── hooks/            # useUploadReminder and custom hooks
│   ├── store/            # Modular Zustand stores
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Timezone-safe dateUtils, icalExport, validation, notifications
├── public/               # PWA assets and manifest icons
├── vite.config.ts        # Build options, code-splitting, and Workbox PWA configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Navigate to the project directory:
   ```bash
   cd schdlr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

## Deployment

Schdlr is a client-side Single Page Application (SPA). It requires no server-side database and can be deployed to static hosting services such as Vercel, Netlify, or Cloudflare Pages.

- Build Command: `npm run build`
- Output Directory: `dist`

## License

MIT
