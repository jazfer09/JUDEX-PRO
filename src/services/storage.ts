import { EventItem, User, Contestant, ScoreEntry, TabulationResult, CategoryLevel, Criterion } from '../types';

const STORAGE_KEYS = {
  USERS: 'judgepro_users_v1',
  EVENTS: 'judgepro_events_v1',
  CONTESTANTS: 'judgepro_contestants_v1',
  SCORES: 'judgepro_scores_v1',
  CURRENT_USER: 'judgepro_current_user_v1',
  SELECTED_EVENT: 'judgepro_selected_event_v1',
};

// Initial Seed Users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Dr. Alejandro Gomez',
    email: 'admin@tabulate.org',
    role: 'admin',
    title: 'Head Event Tabulator & Admin',
    departmentSchool: 'Office of Student Affairs & Competitions',
    passcode: 'admin123',
  },
  {
    id: 'usr_judge_1',
    name: 'Prof. Rafael Santos',
    email: 'judge1@tabulate.org',
    role: 'judge',
    title: 'Chairman, Board of Judges',
    departmentSchool: 'College of Music and Performing Arts',
    passcode: 'judge1',
  },
  {
    id: 'usr_judge_2',
    name: 'Dr. Elena Reyes',
    email: 'judge2@tabulate.org',
    role: 'judge',
    title: 'Judge 2 - Cultural Affairs Specialist',
    departmentSchool: 'National Commission for Culture & Arts',
    passcode: 'judge2',
  },
  {
    id: 'usr_judge_3',
    name: 'Ms. Maricar Dela Cruz',
    email: 'judge3@tabulate.org',
    role: 'judge',
    title: 'Judge 3 - Master Choreographer',
    departmentSchool: 'Dance Federation Philippines',
    passcode: 'judge3',
  },
  {
    id: 'usr_judge_4',
    name: 'Engr. Joshua Tan',
    email: 'judge4@tabulate.org',
    role: 'judge',
    title: 'Judge 4 - Technical & Creative Director',
    departmentSchool: 'Creative Studios Metro',
    passcode: 'judge4',
  },
  {
    id: 'usr_judge_5',
    name: 'Atty. Maria Clara Ramos',
    email: 'judge5@tabulate.org',
    role: 'judge',
    title: 'Judge 5 - Senior Adjudicator',
    departmentSchool: 'Performing Guild of Educators',
    passcode: 'judge5',
  },
];

