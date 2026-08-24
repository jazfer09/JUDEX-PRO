import React, { useState } from 'react';
import { User, EventItem, CategoryLevel, Contestant, ScoreEntry } from '../types';
import { StorageService } from '../services/storage';
import { CATEGORY_LABELS } from '../utils/formatters';
import {
  UserCheck,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Layers,
  Save,
  X,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface AdminJudgesManagerProps {
  event: EventItem;
  allJudges: User[];
  onJudgesUpdated: () => void;
  categoryFilter: CategoryLevel | 'all';
  onCategoryFilterChange: (cat: CategoryLevel | 'all') => void;
}

export const AdminJudgesManager: React.FC<AdminJudgesManagerProps> = ({
  event,
  allJudges,
  onJudgesUpdated,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [passcode, setPasscode] = useState('judge123');

  const contestants = StorageService.getContestantsByEvent(event.id, categoryFilter);
  const scores = StorageService.getScores().filter((s) => s.eventId === event.id);
  const assignedJudges = allJudges.filter((j) => event.assignedJudgeIds.includes(j.id));

  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newJudge = StorageService.addUser({
      name: name.trim(),
      email: email.trim(),
      role: 'judge',
      title: title.trim() || 'Official Judge',
      departmentSchool: department.trim() || 'Adjudication Committee',
      passcode: passcode.trim() || 'judge123',
    });

    // Auto assign to this event
    const updatedEvent: EventItem = {
      ...event,
      assignedJudgeIds: [...event.assignedJudgeIds, newJudge.id],
    };
    StorageService.saveEvent(updatedEvent);

    setIsAdding(false);
    setName('');
    setEmail('');
    setTitle('');
    setDepartment('');
    onJudgesUpdated();
  };

  const handleDeleteJudge = (judgeId: string) => {
    if (window.confirm('Delete this judge account?')) {
      StorageService.deleteUser(judgeId);
      onJudgesUpdated();
    }
  };

  return (
    <div id="admin-judges-manager" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#001f3f]" />
            <h3 className="text-lg font-bold text-slate-900">Judges Progress & Matrix</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor multi-judge scoring submissions and register new evaluators for{' '}
            <span className="font-semibold text-slate-800">{event.title}</span>.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Register New Judge
          </button>
        )}
      </div>

      {/* Add Judge Modal */}
      {isAdding && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#001f3f]" />
              Register New Adjudicator / Judge
            </h4>
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddJudge} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Maria Elena Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. judge.maria@tabulate.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Title / Designation</label>
              <input
                type="text"
                placeholder="e.g. Chairman, Board of Judges or Dance Maestro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Department / Organization</label>
              <input
                type="text"
                placeholder="e.g. College of Performing Arts"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Passcode / PIN</label>
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#001f3f] hover:bg-[#002d5c] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save & Assign Judge
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Level Filter */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#001f3f]" />
          Filter Matrix Level:
        </span>
        {(['all', 'elementary', 'junior_high', 'senior_high', 'college'] as const).map((cat) => {
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

      {/* Live Judge Submission Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#001f3f] text-white flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Real-Time Scoring Matrix ({assignedJudges.length} Judges Assigned)
          </h4>
          <span className="text-xs text-sky-300 font-semibold">
            {scores.length} Total Score Submissions Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-4 font-bold">Entry # & Contestant</th>
                <th className="py-3 px-3 font-bold">Category</th>
                {assignedJudges.map((j, idx) => (
                  <th key={j.id} className="py-3 px-3 font-bold text-center">
                    <div className="font-extrabold text-slate-900">Judge {idx + 1}</div>
                    <div className="text-[10px] text-slate-500 font-normal truncate max-w-[120px] mx-auto">
                      {j.name}
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {contestants.map((c) => {
                const contestantScores = scores.filter((s) => s.contestantId === c.id);
                const isComplete = assignedJudges.length > 0 && contestantScores.length >= assignedJudges.length;

                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#001f3f] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          #{c.entryNumber}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.organizationSchool || 'Independent'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold">
                        {CATEGORY_LABELS[c.category]}
                      </span>
                    </td>

                    {assignedJudges.map((j) => {
                      const score = contestantScores.find((s) => s.judgeId === j.id);
                      return (
                        <td key={j.id} className="py-3 px-3 text-center">
                          {score ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="font-black text-[#001f3f] bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-xs">
                                {score.totalWeightedScore.toFixed(2)} pts
                              </span>
                              <span className="text-[9px] text-emerald-700 font-bold mt-0.5 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Scored
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3" /> Waiting
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3 px-4 text-center">
                      {isComplete ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-full text-[10px]">
                          Complete ({contestantScores.length}/{assignedJudges.length})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 font-bold rounded-full text-[10px]">
                          {contestantScores.length}/{assignedJudges.length} Judges
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Judges Cards List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          All Adjudicators on File ({allJudges.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {allJudges.map((judge, idx) => (
            <div
              key={judge.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#001f3f] text-white font-black text-xs flex items-center justify-center shrink-0">
                  J{idx + 1}
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-xs text-slate-900 truncate">{judge.name}</h5>
                  <p className="text-[11px] text-slate-600 truncate">{judge.title || 'Official Judge'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{judge.departmentSchool || judge.email}</p>
                  <div className="mt-1 text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                    PIN: {judge.passcode || 'judge1'}
                  </div>
                </div>
              </div>

              {allJudges.length > 1 && (
                <button
                  onClick={() => handleDeleteJudge(judge.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove Judge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
