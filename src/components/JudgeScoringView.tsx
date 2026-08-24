import React, { useState, useEffect, useMemo } from 'react';
import { User, EventItem, Contestant, ScoreEntry, CategoryLevel } from '../types';
import { StorageService, calculateWeightedTotal } from '../services/storage';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/formatters';
import {
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Lock,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface JudgeScoringViewProps {
  currentUser: User;
  event: EventItem;
  categoryFilter: CategoryLevel | 'all';
  onCategoryFilterChange: (category: CategoryLevel | 'all') => void;
  onScoreSubmitted?: () => void;
}

export const JudgeScoringView: React.FC<JudgeScoringViewProps> = ({
  currentUser,
  event,
  categoryFilter,
  onCategoryFilterChange,
  onScoreSubmitted,
}) => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [selectedContestantId, setSelectedContestantId] = useState<string>('');
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [currentRawScores, setCurrentRawScores] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Load contestants and scores
  useEffect(() => {
    const allContestants = StorageService.getContestantsByEvent(event.id, categoryFilter);
    setContestants(allContestants);
    const allScores = StorageService.getScores();
    setScores(allScores);

    if (allContestants.length > 0) {
      // If current selected contestant is not in filtered list, select first
      if (!allContestants.find((c) => c.id === selectedContestantId)) {
        setSelectedContestantId(allContestants[0].id);
      }
    } else {
      setSelectedContestantId('');
    }
  }, [event.id, categoryFilter]);

  const selectedContestant = useMemo(() => {
    return contestants.find((c) => c.id === selectedContestantId) || contestants[0];
  }, [contestants, selectedContestantId]);

  // When selected contestant changes, load their existing score for this judge if any
  useEffect(() => {
    if (!selectedContestant) {
      setCurrentRawScores({});
      setRemarks('');
      return;
    }

    const existingScore = StorageService.getScoreForJudgeAndContestant(
      event.id,
      selectedContestant.id,
      currentUser.id
    );

    if (existingScore) {
      setCurrentRawScores(existingScore.criterionScores || {});
      setRemarks(existingScore.remarks || '');
    } else {
      // Default to 85 for each criterion for quick baseline, or 0
      const initial: Record<string, number> = {};
      event.criteria.forEach((crit) => {
        initial[crit.id] = 85;
      });
      setCurrentRawScores(initial);
      setRemarks('');
    }
    setSaveSuccessMsg('');
  }, [selectedContestant?.id, event.id, currentUser.id]);

  const handleScoreChange = (criterionId: string, val: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    setCurrentRawScores((prev) => ({
      ...prev,
      [criterionId]: clamped,
    }));
    setSaveSuccessMsg('');
  };

  const currentTotalWeighted = useMemo(() => {
    return calculateWeightedTotal(currentRawScores, event.criteria);
  }, [currentRawScores, event.criteria]);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContestant) return;

    const newScoreEntry: ScoreEntry = {
      id: `scr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId: event.id,
      contestantId: selectedContestant.id,
      judgeId: currentUser.id,
      judgeName: currentUser.name,
      criterionScores: currentRawScores,
      totalWeightedScore: currentTotalWeighted,
      remarks: remarks.trim(),
      submittedAt: new Date().toISOString(),
      isLocked: true,
    };

    StorageService.submitScore(newScoreEntry);
    setScores(StorageService.getScores());
    setSaveSuccessMsg('Official score recorded and locked successfully!');
    if (onScoreSubmitted) onScoreSubmitted();

    // Auto-advance to next unscored contestant after short feedback
    setTimeout(() => {
      handleNextContestant();
    }, 1200);
  };

  const currentIndex = contestants.findIndex((c) => c.id === selectedContestant?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < contestants.length - 1;

  const handlePrevContestant = () => {
    if (hasPrev) {
      setSelectedContestantId(contestants[currentIndex - 1].id);
    }
  };

  const handleNextContestant = () => {
    if (hasNext) {
      setSelectedContestantId(contestants[currentIndex + 1].id);
    }
  };

  // Check if current contestant is scored by this judge
  const isCurrentContestantScored = Boolean(
    scores.find(
      (s) =>
        s.eventId === event.id &&
        s.contestantId === selectedContestant?.id &&
        s.judgeId === currentUser.id
    )
  );

  const scoredCount = contestants.filter((c) =>
    scores.some((s) => s.eventId === event.id && s.contestantId === c.id && s.judgeId === currentUser.id)
  ).length;

  return (
    <div id="judge-scoring-view" className="space-y-6">
      {/* Event Top Banner */}
      <div className="bg-[#001f3f] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#002d5c]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#002d5c] text-sky-200 border border-[#003a7a]">
                Official Judging Terminal
              </span>
              <span className="text-xs text-slate-300">
                {event.date} • {event.venue}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{event.title}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{event.description}</p>
          </div>

          {/* Judge Status Box */}
          <div className="bg-[#002d5c] border border-[#003a7a] p-3.5 rounded-xl flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[11px] text-slate-300 font-medium">Scoring Progress</div>
              <div className="text-sm font-bold text-white">
                <span className="text-sky-300 font-extrabold">{scoredCount}</span> of {contestants.length} Evaluated
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#003a7a] flex items-center justify-center font-extrabold text-xs text-sky-300">
              {contestants.length > 0 ? Math.round((scoredCount / contestants.length) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Category Filter Buttons in Hero */}
        <div className="mt-5 pt-4 border-t border-[#002d5c] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-300 mr-2">Filter Level:</span>
          {(['all', 'elementary', 'junior_high', 'senior_high', 'college'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryFilterChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white text-[#001f3f] shadow-sm'
                  : 'bg-[#002d5c]/80 text-slate-200 hover:bg-[#003a7a] hover:text-white border border-[#003a7a]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {contestants.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Contestants Found for this Category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            There are currently no registered contestants under{' '}
            {categoryFilter === 'all' ? 'this event' : CATEGORY_LABELS[categoryFilter]}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Contestant Selector Carousel / List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Contestants / Performers</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-[#001f3f] rounded-full">
                  {contestants.length}
                </span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Click to score</span>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {contestants.map((c, idx) => {
                const isSelected = c.id === selectedContestant?.id;
                const isScored = scores.some(
                  (s) => s.eventId === event.id && s.contestantId === c.id && s.judgeId === currentUser.id
                );
                const colorConfig = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.open;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContestantId(c.id)}
                    className={`w-full p-3 rounded-xl border text-left transition relative cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-md ring-2 ring-[#001f3f]/30'
                        : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                          isSelected ? 'bg-white text-[#001f3f]' : 'bg-slate-100 text-slate-900 border border-slate-300'
                        }`}
                      >
                        #{c.entryNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              isSelected ? 'bg-[#002d5c] text-sky-200 border-[#003a7a]' : colorConfig.badge
                            }`}
                          >
                            {CATEGORY_LABELS[c.category]}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {c.name}
                        </h4>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {c.organizationSchool || c.teamName || 'Independent'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isScored ? (
                        <div
                          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Scored</span>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#002d5c] text-slate-300 border border-[#003a7a]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Scoring Card */}
          {selectedContestant && (
            <div className="lg:col-span-8 space-y-4">
              {/* Contestant Banner Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#001f3f] text-white flex flex-col items-center justify-center font-black shrink-0 shadow-sm border border-[#002d5c]">
                    <span className="text-[10px] uppercase font-bold text-sky-300">Entry</span>
                    <span className="text-xl leading-none">#{selectedContestant.entryNumber}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          CATEGORY_COLORS[selectedContestant.category]?.badge
                        }`}
                      >
                        {CATEGORY_LABELS[selectedContestant.category]}
                      </span>
                      {selectedContestant.pieceTitle && (
                        <span className="text-xs text-slate-500 font-medium truncate">
                          Piece: <span className="text-slate-800 font-semibold">"{selectedContestant.pieceTitle}"</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-950">
                      {selectedContestant.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {selectedContestant.organizationSchool} {selectedContestant.teamName && `• ${selectedContestant.teamName}`}
                    </p>
                    {selectedContestant.bio && (
                      <p className="text-xs text-slate-500 mt-1 italic max-w-xl">
                        "{selectedContestant.bio}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Navigation Steppers */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={!hasPrev}
                    onClick={handlePrevContestant}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition cursor-pointer"
                    title="Previous Contestant"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold text-slate-500 px-1">
                    {currentIndex + 1} / {contestants.length}
                  </span>
                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={handleNextContestant}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition cursor-pointer"
                    title="Next Contestant"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scoring Form */}
              <form onSubmit={handleSubmitScore} className="space-y-4">
                <div className="space-y-3">
                  {event.criteria.map((criterion, idx) => {
                    const rawVal = currentRawScores[criterion.id] ?? 85;
                    const weightedVal = Math.round(((rawVal * criterion.weightPercentage) / 100) * 100) / 100;

                    return (
                      <div
                        key={criterion.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#001f3f] text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-900">{criterion.name}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{criterion.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-[#001f3f] border border-slate-300 rounded-lg">
                              Weight: {criterion.weightPercentage}%
                            </span>
                          </div>
                        </div>

                        {/* Sliders & Numeric Controls */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-3">
                          <div className="flex items-center gap-4">
                            {/* Raw Score Slider */}
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={rawVal}
                              onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                              aria-label={`Score slider for ${criterion.name}`}
                              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#001f3f]"
                            />

                            {/* Raw Score Direct Input & Stepper */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleScoreChange(criterion.id, rawVal - 1)}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center transition cursor-pointer"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={rawVal}
                                onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                                aria-label={`Score input for ${criterion.name}`}
                                className="w-16 h-8 text-center font-extrabold text-slate-900 text-base bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                              />
                              <button
                                type="button"
                                onClick={() => handleScoreChange(criterion.id, rawVal + 1)}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center transition cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Quick Score Jump Buttons + Weighted Calculation Pill */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Jump:</span>
                              {[75, 80, 85, 90, 95, 100].map((presetVal) => (
                                <button
                                  key={presetVal}
                                  type="button"
                                  onClick={() => handleScoreChange(criterion.id, presetVal)}
                                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md border transition cursor-pointer ${
                                    rawVal === presetVal
                                      ? 'bg-[#001f3f] text-white border-[#001f3f]'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {presetVal}
                                </button>
                              ))}
                            </div>

                            {/* Mathematical breakdown */}
                            <div className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5">
                              <span className="text-slate-400">Score ({rawVal}) × {criterion.weightPercentage}% =</span>
                              <span className="font-extrabold text-[#001f3f] text-sm">
                                {weightedVal.toFixed(2)} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback / Remarks & Final Calculation Summary */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#001f3f]" />
                      Judge's Constructive Feedback & Comments (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                        setSaveSuccessMsg('');
                      }}
                      placeholder="Write notes on execution, artistry, technique, areas for improvement..."
                      className="w-full text-xs text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001f3f] resize-none"
                    />
                  </div>

                  {/* Grand Total Box & Submit Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#001f3f] text-white rounded-2xl border border-[#002d5c] shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-sky-300" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Total Weighted Final Score
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                        {currentTotalWeighted.toFixed(2)}{' '}
                        <span className="text-xs text-slate-300 font-normal">/ 100.00 points</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-white hover:bg-slate-100 text-[#001f3f] font-black text-sm rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-[#001f3f]" />
                        {isCurrentContestantScored ? 'Update & Confirm Score' : 'Submit Official Score'}
                      </button>
                    </div>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
