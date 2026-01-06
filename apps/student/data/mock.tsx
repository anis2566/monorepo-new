import { Exam, ExamResult, Mcq, Student } from "@/types/exam";

export const mockStudent: Student = {
  id: "1",
  studentId: "STD-2024-001",
  name: "Ahmed Rahman",
  nameBangla: "আহমেদ রহমান",
  imageUrl: undefined,
  className: "Class 10",
  batch: "Morning Batch A",
  roll: "15",
};

export const mockExams: Exam[] = [
  {
    id: "1",
    title: "Physics Weekly Test - Week 5",
    total: 40,
    duration: 45,
    mcq: 40,
    startDate: new Date(Date.now() + 1000 * 60 * 30), // 30 mins from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    hasNegativeMark: true,
    negativeMark: 0.25,
    status: "Active",
    subjects: ["Physics"],
  },
  {
    id: "2",
    title: "Chemistry Chapter Test - Organic Chemistry",
    total: 30,
    duration: 30,
    mcq: 30,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    hasNegativeMark: false,
    negativeMark: 0,
    status: "Pending",
    subjects: ["Chemistry"],
  },
  {
    id: "3",
    title: "Biology Mock Exam - Full Syllabus",
    total: 100,
    duration: 90,
    mcq: 100,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    hasNegativeMark: true,
    negativeMark: 0.5,
    status: "Pending",
    subjects: ["Biology"],
  },
  {
    id: "4",
    title: "Mathematics Daily Practice",
    total: 20,
    duration: 20,
    mcq: 20,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
    hasNegativeMark: false,
    negativeMark: 0,
    status: "Active",
    subjects: ["Mathematics"],
  },
];

export const mockMcqs: Mcq[] = [
  {
    id: "1",
    question: "What is the SI unit of force?",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    answer: "Newton",
    explanation:
      "The SI unit of force is Newton (N), named after Sir Isaac Newton. 1 Newton = 1 kg⋅m/s²",
    isMath: false,
    subject: "Physics",
    chapter: "Force and Motion",
  },
  {
    id: "2",
    question: "Which of the following is a vector quantity?",
    options: ["Speed", "Mass", "Velocity", "Temperature"],
    answer: "Velocity",
    explanation:
      "Velocity is a vector quantity as it has both magnitude and direction. Speed, mass, and temperature are scalar quantities.",
    isMath: false,
    subject: "Physics",
    chapter: "Force and Motion",
  },
  {
    id: "3",
    question: "The acceleration due to gravity on Earth is approximately:",
    options: ["9.8 m/s", "9.8 m/s²", "10 m/s", "10 km/s²"],
    answer: "9.8 m/s²",
    explanation:
      "The acceleration due to gravity (g) on Earth's surface is approximately 9.8 m/s² or about 10 m/s² for rough calculations.",
    isMath: false,
    subject: "Physics",
    chapter: "Gravitation",
  },
  {
    id: "4",
    question: "What is the chemical formula of water?",
    options: ["H₂O", "CO₂", "NaCl", "H₂SO₄"],
    answer: "H₂O",
    explanation:
      "Water consists of two hydrogen atoms and one oxygen atom, giving it the formula H₂O.",
    isMath: false,
    subject: "Chemistry",
    chapter: "Basic Chemistry",
  },
  {
    id: "5",
    question: "If F = ma, and m = 5 kg with a = 2 m/s², what is F?",
    options: ["7 N", "10 N", "2.5 N", "3 N"],
    answer: "10 N",
    explanation: "F = ma = 5 kg × 2 m/s² = 10 N",
    isMath: true,
    subject: "Physics",
    chapter: "Force and Motion",
  },
];

export const mockResults: ExamResult[] = [
  {
    id: "1",
    examId: "101",
    examTitle: "Physics Weekly Test - Week 4",
    score: 32,
    total: 40,
    correct: 32,
    incorrect: 5,
    skipped: 3,
    percentage: 80,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    timeTaken: 38,
  },
  {
    id: "2",
    examId: "102",
    examTitle: "Chemistry Chapter Test - Acids & Bases",
    score: 25,
    total: 30,
    correct: 25,
    incorrect: 3,
    skipped: 2,
    percentage: 83.3,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    timeTaken: 25,
  },
  {
    id: "3",
    examId: "103",
    examTitle: "Biology Mock Exam - Chapter 1-3",
    score: 45,
    total: 50,
    correct: 45,
    incorrect: 4,
    skipped: 1,
    percentage: 90,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    timeTaken: 42,
  },
];

export interface LeaderboardEntry {
  id: string;
  rank: number;
  studentId: string;
  studentName: string;
  imageUrl?: string;
  className: string;
  batch?: string;
  totalScore: number;
  totalExams: number;
  averagePercentage: number;
  bestStreak: number;
  totalXp: number;
  correctAnswers: number;
}

