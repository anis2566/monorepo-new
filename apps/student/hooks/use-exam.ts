import { create } from "zustand";

interface ExamStore {
  examId: string | null;
  totalQuestions: number | null;
  attemptId: string | null;
  setExamData: (examId: string, totalQuestions: number) => void;
  setAttemptId: (attemptId: string) => void;
  close: () => void;
}

export const useStartExam = create<ExamStore>((set) => ({
  examId: null,
  totalQuestions: null,
  attemptId: null,
  setExamData: (examId, totalQuestions) =>
    set({ examId, totalQuestions, attemptId: null }),
  setAttemptId: (attemptId) => set({ attemptId }),
  close: () => set({ examId: null, totalQuestions: null, attemptId: null }),
}));
