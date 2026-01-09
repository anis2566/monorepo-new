export interface MeritStudent {
  id: string;
  rank: number;
  name: string;
  studentId: string;
  roll: string;
  className: string;
  batch: string;
  institute: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTaken: number; // in seconds
  percentage: number;
  imageUrl?: string;
}

export interface ExamInfo {
  id: string;
  title: string;
  total: number;
  duration: number;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  participantCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}
