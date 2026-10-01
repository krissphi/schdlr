import React, { useState } from 'react';
import {
  SunMedium,
  CheckSquare,
  Calendar,
  Clock,
  Layers,
  CalendarClock,
  Repeat,
  BarChart2,
  Sliders,
  Download,
  CalendarDays,
  Bell,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { ViewMode } from '../../types/schdlr';
import { requestNotificationPermission, sendLocalNotification } from '../../utils/notifications';

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile?: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const {
    currentView,
    setCurrentView,
    openTaskModal,
    openContentModal,
    openConfigModal,
    resetToDefaults,
    exportDataJSON,
    exportICalendar,
    tasks,
    contentItems,
    routines,
  } = useScheduler();

  const [notificationStatus, setNotificationStatus] = useState<string>('');

  const handleEnableNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationStatus('Aktif');
      sendLocalNotification('Schdlr Notification', 'Notifikasi pengingat upload dan tugas telah aktif! ✨');
      setTimeout(() => setNotificationStatus(''), 3000);
    }
  };

  const navPillars = [
    {
      title: 'PLAN',
      items: [
        {
          id: 'today' as ViewMode,
          label: 'Today',
          icon: SunMedium,
          badge: tasks.filter((t) => t.status !== 'completed').length,
        },
        {
          id: 'tasks' as ViewMode,
          label: 'Tasks',
          icon: CheckSquare,
          badge: tasks.length,
        },
        {
          id: 'calendar' as ViewMode,
          label: 'Calendar',
          icon: Calendar,
        },
        {
          id: 'timeline' as ViewMode,
          label: 'Timeline',
          icon: Clock,
        },
      ],
    },
    {
      title: 'CREATE',
      items: [
        {
          id: 'content-board' as ViewMode,
          label: 'Content Pipeline',
          icon: Layers,
          badge: contentItems.filter((c) => c.stage !== 'published').length,
        },
        {
          id: 'upload-schedule' as ViewMode,
          label: 'Upload Schedule',
          icon: CalendarClock,
          badge: contentItems.filter((c) => c.stage === 'scheduled' || c.stage === 'ready').length,
        },
      ],
    },
    {
      title: 'TRACK',
      items: [
        {
          id: 'routines' as ViewMode,
          label: 'Routines',
          icon: Repeat,
          badge: routines.length,
        },
        {
          id: 'analytics' as ViewMode,
          label: 'Analytics',
          icon: BarChart2,
        },
      ],
    },
  ];

  const handleSelectView = (view: ViewMode) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Permanently fixed sidebar: full height of viewport, independent scroll */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 h-screen bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
              S
            </div>
            <div>
              <div className="font-semibold text-slate-900 tracking-tight text-base leading-none">
                Schdlr
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-1 uppercase">
                Plan · Build · Track
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="p-3 border-b border-slate-100 flex gap-2 shrink-0">
          <button
            onClick={() => openTaskModal()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
          <button
            onClick={() => openContentModal()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Content
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navPillars.map((pillar) => (
            <div key={pillar.title} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {pillar.title}
              </div>
              <div className="space-y-0.5">
                {pillar.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                            isActive
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Utility Area */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1.5 shrink-0">
          <button
            onClick={openConfigModal}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Manage Categories & Platforms</span>
          </button>

          {/* Quick iCal Export & Notifications */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={exportICalendar}
              title="Export all tasks & content to Apple / Google Calendar (.ics)"
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-md border border-slate-200/60 transition-colors"
            >
              <CalendarDays className="w-3 h-3 text-slate-500" />
              <span>Export .ics</span>
            </button>

            <button
              onClick={handleEnableNotification}
              title="Aktifkan pengingat notifikasi desktop/mobile"
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-md border border-slate-200/60 transition-colors"
            >
              <Bell className="w-3 h-3 text-slate-500" />
              <span>{notificationStatus || 'Alerts'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
            <button
              onClick={exportDataJSON}
              title="Export JSON backup"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-colors"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>Backup</span>
            </button>
            <button
              onClick={resetToDefaults}
              title="Reset data to initial sample"
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