// Initial Seed Events
export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt_cultural_dance_2026',
    title: 'Inter-School Performing Arts & Cultural Dance Showcase 2026',
    description: 'Grand annual multi-category cultural dance and theatrical performance competition.',
    date: '2026-09-15',
    time: '13:00 - 18:00',
    venue: 'University Grand Gymnasium & Cultural Center',
    status: 'ongoing',
    categories: ['elementary', 'junior_high', 'senior_high', 'college'],
    assignedJudgeIds: ['usr_judge_1', 'usr_judge_2', 'usr_judge_3', 'usr_judge_4', 'usr_judge_5'],
    scoringMethod: 'average',
    notes: 'Please evaluate choreography, synchronization, staging, and theme interpretation thoroughly.',
    createdAt: new Date().toISOString(),
    criteria: [
      {
        id: 'crit_1_teamwork',
        name: 'Teamwork & Synchronization',
        description: 'Unity, group coordination, rhythmic precision, and flawless timing among performers.',
        weightPercentage: 10,
        maxRawScore: 100,
      },
      {
        id: 'crit_2_creative',
        name: 'Creativity & Choreography',
        description: 'Originality of routine, creative formations, smooth transitions, and stylistic flair.',
        weightPercentage: 10,
        maxRawScore: 100,
      },
      {
        id: 'crit_3_organized',
        name: 'Organization & Mastery',
        description: 'Mastery of figures, structured flow, discipline, props execution, and spatial awareness.',
        weightPercentage: 20,
        maxRawScore: 100,
      },
      {
        id: 'crit_4_presentation',
        name: 'Overall Presentation & Stage Impact',
        description: 'Audience engagement, projection, theatrical expression, costume authenticity, and impact.',
        weightPercentage: 60,
        maxRawScore: 100,
      },
    ],
  },
  {
    id: 'evt_science_inno_2026',
    title: 'National InnoTech Science & Engineering Fair 2026',
    description: 'Showcasing groundbreaking research prototypes, robotics, and environmental technologies.',
    date: '2026-10-04',
    time: '09:00 - 16:30',
    venue: 'Innovation & Research Convention Hall',
    status: 'upcoming',
    categories: ['junior_high', 'senior_high', 'college'],
    assignedJudgeIds: ['usr_judge_1', 'usr_judge_2', 'usr_judge_4'],
    scoringMethod: 'average',
    notes: 'Focus on feasibility, real-world community impact, and rigorous scientific testing.',
    createdAt: new Date().toISOString(),
    criteria: [
      {
        id: 'crit_sci_1',
        name: 'Scientific Rigor & Methodology',
        description: 'Depth of research design, accurate data analysis, and controlled methodology.',
        weightPercentage: 30,
        maxRawScore: 100,
      },
      {
        id: 'crit_sci_2',
        name: 'Innovation & Originality',
        description: 'Novelty of approach, uniqueness of solution, and creative technological design.',
        weightPercentage: 30,
        maxRawScore: 100,
      },
      {
        id: 'crit_sci_3',
        name: 'Practicality & Community Impact',
        description: 'Feasibility, scalability, cost-efficiency, and social benefit.',
        weightPercentage: 20,
        maxRawScore: 100,
      },
      {
        id: 'crit_sci_4',
        name: 'Defense & Oral Presentation',
        description: 'Clarity in Q&A, poise, technical mastery, and display board quality.',
        weightPercentage: 20,
        maxRawScore: 100,
      },
    ],
  },
  {
    id: 'evt_speech_oratory_2026',
    title: 'Regional Oratorical & Extemporaneous Speech Cup',
    description: 'Youth public speaking tournament championing civic leadership and sustainable development.',
    date: '2026-11-12',
    time: '10:00 - 15:00',
    venue: 'Centennial Audio-Visual Theater',
    status: 'upcoming',
    categories: ['elementary', 'junior_high', 'senior_high', 'college'],
    assignedJudgeIds: ['usr_judge_1', 'usr_judge_2', 'usr_judge_3', 'usr_judge_5'],
    scoringMethod: 'average',
    createdAt: new Date().toISOString(),
    criteria: [
      {
        id: 'crit_sp_1',
        name: 'Content & Thought Substance',
        description: 'Logic, depth of argument, relevance to theme, and persuasive power.',
        weightPercentage: 40,
        maxRawScore: 100,
      },
      {
        id: 'crit_sp_2',
        name: 'Delivery, Vocal Diction & Clarity',
        description: 'Voice modulation, enunciation, pacing, inflection, and pronunciation.',
        weightPercentage: 30,
        maxRawScore: 100,
      },
      {
        id: 'crit_sp_3',
        name: 'Stage Presence & Poise',
        description: 'Confidence, posture, eye contact, and natural gestures.',
        weightPercentage: 20,
        maxRawScore: 100,
      },
      {
        id: 'crit_sp_4',
        name: 'Audience Impact & Rapport',
        description: 'Overall conviction and lasting inspiring impression.',
        weightPercentage: 10,
        maxRawScore: 100,
      },
    ],
  },
];

