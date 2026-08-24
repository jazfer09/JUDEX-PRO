import { CategoryLevel } from '../types';

export const CATEGORY_LABELS: Record<CategoryLevel, string> = {
  elementary: 'Elementary',
  junior_high: 'Junior High School',
  senior_high: 'Senior High School',
  college: 'College',
  open: 'Open Category',
};

export const CATEGORY_SHORT_LABELS: Record<CategoryLevel, string> = {
  elementary: 'Elem',
  junior_high: 'JHS',
  senior_high: 'SHS',
  college: 'College',
  open: 'Open',
};

export const CATEGORY_COLORS: Record<CategoryLevel, { bg: string; text: string; border: string; badge: string }> = {
  elementary: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  junior_high: {
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-900 border-sky-300',
  },
  senior_high: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  college: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  open: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-900 border-slate-300',
  },
};

export function formatDateTime(dateStr: string, timeStr?: string): string {
  try {
    const d = new Date(dateStr);
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return timeStr ? `${formattedDate} • ${timeStr}` : formattedDate;
  } catch {
    return dateStr;
  }
}
