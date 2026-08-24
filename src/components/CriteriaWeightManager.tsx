import React from 'react';
import { Criterion } from '../types';
import { Plus, Trash2, AlertTriangle, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

interface CriteriaWeightManagerProps {
  criteria: Criterion[];
  onChange: (criteria: Criterion[]) => void;
  disabled?: boolean;
}

export const CriteriaWeightManager: React.FC<CriteriaWeightManagerProps> = ({
  criteria,
  onChange,
  disabled = false,
}) => {
  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weightPercentage) || 0), 0);
  const isValid = Math.abs(totalWeight - 100) < 0.01;

  const handleUpdateCriterion = (index: number, field: keyof Criterion, value: any) => {
    const updated = [...criteria];
    updated[index] = {
      ...updated[index],
      [field]: field === 'weightPercentage' || field === 'maxRawScore' ? Number(value) || 0 : value,
    };
    onChange(updated);
  };

  const handleAddCriterion = () => {
    const remaining = Math.max(0, 100 - totalWeight);
    const newCrit: Criterion = {
      id: `crit_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: 'New Criterion',
      description: 'Describe what the judges should observe for this criterion.',
      weightPercentage: remaining > 0 ? remaining : 10,
      maxRawScore: 100,
    };
    onChange([...criteria, newCrit]);
  };

  const handleRemoveCriterion = (index: number) => {
    if (criteria.length <= 1) return;
    const updated = criteria.filter((_, i) => i !== index);
    onChange(updated);
  };

  const applyPreset = (presetType: 'cultural' | 'equal4' | 'talent' | 'academic') => {
    if (presetType === 'cultural') {
      // User's exact prompt example: Teamwork 10%, Creativity 10%, Organized 20%, Presentation 60%
      onChange([
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
    } else if (presetType === 'equal4') {
      onChange([
        {
          id: `crit_${Date.now()}_1`,
          name: 'Technical Execution & Mastery',
          description: 'Precision, accuracy, and technical difficulty.',
          weightPercentage: 25,
          maxRawScore: 100,
        },
        {
          id: `crit_${Date.now()}_2`,
          name: 'Artistry & Musicality',
          description: 'Expression, rhythm, and dynamic interpretation.',
          weightPercentage: 25,
          maxRawScore: 100,
        },
        {
          id: `crit_${Date.now()}_3`,
          name: 'Originality & Style',
          description: 'Creative uniqueness and personal distinctiveness.',
          weightPercentage: 25,
          maxRawScore: 100,
        },
        {
          id: `crit_${Date.now()}_4`,
          name: 'Stage Presence & Poise',
          description: 'Confidence, charisma, and audience connection.',
          weightPercentage: 25,
          maxRawScore: 100,
        },
      ]);
    } else if (presetType === 'academic') {
      onChange([
        {
          id: `crit_${Date.now()}_1`,
          name: 'Content & Substance',
          description: 'Depth of argument, factual accuracy, and logic.',
          weightPercentage: 40,
          maxRawScore: 100,
        },
        {
          id: `crit_${Date.now()}_2`,
          name: 'Delivery & Diction',
          description: 'Clarity, vocal modulation, and enunciation.',
          weightPercentage: 30,
          maxRawScore: 100,
        },
        {
          id: `crit_${Date.now()}_3`,
          name: 'Poise & Confidence',
          description: 'Physical demeanor and command of the podium.',
          weightPercentage: 20,
          maxRawScore: 100,
        },
        {
          id: `crit_${Date.now()}_4`,
          name: 'Overall Impact',
          description: 'Persuasiveness and total audience impression.',
          weightPercentage: 10,
          maxRawScore: 100,
        },
      ]);
    }
  };

  return (
    <div id="criteria-weight-manager" className="space-y-4">
      {/* Header with Total Weight Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#001f3f] text-white p-5 rounded-2xl shadow-sm border border-[#002d5c]">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-300" />
            <h4 className="font-bold text-base text-white">Criteria & Percentage Weighting System</h4>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Admin can configure and adjust the percentage weights for this event. Total must equal 100%.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#002d5c] px-4 py-2 rounded-xl border border-[#003a7a]">
          <div className="text-right">
            <span className="text-xs text-slate-300 block font-medium">Total Allocation</span>
            <span
              className={`text-lg font-black ${
                isValid ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              {totalWeight}%
            </span>
          </div>
          {isValid ? (
            <div className="flex items-center gap-1 text-emerald-300 text-xs font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-300 text-xs font-bold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <span>{totalWeight < 100 ? `Needs +${100 - totalWeight}%` : `Over by ${totalWeight - 100}%`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar of Weight Distribution */}
      <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
        <div className="text-xs font-semibold text-slate-600 mb-1.5 flex justify-between">
          <span>Visual Weight Breakdown</span>
          <span className="font-bold text-[#001f3f]">{criteria.length} Criteria Defined</span>
        </div>
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex w-full">
          {criteria.map((crit, idx) => {
            const colors = [
              'bg-[#001f3f]',
              'bg-sky-600',
              'bg-indigo-700',
              'bg-teal-700',
              'bg-amber-600',
              'bg-rose-600',
            ];
            const color = colors[idx % colors.length];
            const width = Math.max(0, Math.min(100, crit.weightPercentage));
            return (
              <div
                key={crit.id}
                style={{ width: `${width}%` }}
                className={`${color} text-[10px] font-bold text-white flex items-center justify-center transition-all duration-300 truncate px-1`}
                title={`${crit.name}: ${crit.weightPercentage}%`}
              >
                {width >= 8 ? `${crit.weightPercentage}%` : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Presets Bar */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#001f3f]" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('cultural')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#001f3f] font-bold border border-[#001f3f]/30 rounded-lg transition shadow-xs cursor-pointer"
          >
            Teamwork 10% • Creative 10% • Org 20% • Presentation 60%
          </button>
          <button
            type="button"
            onClick={() => applyPreset('equal4')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 rounded-lg transition shadow-xs cursor-pointer"
          >
            Equal 4-Way (25% each)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('academic')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 rounded-lg transition shadow-xs cursor-pointer"
          >
            Academic / Speech (40% • 30% • 20% • 10%)
          </button>
        </div>
      )}

      {/* List of Criteria Inputs */}
      <div className="space-y-3">
        {criteria.map((crit, index) => (
          <div
            key={crit.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              {/* Criterion Name & Description */}
              <div className="md:col-span-7 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#001f3f] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    disabled={disabled}
                    value={crit.name}
                    onChange={(e) => handleUpdateCriterion(index, 'name', e.target.value)}
                    placeholder="Criterion Name (e.g. Teamwork, Presentation)"
                    className="w-full font-bold text-slate-900 text-sm px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f]"
                  />
                </div>
                <textarea
                  disabled={disabled}
                  value={crit.description}
                  onChange={(e) => handleUpdateCriterion(index, 'description', e.target.value)}
                  placeholder="Judging guidelines / description of what to assess..."
                  rows={2}
                  className="w-full text-xs text-slate-700 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#001f3f] focus:outline-none focus:ring-1 focus:ring-[#001f3f] resize-none ml-8"
                  style={{ width: 'calc(100% - 2rem)' }}
                />
              </div>

              {/* Weight % Input */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <label className="block text-[11px] font-bold text-[#001f3f] mb-1">
                  Weight Percentage (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    disabled={disabled}
                    value={crit.weightPercentage}
                    onChange={(e) => handleUpdateCriterion(index, 'weightPercentage', e.target.value)}
                    className="w-20 font-black text-[#001f3f] text-base px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                  />
                  <span className="font-bold text-[#001f3f] text-sm">%</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Max score: 100 pts raw
                </p>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 flex items-center justify-end gap-1 pt-2">
                {!disabled && criteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCriterion(index)}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer"
                    title="Remove Criterion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Criterion Button */}
      {!disabled && (
        <button
          type="button"
          onClick={handleAddCriterion}
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#001f3f] text-slate-600 hover:text-[#001f3f] font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition bg-white hover:bg-slate-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Another Criterion
        </button>
      )}

      {!isValid && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Important Weight Validation:</span> Total percentage is currently{' '}
            <span className="font-bold underline">{totalWeight}%</span>. Please adjust the percentages so they sum
            exactly to <span className="font-bold">100%</span> before finalizing event scores.
          </div>
        </div>
      )}
    </div>
  );
};
