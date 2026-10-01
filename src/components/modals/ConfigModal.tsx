import React, { useState } from 'react';
import { X, Plus, Trash2, Sliders, Tag, Globe, CornerDownRight } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { CategoryBadge, PlatformBadge } from '../common/Badges';
import { Category } from '../../types/schdlr';

const CategoryCardItem: React.FC<{ category: Category; categoriesCount: number }> = ({
  category,
  categoriesCount,
}) => {
  const { deleteCategory, addSubCategory, deleteSubCategory } = useScheduler();
  const [subName, setSubName] = useState('');

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    addSubCategory(category.id, subName.trim());
    setSubName('');
  };

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-xs">
      <div className="p-3 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CategoryBadge categoryId={category.id} />
        </div>

        {categoriesCount > 1 && (
          <button
            onClick={() => {
              if (window.confirm(`Delete category "${category.name}"?`)) {
                deleteCategory(category.id);
              }
            }}
            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sub-categories management */}
      <div className="p-3 space-y-2">
        {/* Existing Sub-categories Chips */}
        {category.subCategories && category.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {category.subCategories.map((sub, index) => {
              // Generate subtle shade variations of parent category color (adjust opacity/lightness dynamically)
              const opacities = ['18', '28', '38', '48', '58'];
              const bgOpacity = opacities[index % opacities.length];
              return (
                <span
                  key={sub.id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all"
                  style={{
                    backgroundColor: `${category.color}${bgOpacity}`,
                    color: category.textColor,
                    border: `1px solid ${category.color}35`,
                  }}
                >
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                  {sub.name}
                  <button
                    onClick={() => deleteSubCategory(category.id, sub.id)}
                    className="hover:opacity-70 rounded-full p-0.5 ml-0.5"
                    title="Remove sub-category"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Add Sub-category Input */}
        <form onSubmit={handleAddSub} className="flex gap-1.5 pt-0.5">
          <input
            type="text"
            placeholder="Add sub-category..."
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            className="flex-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <button
            type="submit"
            disabled={!subName.trim()}
            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-800 disabled:opacity-40 hover:bg-slate-900 rounded-lg transition-all shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export const ConfigModal: React.FC = () => {
  const {
    isConfigModalOpen,
    closeConfigModal,
    categories,
    addCategory,
    deleteCategory,
    platforms,
    addPlatform,
    deletePlatform,
  } = useScheduler();

  const [activeTab, setActiveTab] = useState<'categories' | 'platforms'>('categories');

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#0284c7');

  // New Platform Form
  const [newPlatName, setNewPlatName] = useState('');
  const [newPlatColor, setNewPlatColor] = useState('#4f46e5');

  if (!isConfigModalOpen) return null;

  // Preset curated pastel/vibrant colors
  const colorPresets = [
    '#e11d48', // Rose
    '#2563eb', // Blue
    '#059669', // Emerald
    '#7c3aed', // Violet
    '#0891b2', // Cyan
    '#d97706', // Amber
    '#ea580c', // Orange
    '#4b5563', // Gray
    '#db2777', // Pink
    '#0d9488', // Teal
  ];

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      color: newCatColor,
      bgLight: `${newCatColor}15`,
      textColor: newCatColor,
      borderColor: `${newCatColor}30`,
    });

    setNewCatName('');
  };

  const handleCreatePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatName.trim()) return;

    addPlatform({
      name: newPlatName.trim(),
      color: newPlatColor,
      bgLight: `${newPlatColor}15`,
      textColor: newPlatColor,
    });

    setNewPlatName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Manage Categories & Platforms
            </h2>
          </div>
          <button
            onClick={closeConfigModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex border-b border-slate-100 gap-4">
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'categories'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'platforms'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Platforms ({platforms.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'categories' ? (
            <div className="space-y-5">
              {/* Add Category Form */}
              <form onSubmit={handleCreateCategory} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-700">Add New Category</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fitness, Gaming, Freelance, Finance..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {/* Color presets */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Color:</span>
                  {colorPresets.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setNewCatColor(c)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        newCatColor === c ? 'scale-125 ring-2 ring-slate-900 ring-offset-1' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </form>

              {/* Current Categories List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Categories
                </div>
                <div className="space-y-3">
                  {categories.map((c) => (
                    <CategoryCardItem key={c.id} category={c} categoriesCount={categories.length} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Add Platform Form */}
              <form onSubmit={handleCreatePlatform} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-700">Add New Platform</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Threads, Substack, Podcast, Pinterest..."
                    value={newPlatName}
                    onChange={(e) => setNewPlatName(e.target.value)}
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Color:</span>
                  {colorPresets.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setNewPlatColor(c)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        newPlatColor === c ? 'scale-125 ring-2 ring-slate-900 ring-offset-1' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </form>

              {/* Current Platforms List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Platforms
                </div>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                  {platforms.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlatformBadge platformId={p.id} />
                        <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                      </div>

                      {platforms.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete platform "${p.name}"?`)) {
                              deletePlatform(p.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
