import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Share2,
  Clock,
  Layers,
  Code2,
  Video,
  Target,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { CONTENT_STAGES } from '../../data/seedData';
import { PlatformBadge, PlatformIcon } from '../common/Badges';
import { isDateInCurrentWeek } from '../../utils/dateUtils';

export const AnalyticsView: React.FC = () => {
  const { tasks, contentItems, categories, platforms } = useScheduler();
  const [weeklyTarget, setWeeklyTarget] = useState<number>(4);

  // Memoized task metrics
  const { totalTasks, completedTasks, completionRate } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalTasks: total, completedTasks: completed, completionRate: rate };
  }, [tasks]);

  // Memoized content pipeline metrics
  const { totalContent, publishedContent, inPipelineContent } = useMemo(() => {
    const total = contentItems.length;
    const published = contentItems.filter((c) => c.stage === 'published').length;
    const inPipeline = total - published;
    return { totalContent: total, publishedContent: published, inPipelineContent: inPipeline };
  }, [contentItems]);

  // Memoized hours by category
  const { hoursByCategory, totalPlannedHours, codingHours, contentHours } = useMemo(() => {
    const hours: Record<string, number> = {};
    tasks.forEach((t) => {
      const h = (t.durationMinutes || 60) / 60;
      hours[t.categoryId] = (hours[t.categoryId] || 0) + h;
    });

    const total = Object.values(hours).reduce((acc, val) => acc + val, 0);

    const codingCategory = categories.find((c) => c.name.toLowerCase().includes('coding'));
    const coding = codingCategory ? hours[codingCategory.id] || 0 : 0;

    const contCategory = categories.find((c) => c.name.toLowerCase().includes('content'));
    const cont = contCategory ? hours[contCategory.id] || 0 : 0;

    return {
      hoursByCategory: hours,
      totalPlannedHours: total,
      codingHours: coding,
      contentHours: cont,
    };
  }, [tasks, categories]);

  // Memoized Weekly Publishing Cadence
  const weeklyCadence = useMemo(() => {
    const thisWeekItems = contentItems.filter((c) => isDateInCurrentWeek(c.targetDate));
    const published = thisWeekItems.filter((c) => c.stage === 'published').length;
    const queuedOrReady = thisWeekItems.filter((c) => c.stage === 'ready' || c.stage === 'scheduled').length;
    const inProgress = thisWeekItems.filter(
      (c) => c.stage === 'script' || c.stage === 'shooting' || c.stage === 'editing'
    ).length;

    const progressPct = weeklyTarget > 0 ? Math.min(100, Math.round((published / weeklyTarget) * 100)) : 0;
    const totalCommitted = published + queuedOrReady;

    return {
      thisWeekItems,
      published,
      queuedOrReady,
      inProgress,
      progressPct,
      totalCommitted,
    };
  }, [contentItems, weeklyTarget]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Progress</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your execution metrics, content publishing velocity, and hours spent per category.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tasks Completed */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Task Completion
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{completionRate}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </div>

        {/* Published Content */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Published Content
            </span>
            <Share2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{publishedContent}</div>
            <p className="text-xs text-slate-500 mt-1">
              {inPipelineContent} in production pipeline
            </p>
          </div>
        </div>

        {/* Coding Hours */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Time on Coding
            </span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{codingHours.toFixed(1)} hrs</div>
            <p className="text-xs text-slate-500 mt-1">
              Deep work & architecture sessions
            </p>
          </div>
        </div>

        {/* Content Creation Hours */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Time on Content
            </span>
            <Video className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{contentHours.toFixed(1)} hrs</div>
            <p className="text-xs text-slate-500 mt-1">
              Scripting, filming, & editing
            </p>
          </div>
        </div>
      </div>

      {/* NEW: Weekly Publishing Cadence & Target Widget */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Weekly Publishing Cadence</span>
                {weeklyCadence.published >= weeklyTarget ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Target Reached! 🚀
                  </span>
                ) : weeklyCadence.totalCommitted >= weeklyTarget ? (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-blue-600" /> On Track (Ready to upload)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    {weeklyTarget - weeklyCadence.totalCommitted} more needed this week
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Upload Minggu Ini: <span className="font-semibold text-slate-700">{weeklyTarget} video/posts</span> (Tercapai: {weeklyCadence.published}/{weeklyTarget})
              </p>
            </div>
          </div>

          {/* Quick Target Setter */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-400 font-medium">Weekly Target:</span>
            <select
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 10].map((num) => (
                <option key={num} value={num}>
                  {num} posts / week
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar & Numerical Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">Publishing Target Progress</span>
            <span className="font-mono text-slate-900">{weeklyCadence.progressPct}% live ({weeklyCadence.published} of {weeklyTarget})</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            {/* Live published bar */}
            <div
              className="h-full bg-emerald-600 rounded-l-full transition-all duration-500"
              style={{ width: `${Math.min(100, (weeklyCadence.published / weeklyTarget) * 100)}%` }}
              title={`Published: ${weeklyCadence.published}`}
            />
            {/* Scheduled / Ready queue bar */}
            <div
              className="h-full bg-blue-400 transition-all duration-500"
              style={{
                width: `${Math.min(
                  100 - (weeklyCadence.published / weeklyTarget) * 100,
                  (weeklyCadence.queuedOrReady / weeklyTarget) * 100
                )}%`,
              }}
              title={`Scheduled / Ready: ${weeklyCadence.queuedOrReady}`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="font-medium text-slate-700">{weeklyCadence.published} Published Live</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="font-medium text-slate-700">{weeklyCadence.queuedOrReady} Ready / Scheduled</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="font-medium text-slate-700">{weeklyCadence.inProgress} In Production</span>
              </span>
            </div>

            <span className="text-slate-400 font-mono">
              Mon – Sun Cycle
            </span>
          </div>
        </div>

        {/* Current week releases preview chips */}
        {weeklyCadence.thisWeekItems.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              This Week's Content Release Schedule
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {weeklyCadence.thisWeekItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <PlatformIcon platformId={item.platformId} size={14} />
                    <span className="font-medium text-slate-800 truncate">{item.title}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ${
                      item.stage === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.stage === 'scheduled' || item.stage === 'ready'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {item.uploadTime || item.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Allocation By Category */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Time Allocation by Category</h3>
              <p className="text-xs text-slate-400">Total planned: {totalPlannedHours.toFixed(1)} hours</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((category) => {
              const hours = hoursByCategory[category.id] || 0;
              const percentage = totalPlannedHours > 0 ? Math.round((hours / totalPlannedHours) * 100) : 0;

              return (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-slate-700">{category.name}</span>
                    </div>
                    <span className="font-mono text-slate-500">
                      {hours.toFixed(1)}h ({percentage}%)
                    </span>
                  </div>

                  {/* Clean progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Pipeline Funnel Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Content Pipeline Funnel</h3>
              <p className="text-xs text-slate-400">{totalContent} total items across 7 stages</p>
            </div>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2.5 pt-2">
            {CONTENT_STAGES.map((stage) => {
              const count = contentItems.filter((c) => c.stage === stage.id).length;
              const percentage = totalContent > 0 ? Math.round((count / totalContent) * 100) : 0;

              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                    <span>{stage.label}</span>
                  </div>

                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>

                  <span className="w-8 text-right font-mono text-xs font-semibold text-slate-700">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Platform Publishing Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {platforms.map((p) => {
            const count = contentItems.filter((c) => c.platformId === p.id).length;
            const published = contentItems.filter(
              (c) => c.platformId === p.id && c.stage === 'published'
            ).length;

            return (
              <div key={p.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <PlatformBadge platformId={p.id} />
                <div className="text-lg font-bold text-slate-900 pt-1">{count} items</div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  {published} live published
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
