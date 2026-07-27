export type DayBucket = {
  /** ISO yyyy-mm-dd */
  date: string;
  label: string;
  minutes: number;
  sessions: number;
};

export type AnalyticsSummary = {
  hasData: boolean;
  totalSessions: number;
  todayMinutes: number;
  weekMinutes: number;
  last7Days: DayBucket[];
  averageSessionMinutes: number;
  completionRate: number;
  interruptedSessions: number;
  currentStreak: number;
  bestStreak: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  hourDistribution: { hour: number; minutes: number }[];
  heatmap: { date: string; level: number; minutes: number }[][];
  flowTrend: { weekLabel: string; score: number }[];
  flowScore: number;
  distractions: number;
};