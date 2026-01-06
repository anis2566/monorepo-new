// types/leaderboard.ts
// Type definitions for leaderboard system

export interface LeaderboardEntry {
  id: string;
  rank: number;
  studentId: string;
  studentName: string;
  imageUrl: string | null;
  className: string;
  batch: string | null;
  totalScore: number;
  totalExams: number;
  averagePercentage: number;
  bestStreak: number;
  totalXp: number;
  correctAnswers: number;
}

export interface UserRankEntry extends LeaderboardEntry {
  previousRank?: number;
}

export type LeaderboardType = "overall" | "weekly" | "monthly" | "streak";

export interface LeaderboardFilters {
  classNameId?: string;
  batchId?: string;
  limit?: number;
}
