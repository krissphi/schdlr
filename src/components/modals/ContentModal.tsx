import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { CONTENT_STAGES } from '../../data/seedData';
import { ContentStage, ChecklistItem, ContentAttachment } from '../../types/schdlr';
import { useToastStore } from '../../store/useToastStore';

export const ContentModal: React.FC = () => {
  const {
    isContentModalOpen,
    editingContent,
    closeContentModal,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    platforms,
    categories,
    selectedDate,
  } = useScheduler();

  const showToast = useToastStore((state) => state.showToast);

  const [title, setTitle] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [stage, setStage] = useState<ContentStage>('idea');
  const [targetDate, setTargetDate] = useState(selectedDate);
  const [uploadTime, setUploadTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [captionDraft, setCaptionDraft] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState<ContentAttachment[]>([]);
  const [attLabel, setAttLabel] = useState('');
  const [attUrl, setAttUrl] = useState('');
  const [attType, setAttType] = useState<ContentAttachment['type']>('link');

  const selectedCategory = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (editingContent) {
      setTitle(editingContent.title || '');
      setPlatformId(editingContent.platformId || platforms[0]?.id || '');
      setCategoryId(editingContent.categoryId || 'cat-content');
      setSubCategoryId(editingContent.subCategoryId || '');
      setStage(editingContent.stage || 'idea');
      setTargetDate(editingContent.targetDate || selectedDate);
      setUploadTime(editingContent.uploadTime || '17:00');
      setNotes(editingContent.notes || '');
      setCaptionDraft(editingContent.captionDraft || '');
      setChecklist(editingContent.checklist || []);
      setAttachments(editingContent.attachments || []);
    } else {
      setTitle('');
      setPlatformId(platforms[0]?.id || '');
      setCategoryId('cat-content');
      setSubCategoryId('');
      setStage('idea');
      setTargetDate(selectedDate);
      setUploadTime('17:00');
      setNotes('');
      setCaptionDraft('');
      setChecklist([
        { id: 'c1', text: 'Hook sentence (first 3 seconds)', done: false },
        { id: 'c2', text: 'Write script outline', done: false },
      ]);
      setAttachments([]);
    }
  }, [editingContent, isContentModalOpen, platforms, selectedDate]);

  if (!isContentModalOpen) return null;

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attLabel.trim() || !attUrl.trim()) return;

    let cleanUrl = attUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const parsed = new URL(cleanUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        alert('Hanya link dengan protokol http:// atau https:// yang diizinkan');
        return;
      }
    } catch {
      alert('Format URL tidak valid');
      return;
    }

    const newAtt: ContentAttachment = {
      id: `att-${Date.now()}`,
      label: attLabel.trim(),
      url: cleanUrl,
      type: attType,
    };
    setAttachments((prev) => [...prev, newAtt]);
    setAttLabel('');
    setAttUrl('');
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingContent && editingContent.id) {
      updateContentItem(editingContent.id, {
        title: title.trim(),
        platformId: platformId || platforms[0]?.id,
        categoryId: categoryId || 'cat-content',
        subCategoryId: subCategoryId || undefined,
        stage,
        targetDate,
        uploadTime,
        notes: notes.trim(),
        captionDraft: captionDraft.trim(),
        checklist,
        attachments,
      });
    } else {
      addContentItem({
        title: title.trim(),
        platformId: platformId || platforms[0]?.id,
        categoryId: categoryId || 'cat-content',
        subCategoryId: subCategoryId || undefined,
        stage,
        targetDate,
        uploadTime,
        notes: notes.trim(),
        captionDraft: captionDraft.trim(),
        checklist,
        attachments,
      });
    }

    closeContentModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {editingContent && editingContent.id ? 'Edit Content Card' : 'New Content Card'}
            </h2>
            <p className="text-xs text-slate-400">
              Manage production stage, exact upload hour, sub-tasks, and asset links.
            </p>
          </div>
          <button
            onClick={closeContentModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Content Title / Topic *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Review Mainan: Unboxing Robot Mecha..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Stage Progression Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Production Stage ({CONTENT_STAGES.find((s) => s.id === stage)?.label})
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              {CONTENT_STAGES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStage(s.id)}
                  className={`text-[11px] font-semibold py-1.5 px-1 rounded flex flex-col items-center gap-1 transition-all ${
                    stage === s.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      stage === s.id ? 'bg-white' : s.dotColor
                    }`}
                  />
                  <span className="truncate w-full text-center">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform, Upload Date, and Upload Hour */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Platform
              </label>
              <select
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Hour (Exact)
              </label>
              <input
                type="time"
                value={uploadTime}
                onChange={(e) => setUploadTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Category & Sub-category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Bucket
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubCategoryId('');
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-category (Optional)
              </label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!selectedCategory?.subCategories || selectedCategory.subCategories.length === 0}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
              >
                <option value="">None</option>
                {selectedCategory?.subCategories?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Media & Link Attachments */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Asset & Reference Links (GDrive, Figma, Notion, Video)
            </label>

            {attachments.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-slate-700">{att.label}:</span>
                      <a
                        href={att.url.startsWith('http') ? att.url : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline truncate flex items-center gap-1"
                      >
                        {att.url}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick add attachment */}
            <div className="flex gap-2">
              <select
                value={attType}
                onChange={(e) => setAttType(e.target.value as any)}
                className="w-24 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 focus:bg-white focus:outline-none"
              >
                <option value="drive">GDrive</option>
                <option value="figma">Figma</option>
                <option value="notion">Notion</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
              </select>
              <input
                type="text"
                placeholder="Label (e.g. Raw Footage)"
                value={attLabel}
                onChange={(e) => setAttLabel(e.target.value)}
                className="w-1/3 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <input
                type="text"
                placeholder="URL (https://...)"
                value={attUrl}
                onChange={(e) => setAttUrl(e.target.value)}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors shrink-0"
              >
                Add Link
              </button>
            </div>
          </div>

          {/* Production Checklist */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Production Checklist
            </label>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleChecklist(item.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span
                      className={`truncate ${
                        item.done ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add checklist task..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem(e);
                  }
                }}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Add item
              </button>
            </div>
          </div>

          {/* Captions Draft */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Caption Draft & Hashtags
            </label>
            <textarea
              rows={2}
              placeholder="Write social copy, hashtags (#viral #review)..."
              value={captionDraft}
              onChange={(e) => setCaptionDraft(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Notes / Shot list */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes & Technical Specs
            </label>
            <textarea
              rows={2}
              placeholder="B-roll ideas, lighting notes, audio tracks, gear specs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            {editingContent && editingContent.id ? (
              <button
                type="button"
                onClick={() => {
                  const backup = { ...editingContent };
                  deleteContentItem(editingContent.id);
                  closeContentModal();
                  showToast({
                    message: `Content "${editingContent.title}" deleted`,
                    type: 'info',
                    durationMs: 5000,
                    undoLabel: 'Undo',
                    undoAction: () => addContentItem(backup),
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Card</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeContentModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
              >
                {editingContent && editingContent.id ? 'Save Changes' : 'Create Content Card'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