// Initial Contestants
export const INITIAL_CONTESTANTS: Contestant[] = [
  // Elementary
  {
    id: 'cnt_elem_1',
    eventId: 'evt_cultural_dance_2026',
    category: 'elementary',
    entryNumber: 1,
    name: 'Little Bayanihan Dancers',
    teamName: 'St. Jude Children Troupe',
    organizationSchool: 'St. Jude Elementary Academy',
    pieceTitle: 'Sayaw sa Bangko & Subli Tribute',
    bio: 'Champion dancers from Grade 5 and 6 celebrating traditional harvest folk dances.',
    status: 'active',
  },
  {
    id: 'cnt_elem_2',
    eventId: 'evt_cultural_dance_2026',
    category: 'elementary',
    entryNumber: 2,
    name: 'San Lorenzo Cultural Ensemble',
    teamName: 'Young Heritage Group',
    organizationSchool: 'San Lorenzo Central Elementary School',
    pieceTitle: 'Maglalatik & Pandanggo sa Ilaw',
    bio: 'Energetic young performers showcasing rhythmic coconut shell beats and balance.',
    status: 'active',
  },
  {
    id: 'cnt_elem_3',
    eventId: 'evt_cultural_dance_2026',
    category: 'elementary',
    entryNumber: 3,
    name: 'Mabini Youth Performers',
    teamName: 'Grade 6 Folk Guild',
    organizationSchool: 'Apolinario Mabini Integrated School',
    pieceTitle: 'Tinikling Bamboo Suite',
    bio: 'Fast-paced bamboo rhythmic traditional dance with colorful woven attire.',
    status: 'active',
  },

  // Junior High School
  {
    id: 'cnt_jhs_1',
    eventId: 'evt_cultural_dance_2026',
    category: 'junior_high',
    entryNumber: 1,
    name: 'Sinag Tala Dance Troupe',
    teamName: 'JHS Division A',
    organizationSchool: 'Rizal National Science High School',
    pieceTitle: 'Singkil: Legend of Princess Gandingan',
    bio: 'Elaborate Maranao royal court bamboo dance with fan and umbrella sequences.',
    status: 'active',
  },
  {
    id: 'cnt_jhs_2',
    eventId: 'evt_cultural_dance_2026',
    category: 'junior_high',
    entryNumber: 2,
    name: 'La Salle JHS Cultural Guild',
    teamName: 'Green Archers Folkorico',
    organizationSchool: 'De La Salle Junior High School',
    pieceTitle: 'Kapa Malong-Malong & Cordillera Suite',
    bio: 'Showcasing the versatile tubular garment and northern mountain festive rituals.',
    status: 'active',
  },
  {
    id: 'cnt_jhs_3',
    eventId: 'evt_cultural_dance_2026',
    category: 'junior_high',
    entryNumber: 3,
    name: 'Fortuna Youth Artists',
    teamName: 'Grade 9-10 Performing Arts',
    organizationSchool: 'Fortuna Comprehensive High',
    pieceTitle: 'Carinosa & Jota Caviteña',
    bio: 'Spanish-influenced romantic courting dance with fans and castanets.',
    status: 'active',
  },

  // Senior High School
  {
    id: 'cnt_shs_1',
    eventId: 'evt_cultural_dance_2026',
    category: 'senior_high',
    entryNumber: 1,
    name: 'Padayon Cultural Theater',
    teamName: 'Arts & Design Track Ensemble',
    organizationSchool: 'Manila Science Senior High School',
    pieceTitle: 'Vinta & Pangalay Sea Suite',
    bio: 'Sulu archipelago fingernail dance mimicking the gentle waves of the sea.',
    status: 'active',
  },
  {
    id: 'cnt_shs_2',
    eventId: 'evt_cultural_dance_2026',
    category: 'senior_high',
    entryNumber: 2,
    name: 'Hiraya Dance Guild',
    teamName: 'SHS Performing Arts Crew',
    organizationSchool: 'St. Scholastica Senior Academy',
    pieceTitle: 'Banga: Cordillera Pot Balancing Ritual',
    bio: 'Exquisite balance and stamina showcasing up to seven earthen clay pots stacked.',
    status: 'active',
  },
  {
    id: 'cnt_shs_3',
    eventId: 'evt_cultural_dance_2026',
    category: 'senior_high',
    entryNumber: 3,
    name: 'Bulacan Pioneer Artists',
    teamName: 'Bulacan SHS Cultural Unit',
    organizationSchool: 'Bulacan National High School SHS',
    pieceTitle: 'Dugso: Bukidnon Thanksgiving Prayer Dance',
    bio: 'Solemn ritual dance with bell anklets driving rhythm on wooden platforms.',
    status: 'active',
  },

  // College
  {
    id: 'cnt_col_1',
    eventId: 'evt_cultural_dance_2026',
    category: 'college',
    entryNumber: 1,
    name: 'Silakbo Performing Arts Company',
    teamName: 'Varsity Folkloric Company',
    organizationSchool: 'State University of the Philippines',
    pieceTitle: 'Higaonon & T\'boli Lumad Epic Suite',
    bio: 'Award-winning collegiate performers depicting the legendary epic of Lemlunay.',
    status: 'active',
  },
  {
    id: 'cnt_col_2',
    eventId: 'evt_cultural_dance_2026',
    category: 'college',
    entryNumber: 2,
    name: 'Teatro Filipinas Guild',
    teamName: 'College of Arts & Letters',
    organizationSchool: 'University of Santo Tomas',
    pieceTitle: 'Moriones & Subli Festive Fusion',
    bio: 'Visually gripping masks, shields, and high-tempo percussion arrangements.',
    status: 'active',
  },
  {
    id: 'cnt_col_3',
    eventId: 'evt_cultural_dance_2026',
    category: 'college',
    entryNumber: 3,
    name: 'Maharlika Dance Troupe',
    teamName: 'Institute of Human Kinetics',
    organizationSchool: 'Polytechnic University of the Philippines',
    pieceTitle: 'Idaw & Ragragsakan Mountain Festivity',
    bio: 'Hunting omen dance followed by energetic victory festival with woven baskets.',
    status: 'active',
  },
];

