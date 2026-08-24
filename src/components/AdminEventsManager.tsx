import React, { useState } from 'react';
import { EventItem, CategoryLevel, User, Criterion } from '../types';
import { StorageService } from '../services/storage';
import { CATEGORY_LABELS } from '../utils/formatters';
import { CriteriaWeightManager } from './CriteriaWeightManager';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Users,
  Shield,
  Layers,
  Save,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface AdminEventsManagerProps {
  events: EventItem[];
  onEventsUpdated: () => void;
  allJudges: User[];
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
}

export const AdminEventsManager: React.FC<AdminEventsManagerProps> = ({
  events,
  onEventsUpdated,
  allJudges,
  selectedEventId,
  onSelectEvent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [status, setStatus] = useState<EventItem['status']>('ongoing');
  const [selectedCategories, setSelectedCategories] = useState<CategoryLevel[]>([
    'elementary',
    'junior_high',
    'senior_high',
    'college',
  ]);
  const [assignedJudgeIds, setAssignedJudgeIds] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [scoringMethod, setScoringMethod] = useState<EventItem['scoringMethod']>('average');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleStartCreate = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('13:00 - 17:00');
    setVenue('');
    setStatus('ongoing');
    setSelectedCategories(['elementary', 'junior_high', 'senior_high', 'college']);
    setAssignedJudgeIds(allJudges.map((j) => j.id));
    // Default criteria matching user's exact specification:
    // Teamwork 10%, Creativity 10%, Organized 20%, Presentation 60%
    setCriteria([
      {
        id: `crit_${Date.now()}_1`,
        name: 'Teamwork & Synchronization',
        description: 'Unity, group coordination, rhythm precision, and mutual support on stage.',
        weightPercentage: 10,
        maxRawScore: 100,
      },
      {
        id: `crit_${Date.now()}_2`,
        name: 'Creativity & Choreography',
        description: 'Originality of routine, artistic flair, styling, and creative formations.',
        weightPercentage: 10,
        maxRawScore: 100,
      },
      {
        id: `crit_${Date.now()}_3`,
        name: 'Organization & Mastery',
        description: 'Structure, discipline, smooth transitions, spatial control, and mastery.',
        weightPercentage: 20,
        maxRawScore: 100,
      },
      {
        id: `crit_${Date.now()}_4`,
        name: 'Overall Presentation & Stage Impact',
        description: 'Projection, audience engagement, authentic costumes, and theatrical impact.',
        weightPercentage: 60,
        maxRawScore: 100,
      },
    ]);
    setScoringMethod('average');
    setNotes('');
    setValidationError('');
    setIsEditing(true);
  };

  const handleStartEdit = (event: EventItem) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setTime(event.time);
    setVenue(event.venue);
    setStatus(event.status);
    setSelectedCategories(event.categories);
    setAssignedJudgeIds(event.assignedJudgeIds);
    setCriteria(event.criteria);
    setScoringMethod(event.scoringMethod);
    setNotes(event.notes || '');
    setValidationError('');
    setIsEditing(true);
  };

  const handleToggleCategory = (cat: CategoryLevel) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length <= 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleToggleJudge = (judgeId: string) => {
    if (assignedJudgeIds.includes(judgeId)) {
      setAssignedJudgeIds(assignedJudgeIds.filter((id) => id !== judgeId));
    } else {
      setAssignedJudgeIds([...assignedJudgeIds, judgeId]);
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter an event title.');
      return;
    }

    if (criteria.length === 0) {
      setValidationError('Please add at least one criterion.');
      return;
    }

    const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weightPercentage) || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      setValidationError(`Total criteria percentage must equal 100% (currently ${totalWeight}%).`);
      return;
    }

    const newEvent: EventItem = {
      id: editingEventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      venue: venue.trim() || 'Main Gymnasium / Stage',
      status,
      categories: selectedCategories,
      criteria,
      assignedJudgeIds,
      scoringMethod,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    StorageService.saveEvent(newEvent);
    onEventsUpdated();
    setIsEditing(false);
    onSelectEvent(newEvent.id);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (events.length <= 1) {
      alert('You must have at least one event in the system.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this event? All associated scores and contestants will also be removed.')) {
      StorageService.deleteEvent(eventId);
      onEventsUpdated();
      const remaining = events.filter((e) => e.id !== eventId);
      if (remaining.length > 0) {
        onSelectEvent(remaining[0].id);
      }
    }
  };

  const allAvailableCategories: CategoryLevel[] = ['elementary', 'junior_high', 'senior_high', 'college', 'open'];

  return (
    <div id="admin-events-manager" className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#001f3f]" />
            <h3 className="text-lg font-bold text-slate-900">Event & Criteria Management</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create events, set dates, schedules, allowed category levels, and customize percentage criteria weights.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Event
          </button>
        )}
      </div>

      {/* Editor Modal / Panel */}
      {isEditing ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#001f3f]" />
              {editingEventId ? 'Edit Event Details & Criteria' : 'Create New Competition / Event'}
            </h4>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSaveEvent} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Event Title / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inter-School Performing Arts & Cultural Dance Showcase 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the competition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Schedule / Time</label>
                <input
                  type="text"
                  placeholder="e.g. 13:00 - 18:00 or 1:00 PM - 5:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Venue / Location</label>
                <input
                  type="text"
                  placeholder="e.g. University Grand Gymnasium & Cultural Center"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f] bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing (Scoring Open)</option>
                  <option value="scoring_locked">Scoring Locked (Tabulation Finalized)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Category Levels Checkbox Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#001f3f]" />
                Select Applicable Category Levels for this Event:
              </label>
              <div className="flex flex-wrap gap-2">
                {allAvailableCategories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                        isChecked
                          ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                          isChecked ? 'bg-sky-400 text-slate-950 font-black' : 'border border-slate-400'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      {CATEGORY_LABELS[cat]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assign Judges */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#001f3f]" />
                Assign Judges to this Event ({assignedJudgeIds.length} Assigned):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {allJudges.map((judge, idx) => {
                  const isAssigned = assignedJudgeIds.includes(judge.id);
                  return (
                    <button
                      key={judge.id}
                      type="button"
                      onClick={() => handleToggleJudge(judge.id)}
                      className={`p-2.5 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
                        isAssigned
                          ? 'bg-white border-[#001f3f] shadow-xs ring-1 ring-[#001f3f]/30'
                          : 'bg-white/60 border-slate-200 text-slate-500 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${
                            isAssigned ? 'bg-[#001f3f] text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          J{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{judge.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{judge.title || 'Judge'}</div>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isAssigned ? 'bg-[#001f3f] text-white font-bold' : 'border border-slate-300'
                        }`}
                      >
                        {isAssigned && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Criteria & Weighting Component */}
            <div className="border-t border-slate-200 pt-4">
              <CriteriaWeightManager criteria={criteria} onChange={setCriteria} />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingEventId ? 'Update Event & Criteria' : 'Save & Publish Event'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Events List Cards */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          All Registered Events ({events.length})
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {events.map((evt) => {
            const isCurrent = evt.id === selectedEventId;
            const totalWeight = evt.criteria.reduce((s, c) => s + (c.weightPercentage || 0), 0);

            return (
              <div
                key={evt.id}
                className={`bg-white rounded-2xl p-5 border transition shadow-xs hover:shadow-sm ${
                  isCurrent ? 'border-[#001f3f] ring-2 ring-[#001f3f]/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          evt.status === 'ongoing'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : evt.status === 'scoring_locked'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {evt.status === 'ongoing'
                          ? 'Active / Ongoing'
                          : evt.status === 'scoring_locked'
                          ? 'Scoring Locked'
                          : evt.status}
                      </span>

                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {evt.date}
                      </span>
                      {evt.time && (
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {evt.time}
                        </span>
                      )}
                      {evt.venue && (
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.venue}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900">{evt.title}</h4>
                    <p className="text-xs text-slate-600 max-w-3xl">{evt.description}</p>

                    {/* Category Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Levels:</span>
                      {evt.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md border border-slate-200"
                        >
                          {CATEGORY_LABELS[cat]}
                        </span>
                      ))}
                    </div>

                    {/* Criteria Preview Bar */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-bold text-slate-700">Criteria Weighting:</span>
                      {evt.criteria.map((c) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 bg-slate-100 text-[#001f3f] border border-slate-300 rounded text-[11px] font-semibold"
                        >
                          {c.name} ({c.weightPercentage}%)
                        </span>
                      ))}
                      <span className="text-[10px] font-bold text-emerald-700 ml-1">Total: {totalWeight}%</span>
                    </div>
                  </div>

                  {/* Actions & Select button */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <button
                      onClick={() => onSelectEvent(evt.id)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#001f3f] text-white hover:bg-[#002d5c]'
                      }`}
                    >
                      {isCurrent ? 'Active Event' : 'Set as Active'}
                    </button>

                    <button
                      onClick={() => handleStartEdit(evt)}
                      className="p-2 text-slate-600 hover:text-[#001f3f] hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer"
                      title="Edit Event & Criteria"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