export type LeaderboardType = "overall" | "weekly" | "monthly" | "streak";

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    studentId: "STD-2024-005",
    studentName: "Fatima Khan",
    className: "Class 10",
    batch: "Morning Batch A",
    totalScore: 892,
    totalExams: 15,
    averagePercentage: 94.2,
    bestStreak: 28,
    totalXp: 2850,
    correctAnswers: 445,
  },
  {
    id: "2",
    rank: 2,
    studentId: "STD-2024-003",
    studentName: "Rahim Uddin",
    className: "Class 10",
    batch: "Morning Batch A",
    totalScore: 856,
    totalExams: 14,
    averagePercentage: 91.5,
    bestStreak: 22,
    totalXp: 2650,
    correctAnswers: 412,
  },
  {
    id: "3",
    rank: 3,
    studentId: "STD-2024-001",
    studentName: "Ahmed Rahman",
    className: "Class 10",
    batch: "Morning Batch A",
    totalScore: 832,
    totalExams: 12,
    averagePercentage: 88.7,
    bestStreak: 18,
    totalXp: 2400,
    correctAnswers: 398,
  },
  {
    id: "4",
    rank: 4,
    studentId: "STD-2024-008",
    studentName: "Nasrin Akter",
    className: "Class 10",
    batch: "Evening Batch B",
    totalScore: 798,
    totalExams: 13,
    averagePercentage: 85.3,
    bestStreak: 15,
    totalXp: 2200,
    correctAnswers: 372,
  },
  {
    id: "5",
    rank: 5,
    studentId: "STD-2024-012",
    studentName: "Karim Hossain",
    className: "Class 10",
    batch: "Morning Batch A",
    totalScore: 765,
    totalExams: 11,
    averagePercentage: 82.1,
    bestStreak: 14,
    totalXp: 1950,
    correctAnswers: 348,
  },
  {
    id: "6",
    rank: 6,
    studentId: "STD-2024-015",
    studentName: "Sumaiya Begum",
    className: "Class 10",
    batch: "Evening Batch B",
    totalScore: 742,
    totalExams: 12,
    averagePercentage: 79.8,
    bestStreak: 12,
    totalXp: 1800,
    correctAnswers: 325,
  },
  {
    id: "7",
    rank: 7,
    studentId: "STD-2024-020",
    studentName: "Jahid Islam",
    className: "Class 10",
    batch: "Morning Batch A",
    totalScore: 718,
    totalExams: 10,
    averagePercentage: 77.5,
    bestStreak: 11,
    totalXp: 1650,
    correctAnswers: 305,
  },
  {
    id: "8",
    rank: 8,
    studentId: "STD-2024-022",
    studentName: "Mithila Roy",
    className: "Class 10",
    batch: "Evening Batch B",
    totalScore: 695,
    totalExams: 11,
    averagePercentage: 75.2,
    bestStreak: 10,
    totalXp: 1500,
    correctAnswers: 288,
  },
  {
    id: "9",
    rank: 9,
    studentId: "STD-2024-025",
    studentName: "Tanvir Ahmed",
    className: "Class 10",
    batch: "Morning Batch A",
    totalScore: 672,
    totalExams: 9,
    averagePercentage: 73.8,
    bestStreak: 9,
    totalXp: 1350,
    correctAnswers: 265,
  },
  {
    id: "10",
    rank: 10,
    studentId: "STD-2024-028",
    studentName: "Riya Sultana",
    className: "Class 10",
    batch: "Evening Batch B",
    totalScore: 648,
    totalExams: 10,
    averagePercentage: 71.5,
    bestStreak: 8,
    totalXp: 1200,
    correctAnswers: 245,
  },
];

// Weekly leaderboard (different rankings)
export const mockWeeklyLeaderboard: LeaderboardEntry[] = [
  {
    ...mockLeaderboard[2]!,
    rank: 1,
    totalScore: 145,
    totalExams: 3,
    averagePercentage: 92.5,
  },
  {
    ...mockLeaderboard[0]!,
    rank: 2,
    totalScore: 138,
    totalExams: 2,
    averagePercentage: 89.0,
  },
  {
    ...mockLeaderboard[4]!,
    rank: 3,
    totalScore: 132,
    totalExams: 3,
    averagePercentage: 85.5,
  },
  {
    ...mockLeaderboard[1]!,
    rank: 4,
    totalScore: 125,
    totalExams: 2,
    averagePercentage: 82.0,
  },
  {
    ...mockLeaderboard[6]!,
    rank: 5,
    totalScore: 118,
    totalExams: 2,
    averagePercentage: 78.5,
  },
];

// Streak leaderboard
export const mockStreakLeaderboard: LeaderboardEntry[] = [
  { ...mockLeaderboard[0]! },
  { ...mockLeaderboard[1]! },
  { ...mockLeaderboard[2]! },
  { ...mockLeaderboard[3]! },
  { ...mockLeaderboard[4]! },
]
  .sort((a, b) => b.bestStreak - a.bestStreak)
  .map((entry, index) => ({ ...entry, rank: index + 1 }));