// Helper to calculate total weighted score for a set of raw scores given criteria
export function calculateWeightedTotal(
  rawScores: Record<string, number>,
  criteria: Criterion[]
): number {
  let total = 0;
  for (const crit of criteria) {
    const raw = rawScores[crit.id] ?? 0;
    const weighted = (raw * crit.weightPercentage) / 100;
    total += weighted;
  }
  return Math.round(total * 100) / 100;
}

// Initial Pre-computed Scores for instant live leaderboard experience
export const INITIAL_SCORES: ScoreEntry[] = [
  // Elementary #1 (Little Bayanihan) scored by Judge 1
  {
    id: 'scr_1',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_elem_1',
    judgeId: 'usr_judge_1',
    judgeName: 'Prof. Rafael Santos',
    criterionScores: {
      crit_1_teamwork: 92, // 10% -> 9.20
      crit_2_creative: 88, // 10% -> 8.80
      crit_3_organized: 94, // 20% -> 18.80
      crit_4_presentation: 91, // 60% -> 54.60
    },
    totalWeightedScore: 91.4,
    remarks: 'Splendid synchronization and delightful facial expressions from the kids!',
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    isLocked: true,
  },
  // Elementary #1 scored by Judge 2
  {
    id: 'scr_2',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_elem_1',
    judgeId: 'usr_judge_2',
    judgeName: 'Dr. Elena Reyes',
    criterionScores: {
      crit_1_teamwork: 90,
      crit_2_creative: 92,
      crit_3_organized: 90,
      crit_4_presentation: 93,
    },
    totalWeightedScore: 92.0,
    remarks: 'Authentic costumes and very clean transitions across all figures.',
    submittedAt: new Date(Date.now() - 3500000).toISOString(),
    isLocked: true,
  },
  // Elementary #1 scored by Judge 3
  {
    id: 'scr_3',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_elem_1',
    judgeId: 'usr_judge_3',
    judgeName: 'Ms. Maricar Dela Cruz',
    criterionScores: {
      crit_1_teamwork: 94,
      crit_2_creative: 90,
      crit_3_organized: 92,
      crit_4_presentation: 90,
    },
    totalWeightedScore: 90.8,
    remarks: 'Great footwork on the benches. Very well rehearsed.',
    submittedAt: new Date(Date.now() - 3400000).toISOString(),
    isLocked: true,
  },

  // Elementary #2 (San Lorenzo) scored by Judge 1, 2, 3
  {
    id: 'scr_4',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_elem_2',
    judgeId: 'usr_judge_1',
    judgeName: 'Prof. Rafael Santos',
    criterionScores: {
      crit_1_teamwork: 95,
      crit_2_creative: 94,
      crit_3_organized: 96,
      crit_4_presentation: 95,
    },
    totalWeightedScore: 95.1,
    remarks: 'The coconut rhythmic clicking had zero slips. Magnificent rhythm control!',
    submittedAt: new Date(Date.now() - 3000000).toISOString(),
    isLocked: true,
  },
  {
    id: 'scr_5',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_elem_2',
    judgeId: 'usr_judge_2',
    judgeName: 'Dr. Elena Reyes',
    criterionScores: {
      crit_1_teamwork: 93,
      crit_2_creative: 95,
      crit_3_organized: 94,
      crit_4_presentation: 96,
    },
    totalWeightedScore: 95.2,
    remarks: 'Stunning lighting and stage presence. Top-tier elementary performance.',
    submittedAt: new Date(Date.now() - 2900000).toISOString(),
    isLocked: true,
  },
  {
    id: 'scr_6',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_elem_2',
    judgeId: 'usr_judge_3',
    judgeName: 'Ms. Maricar Dela Cruz',
    criterionScores: {
      crit_1_teamwork: 96,
      crit_2_creative: 92,
      crit_3_organized: 95,
      crit_4_presentation: 94,
    },
    totalWeightedScore: 94.2,
    remarks: 'Very high energy and impressive discipline.',
    submittedAt: new Date(Date.now() - 2800000).toISOString(),
    isLocked: true,
  },

  // College #1 (Silakbo Performing Arts)
  {
    id: 'scr_col_1',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_col_1',
    judgeId: 'usr_judge_1',
    judgeName: 'Prof. Rafael Santos',
    criterionScores: {
      crit_1_teamwork: 98,
      crit_2_creative: 97,
      crit_3_organized: 98,
      crit_4_presentation: 99,
    },
    totalWeightedScore: 98.5,
    remarks: 'Breathtaking collegiate masterclass. Emotional and technically world-class.',
    submittedAt: new Date(Date.now() - 2000000).toISOString(),
    isLocked: true,
  },
  {
    id: 'scr_col_2',
    eventId: 'evt_cultural_dance_2026',
    contestantId: 'cnt_col_1',
    judgeId: 'usr_judge_2',
    judgeName: 'Dr. Elena Reyes',
    criterionScores: {
      crit_1_teamwork: 97,
      crit_2_creative: 99,
      crit_3_organized: 96,
      crit_4_presentation: 98,
    },
    totalWeightedScore: 97.6,
    remarks: 'Epic cultural narrative with powerful staging.',
    submittedAt: new Date(Date.now() - 1900000).toISOString(),
    isLocked: true,
  },
];

