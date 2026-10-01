import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  CheckSquare,
  Layers,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { PlatformIcon } from '../common/Badges';
import {
  addDaysToString,
  getTodayString,
  isTodayString,
  formatDisplayDate,
} from '../../utils/dateUtils';

export const Header: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const {
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    filterPlatformId,
    setFilterPlatformId,
    filterCategoryId,
    setFilterCategoryId,
    categories,
    platforms,
    tasks,
    contentItems,
    openTaskModal,
    openContentModal,
  } = useScheduler();

  const [currentTime, setCurrentTime] = useState('');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live ticking clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search input handler (250ms) to prevent unnecessary re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Keep local search synced if external reset occurs
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timezone-safe date navigation using dateUtils
  const handlePrevDay = () => {
    setSelectedDate(addDaysToString(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDaysToString(selectedDate, 1));
  };

  const handleTodayJump = () => {
    setSelectedDate(getTodayString(0));
  };

  const isToday = isTodayString(selectedDate);
  const formattedDate = formatDisplayDate(selectedDate);

  // Quick matching results for search popover
  const q = localSearch.toLowerCase().trim();
  const matchedTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const matchedContent = q
    ? contentItems.filter((c) => c.title.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q)).slice(0, 5)
    : [];

  const hasResults = matchedTasks.length > 0 || matchedContent.length > 0;
  const isAnyFilterActive = filterPlatformId !== 'all' || filterCategoryId !== 'all';

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 gap-4">
      {/* Left: Mobile trigger & Date navigator */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Date Navigator (100% Timezone Safe) */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg p-1">
          <button
            onClick={handlePrevDay}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleTodayJump}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
              isToday
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {isToday ? 'Today' : formattedDate}
          </button>

          <button
            onClick={handleNextDay}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Year */}
        <div className="hidden xl:flex items-center gap-1 text-xs text-slate-500 font-medium ml-1">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDisplayDate(selectedDate, { year: 'numeric' })}</span>
        </div>
      </div>

      {/* Middle & Right: Global Filters, Debounced Search, Clock */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-3xl">
        {/* Global Filter Pills */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Platform Filter */}
          <div className="relative">
            <select
              value={filterPlatformId}
              onChange={(e) => setFilterPlatformId(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 py-1.5 pl-2.5 pr-7 rounded-lg border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer appearance-none"
              title="Filter by Social Platform"
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 py-1.5 pl-2.5 pr-7 rounded-lg border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer appearance-none"
              title="Filter by Category Bucket"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Reset Filters button */}
          {isAnyFilterActive && (
            <button
              onClick={() => {
                setFilterPlatformId('all');
                setFilterCategoryId('all');
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/60"
              title="Clear active filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Global Debounced Search with instant popover */}
        <div ref={searchContainerRef} className="relative w-44 sm:w-64 lg:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks, content..."
            value={localSearch}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setIsSearchFocused(true);
            }}
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-900 placeholder-slate-400 pl-8 pr-7 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Search Results Dropdown */}
          {isSearchFocused && q && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
              {!hasResults ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching tasks or content found
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {matchedTasks.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <CheckSquare className="w-3 h-3" /> Tasks
                      </div>
                      {matchedTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            openTaskModal(t);
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800 truncate">{t.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">{t.date}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedContent.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <Layers className="w-3 h-3" /> Content Cards
                      </div>
                      {matchedContent.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            openContentModal(c);
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <PlatformIcon platformId={c.platformId} size={12} />
                            <span className="font-medium text-slate-800 truncate">{c.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0 capitalize">{c.stage}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Clock Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-600 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
};
