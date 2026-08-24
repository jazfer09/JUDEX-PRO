import React from 'react';
import { EventItem, CategoryLevel, TabulationResult, User } from '../types';
import { CATEGORY_LABELS } from '../utils/formatters';
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface PrintTallySheetProps {
  event: EventItem;
  categoryFilter: CategoryLevel | 'all';
  results: TabulationResult[];
  assignedJudges: User[];
  onClose: () => void;
}

export const PrintTallySheet: React.FC<PrintTallySheetProps> = ({
  event,
  categoryFilter,
  results,
  assignedJudges,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6">
      {/* Control Bar (Hidden during actual print) */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-300 shadow-sm print:hidden">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to System
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Print view optimized for standard letter / A4 documentation
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#001f3f] hover:bg-[#002d5c] text-white font-extrabold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Official Paper Document */}
      <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-300 print:shadow-none print:border-none print:p-0 text-slate-950 font-serif">
        {/* Formal Institutional Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Award className="w-7 h-7 text-slate-900" />
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider font-sans text-slate-900">
              BOARD OF JUDGES & TABULATION COMMITTEE
            </h1>
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 font-sans">
            OFFICIAL CONSOLIDATED RESULTS & TALLY SHEET
          </h2>
          <p className="text-[11px] text-slate-500 font-sans mt-1">
            Document Certified by the Secretariat • Generated on {currentDate}
          </p>
        </div>

        {/* Competition Event Meta Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-sans mb-6">
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Event Title:</span>
            <span className="font-extrabold text-slate-900">{event.title}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Category Level:</span>
            <span className="font-extrabold text-[#001f3f]">
              {categoryFilter === 'all' ? 'All Registered Levels' : CATEGORY_LABELS[categoryFilter]}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Venue & Schedule:</span>
            <span className="font-semibold text-slate-800">{event.venue} ({event.date})</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Tabulation Method:</span>
            <span className="font-semibold text-slate-800">
              {event.scoringMethod === 'average' ? 'Standard Arithmetic Average' : 'Olympic Trimmed Average'}
            </span>
          </div>
        </div>

        {/* Criteria & Weighting Reference */}
        <div className="mb-6 font-sans">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#001f3f]" />
            Official Adopted Criteria & Weighting:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {event.criteria.map((c) => (
              <div key={c.id} className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-[11px] text-[#001f3f] font-semibold font-mono">Weight: {c.weightPercentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Tally Table */}
        <div className="overflow-x-auto mb-8 font-sans">
          <table className="w-full text-left text-xs border border-slate-900 border-collapse">
            <thead>
              <tr className="bg-[#001f3f] text-white">
                <th className="py-2.5 px-3 font-bold text-center border border-slate-800 w-12">Rank</th>
                <th className="py-2.5 px-2 font-bold text-center border border-slate-800 w-12">No.</th>
                <th className="py-2.5 px-3 font-bold border border-slate-800">Contestant / Performer</th>
                <th className="py-2.5 px-2 font-bold border border-slate-800">Level</th>
                {assignedJudges.map((j, i) => (
                  <th key={j.id} className="py-2.5 px-2 font-bold text-center border border-slate-800">
                    <div>J{i + 1}</div>
                    <div className="text-[9px] font-normal opacity-80 truncate max-w-[80px]">{j.name}</div>
                  </th>
                ))}
                <th className="py-2.5 px-3 font-bold text-right border border-slate-800 bg-[#002d5c]">
                  Final %
                </th>
                <th className="py-2.5 px-3 font-bold border border-slate-800 text-center">Award / Title</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => {
                const isFirst = row.rank === 1 && row.averageScore > 0;
                const isSecond = row.rank === 2 && row.averageScore > 0;
                const isThird = row.rank === 3 && row.averageScore > 0;

                return (
                  <tr
                    key={row.contestant.id}
                    className={`border-b border-slate-300 ${
                      isFirst ? 'bg-amber-50 font-semibold' : idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-2 px-3 text-center font-bold border border-slate-300">
                      {row.rank}
                    </td>
                    <td className="py-2 px-2 text-center font-bold border border-slate-300">
                      #{row.contestant.entryNumber}
                    </td>
                    <td className="py-2 px-3 border border-slate-300">
                      <div className="font-bold text-slate-950">{row.contestant.name}</div>
                      <div className="text-[10px] text-slate-600">
                        {row.contestant.organizationSchool || row.contestant.teamName || 'Independent'}
                      </div>
                    </td>
                    <td className="py-2 px-2 border border-slate-300 text-[10px] font-semibold">
                      {CATEGORY_LABELS[row.contestant.category]}
                    </td>
                    {assignedJudges.map((j) => {
                      const scoreVal = row.judgeWeightedScores[j.id];
                      return (
                        <td key={j.id} className="py-2 px-2 text-center font-mono border border-slate-300">
                          {scoreVal !== null && scoreVal !== undefined ? scoreVal.toFixed(2) : '-'}
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 text-right font-black font-mono border border-slate-300 bg-slate-100">
                      {row.averageScore.toFixed(2)}%
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-[10px] border border-slate-300">
                      {isFirst ? (
                        <span className="text-amber-900 uppercase">CHAMPION</span>
                      ) : isSecond ? (
                        <span className="text-slate-800 uppercase">1st Runner Up</span>
                      ) : isThird ? (
                        <span className="text-amber-800 uppercase">2nd Runner Up</span>
                      ) : (
                        <span className="text-slate-500">Finalist</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Signatures Block */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 font-sans">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-8 text-center">
            CERTIFICATION OF TABULATION RESULTS & BOARD OF JUDGES CONCURRENCE
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6 text-center text-xs">
            {assignedJudges.map((judge, idx) => (
              <div key={judge.id} className="flex flex-col items-center">
                <div className="w-48 border-b border-slate-900 mb-1.5" />
                <div className="font-bold text-slate-950 uppercase">{judge.name}</div>
                <div className="text-[10px] text-slate-600">
                  {judge.title || `Judge ${idx + 1}`}
                </div>
              </div>
            ))}

            <div className="flex flex-col items-center col-span-2 sm:col-span-1">
              <div className="w-48 border-b border-slate-900 mb-1.5" />
              <div className="font-bold text-slate-950 uppercase">Dr. Alejandro Gomez</div>
              <div className="text-[10px] text-slate-600">Head Tabulator & Event Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