export class StorageService {
  // Get Users
  static getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      this.saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  static updateUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
  }

  static deleteUser(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.saveUsers(users);
  }

  // Current User Session
  static getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to Admin
      const defaultUser = this.getUsers()[0] || INITIAL_USERS[0];
      this.setCurrentUser(defaultUser);
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS[0];
    }
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  // Events
  static getEvents(): EventItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      this.saveEvents(INITIAL_EVENTS);
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  }

  static saveEvents(events: EventItem[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  static getEventById(id: string): EventItem | undefined {
    return this.getEvents().find((e) => e.id === id);
  }

  static saveEvent(event: EventItem): void {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx !== -1) {
      events[idx] = event;
    } else {
      events.unshift(event);
    }
    this.saveEvents(events);
  }

  static deleteEvent(eventId: string): void {
    const events = this.getEvents().filter((e) => e.id !== eventId);
    this.saveEvents(events);
    // clean up associated contestants and scores
    const contestants = this.getContestants().filter((c) => c.eventId !== eventId);
    this.saveContestants(contestants);
    const scores = this.getScores().filter((s) => s.eventId !== eventId);
    this.saveScores(scores);
  }

  // Contestants
  static getContestants(): Contestant[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTESTANTS);
    if (!raw) {
      this.saveContestants(INITIAL_CONTESTANTS);
      return INITIAL_CONTESTANTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONTESTANTS;
    }
  }

  static saveContestants(contestants: Contestant[]): void {
    localStorage.setItem(STORAGE_KEYS.CONTESTANTS, JSON.stringify(contestants));
  }

  static getContestantsByEvent(eventId: string, category?: CategoryLevel | 'all'): Contestant[] {
    const list = this.getContestants().filter((c) => c.eventId === eventId);
    if (category && category !== 'all') {
      return list.filter((c) => c.category === category);
    }
    return list;
  }

  static saveContestant(contestant: Contestant): void {
    const contestants = this.getContestants();
    const idx = contestants.findIndex((c) => c.id === contestant.id);
    if (idx !== -1) {
      contestants[idx] = contestant;
    } else {
      contestants.push(contestant);
    }
    this.saveContestants(contestants);
  }

  static deleteContestant(contestantId: string): void {
    const contestants = this.getContestants().filter((c) => c.id !== contestantId);
    this.saveContestants(contestants);
    const scores = this.getScores().filter((s) => s.contestantId !== contestantId);
    this.saveScores(scores);
  }

  // Scores
  static getScores(): ScoreEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    if (!raw) {
      this.saveScores(INITIAL_SCORES);
      return INITIAL_SCORES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SCORES;
    }
  }

  static saveScores(scores: ScoreEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }

  static submitScore(score: ScoreEntry): void {
    const scores = this.getScores();
    const idx = scores.findIndex(
      (s) => s.eventId === score.eventId && s.contestantId === score.contestantId && s.judgeId === score.judgeId
    );
    if (idx !== -1) {
      scores[idx] = score;
    } else {
      scores.push(score);
    }
    this.saveScores(scores);
  }

  static getScoreForJudgeAndContestant(
    eventId: string,
    contestantId: string,
    judgeId: string
  ): ScoreEntry | undefined {
    return this.getScores().find(
      (s) => s.eventId === eventId && s.contestantId === contestantId && s.judgeId === judgeId
    );
  }

  // Master Tabulation Engine & Ranking Computer
  static computeTabulation(
    eventId: string,
    categoryFilter?: CategoryLevel | 'all'
  ): {
    event: EventItem | undefined;
    results: TabulationResult[];
    assignedJudges: User[];
    allCriteria: Criterion[];
    totalContestantsCount: number;
    completionPercentage: number;
  } {
    const event = this.getEventById(eventId);
    if (!event) {
      return {
        event: undefined,
        results: [],
        assignedJudges: [],
        allCriteria: [],
        totalContestantsCount: 0,
        completionPercentage: 0,
      };
    }

    const allJudges = this.getUsers().filter((u) => u.role === 'judge');
    const assignedJudges = allJudges.filter((j) => event.assignedJudgeIds.includes(j.id));
    const contestants = this.getContestantsByEvent(eventId, categoryFilter);
    const allScores = this.getScores().filter((s) => s.eventId === eventId);

    const totalPossibleSubmissions = contestants.length * (assignedJudges.length || 1);
    let totalActualSubmissions = 0;

    const rawResults = contestants.map((contestant) => {
      const judgeScores: Record<string, ScoreEntry | undefined> = {};
      const judgeWeightedScores: Record<string, number | null> = {};
      const numericScoresList: number[] = [];

      for (const judge of assignedJudges) {
        const score = allScores.find(
          (s) => s.contestantId === contestant.id && s.judgeId === judge.id
        );
        judgeScores[judge.id] = score;
        if (score) {
          judgeWeightedScores[judge.id] = score.totalWeightedScore;
          numericScoresList.push(score.totalWeightedScore);
          totalActualSubmissions++;
        } else {
          judgeWeightedScores[judge.id] = null;
        }
      }

      let averageScore = 0;
      let totalScore = 0;

      if (numericScoresList.length > 0) {
        totalScore = numericScoresList.reduce((acc, curr) => acc + curr, 0);

        if (event.scoringMethod === 'olympic_average' && numericScoresList.length >= 4) {
          // Olympic: trim min and max
          const sorted = [...numericScoresList].sort((a, b) => a - b);
          const trimmed = sorted.slice(1, -1);
          averageScore = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
        } else {
          averageScore = totalScore / numericScoresList.length;
        }
      }

      const scoringComplete = assignedJudges.length > 0 && numericScoresList.length === assignedJudges.length;

      return {
        contestant,
        judgeScores,
        judgeWeightedScores,
        averageScore: Math.round(averageScore * 100) / 100,
        totalScore: Math.round(totalScore * 100) / 100,
        rank: 1,
        isTied: false,
        scoringComplete,
        judgesCount: assignedJudges.length,
        submittedJudgesCount: numericScoresList.length,
      };
    });

    // Compute ranks with standard competition ranking (1224)
    rawResults.sort((a, b) => b.averageScore - a.averageScore || a.contestant.entryNumber - b.contestant.entryNumber);

    for (let i = 0; i < rawResults.length; i++) {
      if (i === 0) {
        rawResults[i].rank = 1;
      } else {
        const prev = rawResults[i - 1];
        if (Math.abs(rawResults[i].averageScore - prev.averageScore) < 0.001) {
          rawResults[i].rank = prev.rank;
          rawResults[i].isTied = true;
          prev.isTied = true;
        } else {
          rawResults[i].rank = i + 1;
        }
      }
    }

    const completionPercentage = totalPossibleSubmissions > 0
      ? Math.round((totalActualSubmissions / totalPossibleSubmissions) * 100)
      : 0;

    return {
      event,
      results: rawResults,
      assignedJudges,
      allCriteria: event.criteria,
      totalContestantsCount: contestants.length,
      completionPercentage,
    };
  }

  // Reset to Factory Default
  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.CONTESTANTS);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_EVENT);
  }
}
