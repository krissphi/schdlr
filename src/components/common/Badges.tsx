import React from 'react';
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  Music2,
  Video,
} from 'lucide-react';
import { Priority, TaskStatus, ContentStage } from '../../types/schdlr';
import { CONTENT_STAGES } from '../../data/seedData';
import { useScheduler } from '../../context/SchedulerContext';

export const CategoryBadge: React.FC<{ categoryId: string; className?: string }> = ({
  categoryId,
  className = '',
}) => {
  const { getCategoryById } = useScheduler();
  const category = getCategoryById(categoryId);

  if (!category) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{
        backgroundColor: category.bgLight,
        color: category.textColor,
        border: `1px solid ${category.borderColor}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  );
};

// Compact, simple social media platform icon
export const PlatformIcon: React.FC<{ platformId: string; size?: number; className?: string }> = ({
  platformId,
  size = 14,
  className = '',
}) => {
  const { getPlatformById } = useScheduler();
  const platform = getPlatformById(platformId);

  if (!platform) return null;

  const renderIcon = () => {
    const nameLower = platform.name.toLowerCase();
    if (nameLower.includes('tiktok')) return <Music2 style={{ width: size, height: size }} />;
    if (nameLower.includes('instagram')) return <Instagram style={{ width: size, height: size }} />;
    if (nameLower.includes('youtube')) return <Youtube style={{ width: size, height: size }} />;
    if (nameLower.includes('twitter') || nameLower.includes('x'))
      return <Twitter style={{ width: size, height: size }} />;
    if (nameLower.includes('linkedin')) return <Linkedin style={{ width: size, height: size }} />;
    if (nameLower.includes('blog') || nameLower.includes('web'))
      return <Globe style={{ width: size, height: size }} />;
    return <Video style={{ width: size, height: size }} />;
  };

  return (
    <div
      title={platform.name}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-md transition-transform hover:scale-110 shadow-subtle shrink-0 ${className}`}
      style={{
        backgroundColor: platform.bgLight,
        color: platform.textColor,
        border: `1px solid ${platform.color}25`,
      }}
    >
      {renderIcon()}
    </div>
  );
};

export const PlatformBadge: React.FC<{ platformId: string; className?: string }> = ({
  platformId,
  className = '',
}) => {
  return <PlatformIcon platformId={platformId} className={className} />;
};

export const PriorityBadge: React.FC<{ priority: Priority; className?: string }> = ({
  priority,
  className = '',
}) => {
  const map: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
    low: { label: 'Low', bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
    medium: { label: 'Med', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    high: { label: 'High', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    urgent: { label: 'Urgent', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
  };

  const item = map[priority] || map.medium;

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border border-transparent ${item.bg} ${item.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
};

export const StageBadge: React.FC<{ stage: ContentStage; className?: string }> = ({
  stage,
  className = '',
}) => {
  const config = CONTENT_STAGES.find((s) => s.id === stage) || CONTENT_STAGES[0];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const map: Record<TaskStatus, { label: string; style: string }> = {
    todo: { label: 'To-do', style: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
    in_progress: { label: 'In Progress', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    completed: { label: 'Completed', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelled', style: 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through' },
  };

  const item = map[status] || map.todo;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${item.style} ${className}`}
    >
      {item.label}
    </span>
  );
};
