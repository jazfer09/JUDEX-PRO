import React, { useState, useEffect } from 'react';
import { EventItem, CategoryLevel, TabulationResult, User } from '../types';
import { StorageService } from '../services/storage';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Medal,
  Award,
  Printer,
  Download,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TabulationLeaderboardProps {
  event: EventItem;
  categoryFilter: CategoryLevel | 'all';
  onCategoryFilterChange: (cat: CategoryLevel | 'all') => void;
  onOpenPrintView: () => void;
}

export const TabulationLeaderboard: React.FC<TabulationLeaderboardProps> = ({
  event,
  categoryFilter,
  onCategoryFilterChange,
  onOpenPrintView,
}) => {
  const [tabulationData, setTabulationData] = useState<{
    results: TabulationResult[];
    assignedJudges: User[];
    completionPercentage: number;
  }>({
    results: [],
    assignedJudges: [],
    completionPercentage: 0,
  });

  const [expandedContestantId, setExpandedContestantId] = useState<string | null>(null);

  const loadData = () => {
    const data = StorageService.computeTabulation(event.id, categoryFilter);
    setTabulationData({
      results: data.results,
      assignedJudges: data.assignedJudges,
      completionPercentage: data.completionPercentage,
    });
  };

  useEffect(() => {
    loadData();
  }, [event.id, categoryFilter]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1e3a8a', '#38bdf8', '#fbbf24', '#ffffff', '#10b981'],
    });
  };

  const { results, assignedJudges, completionPercentage } = tabulationData;

  const top3 = results.slice(0, 3);

  // Export CSV
  const handleExportCSV = () => {
    if (results.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    // Header
    const headers = [
      'Rank',
      'Entry No.',
      'Contestant Name',
      'Category',
      'School/Organization',
      'Piece Title',
      ...assignedJudges.map((j, i) => `Judge ${i + 1} (${j.name})`),
      'Average Score',
      'Status',
    ];
    csvContent += headers.join(',') + '\r\n';

    // Rows
    results.forEach((row) => {
      const line = [
        row.rank,
        row.contestant.entryNumber,
        `"${row.contestant.name.replace(/"/g, '""')}"`,
        `"${CATEGORY_LABELS[row.contestant.category]}"`,
        `"${(row.contestant.organizationSchool || '').replace(/"/g, '""')}"`,
        `"${(row.contestant.pieceTitle || '').replace(/"/g, '""')}"`,
        ...assignedJudges.map((j) => (row.judgeWeightedScores[j.id] !== null ? row.judgeWeightedScores[j.id]?.toFixed(2) : 'N/A')),
        row.averageScore.toFixed(2),
        row.scoringComplete ? 'Complete' : 'Pending',
      ];
      csvContent += line.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Official_Tabulation_${event.title.replace(/\s+/g, '_')}_${categoryFilter}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="tabulation-leaderboard" className="space-y-6">
      {/* Top Banner with Action Controls */}
      <div className="bg-[#001f3f] text-white rounded-2xl p-6 shadow-md border border-[#002d5c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#002d5c] text-sky-200 border border-[#003a7a]">
              Official Master Tabulation
            </span>
            <span className="text-xs text-slate-300">
              {event.date} • {event.venue}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{event.title}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Calculated via weighted percentage summation across {assignedJudges.length} official judges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={triggerConfetti}
            className="px-3.5 py-2 bg-[#002d5c] hover:bg-[#003a7a] text-sky-200 border border-[#003a7a] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-300" />
            Celebrate Winners
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#002d5c] hover:bg-[#003a7a] text-white border border-[#003a7a] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={onOpenPrintView}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Official Tally Sheet
          </button>
        </div>
      </div>

      {/* Category Level Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#001f3f]" />
            Filter Category:
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
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Registered' : CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-2">
          <span>Judging Completion:</span>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="font-bold text-slate-900">{completionPercentage}%</span>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && top3[0].averageScore > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 1st Place / Champion (Center on mobile or order-1) */}
          {top3[0] && (
            <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-5 border-2 border-amber-300 shadow-sm relative overflow-hidden flex flex-col justify-between order-1 md:order-2">
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                CHAMPION (1ST PLACE)
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-xs mb-3">
                  <Trophy className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    CATEGORY_COLORS[top3[0].contestant.category]?.badge
                  }`}
                >
                  {CATEGORY_LABELS[top3[0].contestant.category]} • Entry #{top3[0].contestant.entryNumber}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-950 mt-1">
                  {top3[0].contestant.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {top3[0].contestant.organizationSchool || top3[0].contestant.teamName}
                </p>
                {top3[0].contestant.pieceTitle && (
                  <p className="text-xs text-amber-900 italic mt-1 font-semibold">
                    "{top3[0].contestant.pieceTitle}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Final Tabulated Score:</span>
                <span className="text-xl font-black text-amber-900">
                  {top3[0].averageScore.toFixed(2)} pts
                </span>
              </div>
            </div>
          )}

          {/* 2nd Place / 1st Runner Up */}
          {top3[1] && (
            <div className="bg-gradient-to-b from-slate-100 to-white rounded-2xl p-5 border border-slate-300 shadow-xs relative overflow-hidden flex flex-col justify-between order-2 md:order-1">
              <div className="absolute top-0 right-0 bg-slate-300 text-slate-800 font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                1ST RUNNER UP (2ND)
              </div>
              <div>
                <div className="w-10 h-10 rounded-2xl bg-slate-300 text-slate-800 flex items-center justify-center font-black text-lg shadow-xs mb-3">
                  <Medal className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    CATEGORY_COLORS[top3[1].contestant.category]?.badge
                  }`}
                >
                  {CATEGORY_LABELS[top3[1].contestant.category]} • Entry #{top3[1].contestant.entryNumber}
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mt-1">
                  {top3[1].contestant.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {top3[1].contestant.organizationSchool || top3[1].contestant.teamName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Final Score:</span>
                <span className="text-lg font-black text-slate-900">
                  {top3[1].averageScore.toFixed(2)} pts
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place / 2nd Runner Up */}
          {top3[2] && (
            <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-2xl p-5 border border-amber-200 shadow-xs relative overflow-hidden flex flex-col justify-between order-3 md:order-3">
              <div className="absolute top-0 right-0 bg-amber-200 text-amber-900 font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                2ND RUNNER UP (3RD)
              </div>
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-black text-lg shadow-xs mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    CATEGORY_COLORS[top3[2].contestant.category]?.badge
                  }`}
                >
                  {CATEGORY_LABELS[top3[2].contestant.category]} • Entry #{top3[2].contestant.entryNumber}
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mt-1">
                  {top3[2].contestant.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {top3[2].contestant.organizationSchool || top3[2].contestant.teamName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Final Score:</span>
                <span className="text-lg font-black text-slate-900">
                  {top3[2].averageScore.toFixed(2)} pts
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Master Tabulation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#001f3f] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Complete Official Standings & Scoresheet
            </h3>
          </div>
          <div className="text-xs text-slate-300">
            {results.length} Contestants Ranked • {assignedJudges.length} Judges Board
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="py-3.5 px-4 font-bold text-center w-16">Rank</th>
                <th className="py-3.5 px-4 font-bold">Contestant & Entry</th>
                <th className="py-3.5 px-3 font-bold">Category</th>
                {assignedJudges.map((judge, idx) => (
                  <th key={judge.id} className="py-3.5 px-3 font-bold text-center">
                    <div className="font-extrabold text-slate-900">Judge {idx + 1}</div>
                    <div className="text-[10px] text-slate-500 font-normal truncate max-w-[100px] mx-auto">
                      {judge.name}
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-4 font-bold text-right bg-slate-50 text-[#001f3f]">
                  Weighted Avg
                </th>
                <th className="py-3.5 px-3 font-bold text-center w-12">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {results.map((row) => {
                const isExpanded = expandedContestantId === row.contestant.id;
                const isTop1 = row.rank === 1 && row.averageScore > 0;
                const isTop2 = row.rank === 2 && row.averageScore > 0;
                const isTop3 = row.rank === 3 && row.averageScore > 0;

                return (
                  <React.Fragment key={row.contestant.id}>
                    <tr
                      className={`hover:bg-slate-50 transition ${
                        isTop1 ? 'bg-amber-50/40 font-semibold' : ''
                      }`}
                    >
                      {/* Rank Badge */}
                      <td className="py-3 px-4 text-center">
                        {isTop1 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs inline-flex items-center justify-center shadow-xs">
                            1st
                          </span>
                        ) : isTop2 ? (
                          <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs inline-flex items-center justify-center shadow-xs">
                            2nd
                          </span>
                        ) : isTop3 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-black text-xs inline-flex items-center justify-center shadow-xs">
                            3rd
                          </span>
                        ) : (
                          <span className="font-bold text-slate-700 text-sm">{row.rank}</span>
                        )}
                      </td>

                      {/* Contestant Name & Entry */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-[#001f3f] text-white text-xs font-black flex items-center justify-center shrink-0">
                            #{row.contestant.entryNumber}
                          </span>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-950 text-xs truncate">
                              {row.contestant.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {row.contestant.organizationSchool || row.contestant.teamName || 'Independent'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {CATEGORY_LABELS[row.contestant.category]}
                        </span>
                      </td>

                      {/* Judge Scores */}
                      {assignedJudges.map((judge) => {
                        const scoreVal = row.judgeWeightedScores[judge.id];
                        return (
                          <td key={judge.id} className="py-3 px-3 text-center font-mono text-xs">
                            {scoreVal !== null && scoreVal !== undefined ? (
                              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {scoreVal.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Final Weighted Average */}
                      <td className="py-3 px-4 text-right bg-slate-50">
                        <div className="font-black text-[#001f3f] text-sm font-mono">
                          {row.averageScore.toFixed(2)}%
                        </div>
                        {row.isTied && (
                          <span className="text-[9px] font-bold text-amber-700 uppercase block">Tied</span>
                        )}
                      </td>

                      {/* Details toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setExpandedContestantId(isExpanded ? null : row.contestant.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                          title="View detailed criteria breakdown"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Detailed Breakdown Sub-Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <td colSpan={5 + assignedJudges.length} className="p-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-[#001f3f]" />
                                Detailed Criteria Scoring Breakdown for #{row.contestant.entryNumber} -{' '}
                                {row.contestant.name}
                              </h5>
                              <span className="text-[11px] text-slate-500">
                                Total Criteria Configured: {event.criteria.length}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {assignedJudges.map((judge, jIdx) => {
                                const entry = row.judgeScores[judge.id];
                                return (
                                  <div
                                    key={judge.id}
                                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5"
                                  >
                                    <div className="font-bold text-slate-900 flex items-center justify-between">
                                      <span>Judge {jIdx + 1}: {judge.name}</span>
                                      <span className="font-mono text-[#001f3f] font-extrabold">
                                        {entry ? `${entry.totalWeightedScore.toFixed(2)} pts` : 'No score'}
                                      </span>
                                    </div>

                                    {entry ? (
                                      <div className="space-y-1 pt-1 border-t border-slate-200">
                                        {event.criteria.map((crit) => {
                                          const raw = entry.criterionScores[crit.id] ?? 0;
                                          const weighted = (raw * crit.weightPercentage) / 100;
                                          return (
                                            <div
                                              key={crit.id}
                                              className="flex items-center justify-between text-[11px] text-slate-600"
                                            >
                                              <span className="truncate max-w-[140px]">
                                                {crit.name} ({crit.weightPercentage}%)
                                              </span>
                                              <span className="font-mono font-medium text-slate-800">
                                                {raw} / 100 → {weighted.toFixed(2)}
                                              </span>
                                            </div>
                                          );
                                        })}
                                        {entry.remarks && (
                                          <div className="pt-1.5 text-[10px] text-slate-600 italic border-t border-slate-200">
                                            "{entry.remarks}"
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-[11px] text-slate-400 italic">Awaiting score submission.</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
