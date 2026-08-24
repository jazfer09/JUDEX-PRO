export type CategoryLevel = 
  | 'elementary'
  | 'junior_high'
  | 'senior_high'
  | 'college'
  | 'open';

export type UserRole = 'admin' | 'judge';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title?: string; // e.g. "Chairman of the Board of Judges", "Head Tabulator"
  passcode?: string;
  assignedEventIds?: string[];
  departmentSchool?: string;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weightPercentage: number; // e.g. 10, 20, 60 (sum must be 100)
  maxRawScore: number; // usually 100
}

export interface Contestant {
  id: string;
  eventId: string;
  category: CategoryLevel;
  entryNumber: number;
  name: string;
  teamName?: string;
  organizationSchool?: string;
  photoUrl?: string;
  bio?: string;
  pieceTitle?: string; // Title of presentation, song, or project
  status: 'active' | 'disqualified';
}

export interface ScoreEntry {
  id: string;
  eventId: string;
  contestantId: string;
  judgeId: string;
  judgeName?: string;
  criterionScores: Record<string, number>; // criterionId -> raw score (0-100)
  totalWeightedScore: number; // (sum of rawScore * weight / 100)
  remarks?: string;
  submittedAt: string;
  isLocked: boolean;
}

export type ScoringMethod = 'average' | 'sum' | 'olympic_average';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'scoring_locked';
  categories: CategoryLevel[];
  criteria: Criterion[];
  maxJudges?: number;
  assignedJudgeIds: string[];
  scoringMethod: ScoringMethod;
  notes?: string;
  createdAt: string;
}

export interface TabulationResult {
  contestant: Contestant;
  judgeScores: Record<string, ScoreEntry | undefined>;
  judgeWeightedScores: Record<string, number | null>;
  averageScore: number;
  totalScore: number;
  rank: number;
  isTied: boolean;
  scoringComplete: boolean;
  judgesCount: number;
  submittedJudgesCount: number;
}
