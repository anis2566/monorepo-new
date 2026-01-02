export interface Mcq {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  isMath: boolean;
  subject: string;
  chapter: string;
}

export interface Exam {
  id: string;
  title: string;
  total: number;
  duration: number;
  mcq: number;
  startDate: Date;
  endDate: Date;
  hasNegativeMark: boolean;
  negativeMark: number;
  status: "Pending" | "Active" | "Completed";
  subjects: string[];
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  percentage: number;
  completedAt: Date;
  timeTaken: number;
}

export interface UserAnswer {
  mcqId: string;
  selectedOption: string | null;
  isCorrect?: boolean;
}

export interface ExamSession {
  examId: string;
  startedAt: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  timeRemaining: number;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  nameBangla: string;
  imageUrl?: string;
  className: string;
  batch?: string;
  roll: string;
}
