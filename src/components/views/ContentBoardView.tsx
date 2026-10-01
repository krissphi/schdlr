import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckSquare,
  Filter,
  GripVertical,
} from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { PlatformIcon } from '../common/Badges';
import { CONTENT_STAGES } from '../../data/seedData';
import { ContentStage, ContentItem } from '../../types/schdlr';
import { getTodayString } from '../../utils/dateUtils';

export const ContentBoardView: React.FC = () => {
  const {
    contentItems,
    platforms,
    moveContentStage,
    openContentModal,
    searchQuery,
    getCategoryById,
    filterPlatformId,
    filterCategoryId,
  } = useScheduler();

  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const stagesOrder: ContentStage[] = [
    'idea',
    'script',
    'shooting',
    'editing',
    'ready',
    'scheduled',
    'published',
  ];

  // Filter content
  const filteredContent = contentItems.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    const activePlat = filterPlatformId !== 'all' ? filterPlatformId : selectedPlatform;
    if (activePlat !== 'all' && item.platformId !== activePlat) {
      return false;
    }

    if (filterCategoryId !== 'all' && item.categoryId !== filterCategoryId) {
      return false;
    }

    return true;
  });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId as ContentStage;
    moveContentStage(draggableId, newStage);
  };

  const handleMovePrevious = (item: ContentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stagesOrder.indexOf(item.stage);
    if (currentIndex > 0) {
      moveContentStage(item.id, stagesOrder[currentIndex - 1]);
    }
  };

  const handleMoveNext = (item: ContentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stagesOrder.indexOf(item.stage);
    if (currentIndex < stagesOrder.length - 1) {
      moveContentStage(item.id, stagesOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Content Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Drag & drop cards across 7 stages to advance production from initial idea to published.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Platform filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-subtle">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="text-xs bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => openContentModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Content
          </button>
        </div>
      </div>

      {/* Drag & Drop Context Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1450px]">
            {CONTENT_STAGES.map((stageConfig, index) => {
              const stageItems = filteredContent.filter((c) => c.stage === stageConfig.id);

              return (
                <div
                  key={stageConfig.id}
                  className="w-72 bg-slate-50/70 rounded-xl border border-slate-200/70 p-3 flex flex-col shrink-0"
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stageConfig.dotColor}`} />
                      <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wide">
                        {stageConfig.label}
                      </h3>
                      <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-600">
                        {stageItems.length}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        openContentModal({
                          id: '',
                          title: '',
                          platformId: platforms[0]?.id || '',
                          categoryId: 'cat-content',
                          stage: stageConfig.id,
                          targetDate: getTodayString(0),
                          createdAt: '',
                          updatedAt: '',
                        })
                      }
                      className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors"
                      title={`Add card in ${stageConfig.label}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Droppable Column */}
                  <Droppable droppableId={stageConfig.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2.5 flex-1 min-h-[420px] rounded-lg p-1 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-slate-100/90 ring-1 ring-slate-400/40' : ''
                        }`}
                      >
                        {stageItems.length === 0 ? (
                          <div className="h-28 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                            Drop cards here
                          </div>
                        ) : (
                          stageItems.map((item, itemIdx) => {
                            const completedChecklistCount =
                              item.checklist?.filter((c) => c.done).length || 0;
                            const totalChecklistCount = item.checklist?.length || 0;
                            const cat = getCategoryById(item.categoryId);

                            return (
                              <Draggable key={item.id} draggableId={item.id} index={itemIdx}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    onClick={() => openContentModal(item)}
                                    className={`rounded-lg border p-3 hover:border-slate-300 shadow-subtle hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between border-l-4 ${
                                      dragSnapshot.isDragging
                                        ? 'shadow-2xl ring-2 ring-slate-900 rotate-1'
                                        : ''
                                    }`}
                                    style={{
                                      backgroundColor: cat?.bgLight || '#ffffff',
                                      borderColor: cat?.borderColor || '#e2e8f0',
                                      borderLeftColor: cat?.color || '#0f172a',
                                    }}
                                  >
                                    <div>
                                      {/* Top Row: Handle, Platform (No priority badge) */}
                                      <div className="flex items-center justify-between gap-1.5 mb-2">
                                        <div className="flex items-center gap-1.5">
                                          <div
                                            {...dragProvided.dragHandleProps}
                                            className="text-slate-300 hover:text-slate-600 cursor-grab p-0.5"
                                            title="Drag to move stage"
                                          >
                                            <GripVertical className="w-3.5 h-3.5" />
                                          </div>
                                          <PlatformIcon platformId={item.platformId} />
                                        </div>

                                        {item.uploadTime && (
                                          <span className="font-mono text-[10px] text-slate-500 font-semibold bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200/50">
                                            {item.uploadTime}
                                          </span>
                                        )}
                                      </div>

                                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">
                                        {item.title}
                                      </h4>

                                      {item.notes && (
                                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                          {item.notes}
                                        </p>
                                      )}
                                    </div>

                                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                                        <div className="flex items-center gap-1 font-mono">
                                          <Calendar className="w-3 h-3 text-slate-400" />
                                          <span>{item.targetDate}</span>
                                        </div>

                                        {totalChecklistCount > 0 && (
                                          <div className="flex items-center gap-1 font-medium text-slate-500">
                                            <CheckSquare className="w-3 h-3 text-slate-400" />
                                            <span>
                                              {completedChecklistCount}/{totalChecklistCount}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Attachments preview */}
                                      {item.attachments && item.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                          {item.attachments.map((att) => (
                                            <span
                                              key={att.id}
                                              className="inline-flex items-center gap-1 text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded"
                                            >
                                              {att.label}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* Quick Move Arrows */}
                                      <div className="flex items-center justify-between pt-1">
                                        <button
                                          onClick={(e) => handleMovePrevious(item, e)}
                                          disabled={index === 0}
                                          title={index === 0 ? '' : `Move to ${stagesOrder[index - 1]}`}
                                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 rounded transition-colors"
                                        >
                                          <ChevronLeft className="w-3.5 h-3.5" />
                                        </button>

                                        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                                          Stage {index + 1}/7
                                        </span>

                                        <button
                                          onClick={(e) => handleMoveNext(item, e)}
                                          disabled={index === stagesOrder.length - 1}
                                          title={
                                            index === stagesOrder.length - 1
                                              ? 'Published!'
                                              : `Advance to ${stagesOrder[index + 1]}`
                                          }
                                          className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-20 rounded transition-colors"
                                        >
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
