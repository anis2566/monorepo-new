// types/result.ts
// Clean type definitions matching the TRPC getResult endpoint and Prisma schema

export interface MCQData {
  id: string;
  question: string;
  options: Record<string, string> | string[]; // Can be either format
  answer: string; // The correct option letter
  explanation: string | null;
  subject: string;
  chapter: string;
  type: string;
  isMath: boolean;
  context: string | null;
  statements: Record<string, string> | string[] | null; // Can be either format
  timeSpent: number | null;
}

export interface ReviewQuestion {
  id: string;
  questionNumber: number;
  mcq: MCQData;
  selectedOption: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number | null;
}

export interface AttemptDetails {
  id: string;
  examId: string;
  examTitle: string;
  status: string;
  submissionType: string | null;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  timeTakenMinutes: number;
  type: string;

  // Scores
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  totalQuestions: number;
  answeredCount: number;
  percentage: number;
  grade: string;

  // Streaks
  currentStreak: number;
  bestStreak: number;

  // Settings
  hasNegativeMark: boolean;
  negativeMark: number | null;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}

export interface ExamInfo {
  id: string;
  title: string;
  duration: number;
  total: number;
  subjects: string[];
}

export interface ResultData {
  attempt: AttemptDetails;
  reviewQuestions: ReviewQuestion[];
  exam: ExamInfo;
}

// Type for the results list (from getResults endpoint)
export interface ResultSummary {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  percentage: number;
  grade: string;
  timeTaken: number;
  completedAt: Date;
  status: string;
  submissionType: string | null;
  subjects: string[];
  type: string;
}

// Filter types
export type FilterTab = "all" | "correct" | "wrong" | "skipped";
export type TimeFilter = "all" | "month" | "week";
export type SortBy = "recent" | "score";

// Enum for exam types
export enum EXAM_TYPE {
  "Daily Exam" = "Daily Exam",
  "Chapter Final" = "Chapter Final",
  "Paper Final" = "Paper Final",
  "Subject Final" = "Subject Final",
  "Model Test" = "Model Test",
  "Mega Exam" = "Mega Exam",
}
