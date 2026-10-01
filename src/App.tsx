import React, { useState, Suspense, lazy } from 'react';
import { SchedulerProvider, useScheduler } from './context/SchedulerContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TaskModal } from './components/modals/TaskModal';
import { ContentModal } from './components/modals/ContentModal';
import { RoutineModal } from './components/modals/RoutineModal';
import { ConfigModal } from './components/modals/ConfigModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ViewSkeleton } from './components/common/ViewSkeleton';
import { useUploadReminder } from './hooks/useUploadReminder';

// Code-splitting via React.lazy for optimal chunk sizes and initial load performance
const TodayView = lazy(() => import('./components/views/TodayView').then(m => ({ default: m.TodayView })));
const TasksView = lazy(() => import('./components/views/TasksView').then(m => ({ default: m.TasksView })));
const CalendarView = lazy(() => import('./components/views/CalendarView').then(m => ({ default: m.CalendarView })));
const TimelineView = lazy(() => import('./components/views/TimelineView').then(m => ({ default: m.TimelineView })));
const ContentBoardView = lazy(() => import('./components/views/ContentBoardView').then(m => ({ default: m.ContentBoardView })));
const UploadScheduleView = lazy(() => import('./components/views/UploadScheduleView').then(m => ({ default: m.UploadScheduleView })));
const RoutinesView = lazy(() => import('./components/views/RoutinesView').then(m => ({ default: m.RoutinesView })));
const AnalyticsView = lazy(() => import('./components/views/AnalyticsView').then(m => ({ default: m.AnalyticsView })));

const MainLayout: React.FC = () => {
  const { currentView } = useScheduler();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Background upload reminder runner (15 minutes before uploadTime)
  useUploadReminder();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView />;
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'timeline':
        return <TimelineView />;
      case 'content-board':
        return <ContentBoardView />;
      case 'upload-schedule':
        return <UploadScheduleView />;
      case 'routines':
        return <RoutinesView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#fafafa] font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Permanently fixed sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport (scrolls independently) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Suspense fallback={<ViewSkeleton />}>
            {renderCurrentView()}
          </Suspense>
        </main>
      </div>

      {/* Interactive Global Modals */}
      <TaskModal />
      <ContentModal />
      <RoutineModal />
      <ConfigModal />

      {/* Global Toast Container with Undo */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SchedulerProvider>
      <MainLayout />
    </SchedulerProvider>
  );
}
