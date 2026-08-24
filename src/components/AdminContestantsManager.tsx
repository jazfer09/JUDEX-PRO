import React, { useState } from 'react';
import { Contestant, CategoryLevel, EventItem } from '../types';
import { StorageService } from '../services/storage';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/formatters';
import { Plus, Edit2, Trash2, Layers, UserPlus, Save, X, Sparkles, Hash } from 'lucide-react';

interface AdminContestantsManagerProps {
  event: EventItem;
  categoryFilter: CategoryLevel | 'all';
  onCategoryFilterChange: (category: CategoryLevel | 'all') => void;
  onContestantsUpdated: () => void;
}

export const AdminContestantsManager: React.FC<AdminContestantsManagerProps> = ({
  event,
  categoryFilter,
  onCategoryFilterChange,
  onContestantsUpdated,
}) => {
  const [contestants, setContestants] = useState<Contestant[]>(() =>
    StorageService.getContestantsByEvent(event.id, categoryFilter)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [entryNumber, setEntryNumber] = useState<number>(1);
  const [category, setCategory] = useState<CategoryLevel>('elementary');
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [organizationSchool, setOrganizationSchool] = useState('');
  const [pieceTitle, setPieceTitle] = useState('');
  const [bio, setBio] = useState('');

  const refreshList = () => {
    const list = StorageService.getContestantsByEvent(event.id, categoryFilter);
    setContestants(list);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    const existingInEvent = StorageService.getContestantsByEvent(event.id, 'all');
    const nextNumber = existingInEvent.length > 0 ? Math.max(...existingInEvent.map((c) => c.entryNumber)) + 1 : 1;
    setEntryNumber(nextNumber);
    setCategory(categoryFilter === 'all' ? (event.categories[0] || 'elementary') : categoryFilter);
    setName('');
    setTeamName('');
    setOrganizationSchool('');
    setPieceTitle('');
    setBio('');
    setIsEditing(true);
  };

  const handleStartEdit = (c: Contestant) => {
    setEditingId(c.id);
    setEntryNumber(c.entryNumber);
    setCategory(c.category);
    setName(c.name);
    setTeamName(c.teamName || '');
    setOrganizationSchool(c.organizationSchool || '');
    setPieceTitle(c.pieceTitle || '');
    setBio(c.bio || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContestant: Contestant = {
      id: editingId || `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId: event.id,
      category,
      entryNumber: Number(entryNumber) || 1,
      name: name.trim(),
      teamName: teamName.trim(),
      organizationSchool: organizationSchool.trim(),
      pieceTitle: pieceTitle.trim(),
      bio: bio.trim(),
      status: 'active',
    };

    StorageService.saveContestant(newContestant);
    setIsEditing(false);
    refreshList();
    onContestantsUpdated();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this contestant? All their submitted scores will also be removed.')) {
      StorageService.deleteContestant(id);
      refreshList();
      onContestantsUpdated();
    }
  };

  const availableCategories = event.categories.length > 0
    ? event.categories
    : (['elementary', 'junior_high', 'senior_high', 'college'] as CategoryLevel[]);

  return (
    <div id="admin-contestants-manager" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#001f3f]" />
            <h3 className="text-lg font-bold text-slate-900">Contestants & Performers Directory</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage participants for <span className="font-semibold text-slate-800">{event.title}</span>.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Contestant
          </button>
        )}
      </div>

      {/* Category Level Filter Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#001f3f]" />
          Filter by Level:
        </span>
        {(['all', ...availableCategories] as const).map((cat) => {
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryFilterChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                isSelected
                  ? 'bg-[#001f3f] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cat === 'all' ? 'All Registered' : CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Editor Form */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#001f3f]" />
              {editingId ? 'Edit Contestant Information' : 'Register New Contestant / Group'}
            </h4>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Entry # <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    value={entryNumber}
                    onChange={(e) => setEntryNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Category Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryLevel)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f] bg-white"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Contestant / Group Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Little Bayanihan Dancers or Juan Dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Team / Troupe Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude Children Troupe"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">School / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude Elementary Academy"
                  value={organizationSchool}
                  onChange={(e) => setOrganizationSchool(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-800 mb-1">Piece Title / Presentation Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sayaw sa Bangko & Subli Tribute"
                  value={pieceTitle}
                  onChange={(e) => setPieceTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-800 mb-1">Short Bio / Background Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional information for the judges..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {editingId ? 'Update Contestant' : 'Save Contestant'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contestants Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contestants.map((c) => {
          const colorConfig = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.open;
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${colorConfig.badge}`}
                  >
                    {CATEGORY_LABELS[c.category]}
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[#001f3f] text-white text-xs font-black flex items-center justify-center">
                    #{c.entryNumber}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-950 mb-1">{c.name}</h4>
                <p className="text-xs text-slate-600 font-medium">{c.organizationSchool || 'Independent'}</p>
                {c.pieceTitle && (
                  <p className="text-xs text-[#001f3f] font-semibold mt-1">
                    Piece: <span className="italic">"{c.pieceTitle}"</span>
                  </p>
                )}
                {c.bio && <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">"{c.bio}"</p>}
              </div>

              <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleStartEdit(c)}
                  className="px-2.5 py-1 text-slate-600 hover:text-[#001f3f] hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 transition cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition cursor-pointer"
                  title="Delete Contestant"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
