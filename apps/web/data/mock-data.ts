// Admin Dashboard Mock Data based on Prisma Schema

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "Admin" | "User" | "Teacher";
  emailVerified: boolean;
  isNewUser: boolean;
  isVerifiedStudent: boolean;
  createdAt: Date;
  image?: string;
}

export interface AdminStudent {
  id: string;
  studentId: string;
  name: string;
  nameBangla: string;
  fName: string;
  mName: string;
  gender: string;
  className: string;
  batch: string | null;
  roll: string;
  institute: string;
  imageUrl?: string;
  userId?: string;
  createdAt: Date;
}

export interface AdminInstitute {
  id: string;
  name: string;
  session: string;
  studentCount: number;
  createdAt: Date;
}

export interface AdminClass {
  id: string;
  name: string;
  description?: string;
  studentCount: number;
  batchCount: number;
}

export interface AdminBatch {
  id: string;
  name: string;
  className: string;
  studentCount: number;
}

export interface AdminSubject {
  id: string;
  name: string;
  group: string;
  chapterCount: number;
  mcqCount: number;
}

export interface AdminChapter {
  id: string;
  name: string;
  subjectName: string;
  position: number;
  mcqCount: number;
}

export interface AdminMcq {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type: string;
  subject: string;
  chapter: string;
  isMath: boolean;
  session: number;
}

export interface AdminExam {
  id: string;
  title: string;
  total: number;
  duration: number;
  mcq: number;
  startDate: Date;
  endDate: Date;
  status: "Active" | "Pending" | "Completed" | "Cancelled";
  type: string;
  hasNegativeMark: boolean;
  negativeMark: number;
  subjects: string[];
  batches: string[];
  attemptCount: number;
  avgScore: number;
}

export interface AdminExamAttempt {
  id: string;
  studentName: string;
  studentId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  status:
    | "Not Started"
    | "In Progress"
    | "Submitted"
    | "Auto-Submitted"
    | "Abandoned";
  submissionType?: "Manual" | "Auto-TimeUp" | "Auto-TabSwitch";
  duration: number;
  tabSwitches: number;
  bestStreak: number;
  startTime: Date;
  endTime?: Date;
}

export interface DashboardStats {
  totalStudents: number;
  totalExams: number;
  totalMcqs: number;
  activeExams: number;
  totalAttempts: number;
  avgPassRate: number;
  newStudentsThisMonth: number;
  pendingVerifications: number;
}

export interface RecentActivity {
  id: string;
  type:
    | "exam_created"
    | "student_registered"
    | "exam_submitted"
    | "mcq_added"
    | "user_verified";
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface PerformanceData {
  month: string;
  exams: number;
  avgScore: number;
  attempts: number;
}

// Mock Data

// Generate more users for pagination demo
const generateUsers = (): AdminUser[] => {
  const roles: ("Admin" | "User" | "Teacher")[] = ["Admin", "User", "Teacher"];
  const names = [
    "Dr. Karim Ahmed",
    "Fatima Begum",
    "Rahman Khan",
    "Aisha Sultana",
    "Mohammad Ali",
    "Nusrat Jahan",
    "Habib Rahman",
    "Salma Khatun",
    "Abdul Kadir",
    "Rashida Begum",
    "Jamal Uddin",
    "Nasreen Akter",
    "Rafiq Hossain",
    "Marium Sultana",
    "Kamal Hasan",
    "Tahmina Akter",
    "Shafiq Islam",
    "Rubina Begum",
    "Monir Hossain",
    "Farzana Rahman",
    "Iqbal Ahmed",
    "Sabina Yasmin",
    "Tariq Aziz",
    "Shamima Begum",
    "Zahid Hasan",
    "Roksana Parvin",
    "Mizanur Rahman",
    "Hosneara Begum",
    "Delwar Hossain",
    "Jasmine Akter",
  ];

  return names.map((name, index) => ({
    id: String(index + 1),
    name,
    email: `${name
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .slice(0, 10)}${index}@school.edu`,
    phone: `+8801${70 + (index % 10)}${String(1000000 + index).slice(-7)}`,
    role: "User",
    emailVerified: index % 4 !== 0,
    isNewUser: index % 5 === 0,
    isVerifiedStudent: index % 3 === 2,
    createdAt: new Date(2024, index % 12, (index % 28) + 1),
  }));
};

export const mockAdminUsers: AdminUser[] = generateUsers();

export const mockAdminStudents: AdminStudent[] = [
  {
    id: "1",
    studentId: "STD-2024-001",
    name: "Ahmed Rahman",
    nameBangla: "আহমেদ রহমান",
    fName: "Mohammad Rahman",
    mName: "Fatima Begum",
    gender: "Male",
    className: "Class 10",
    batch: "Morning Batch A",
    roll: "15",
    institute: "Dhaka Model School",
    createdAt: new Date("2024-06-15"),
  },
  {
    id: "2",
    studentId: "STD-2024-002",
    name: "Fatima Akter",
    nameBangla: "ফাতিমা আক্তার",
    fName: "Abdul Karim",
    mName: "Rahima Begum",
    gender: "Female",
    className: "Class 10",
    batch: "Morning Batch A",
    roll: "08",
    institute: "Dhaka Model School",
    createdAt: new Date("2024-06-16"),
  },
  {
    id: "3",
    studentId: "STD-2024-003",
    name: "Rafiq Islam",
    nameBangla: "রফিক ইসলাম",
    fName: "Jamal Islam",
    mName: "Salma Begum",
    gender: "Male",
    className: "Class 9",
    batch: "Evening Batch B",
    roll: "22",
    institute: "Chittagong Grammar School",
    createdAt: new Date("2024-07-01"),
  },
  {
    id: "4",
    studentId: "STD-2024-004",
    name: "Marium Khan",
    nameBangla: "মরিয়ম খান",
    fName: "Habib Khan",
    mName: "Nasreen Khan",
    gender: "Female",
    className: "Class 11",
    batch: "Science A",
    roll: "05",
    institute: "Rajshahi Collegiate School",
    createdAt: new Date("2024-07-10"),
  },
  {
    id: "5",
    studentId: "STD-2024-005",
    name: "Kamal Hossain",
    nameBangla: "কামাল হোসাইন",
    fName: "Rahim Hossain",
    mName: "Ayesha Begum",
    gender: "Male",
    className: "Class 12",
    batch: "Science B",
    roll: "12",
    institute: "Dhaka Model School",
    createdAt: new Date("2024-08-01"),
  },
];

export const mockAdminInstitutes: AdminInstitute[] = [
  {
    id: "1",
    name: "Dhaka Model School",
    session: "2024",
    studentCount: 450,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Chittagong Grammar School",
    session: "2024",
    studentCount: 320,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Rajshahi Collegiate School",
    session: "2024",
    studentCount: 280,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Sylhet Cadet College",
    session: "2024",
    studentCount: 200,
    createdAt: new Date("2024-01-01"),
  },
];

export const mockAdminClasses: AdminClass[] = [
  {
    id: "1",
    name: "Class 9",
    description: "Secondary School Certificate - Year 1",
    studentCount: 180,
    batchCount: 4,
  },
  {
    id: "2",
    name: "Class 10",
    description: "Secondary School Certificate - Year 2",
    studentCount: 165,
    batchCount: 4,
  },
  {
    id: "3",
    name: "Class 11",
    description: "Higher Secondary - Year 1",
    studentCount: 142,
    batchCount: 3,
  },
  {
    id: "4",
    name: "Class 12",
    description: "Higher Secondary - Year 2",
    studentCount: 138,
    batchCount: 3,
  },
];

export const mockAdminBatches: AdminBatch[] = [
  { id: "1", name: "Morning Batch A", className: "Class 10", studentCount: 45 },
  { id: "2", name: "Morning Batch B", className: "Class 10", studentCount: 42 },
  { id: "3", name: "Evening Batch A", className: "Class 10", studentCount: 38 },
  { id: "4", name: "Evening Batch B", className: "Class 10", studentCount: 40 },
  { id: "5", name: "Science A", className: "Class 11", studentCount: 48 },
  { id: "6", name: "Science B", className: "Class 11", studentCount: 46 },
  { id: "7", name: "Commerce A", className: "Class 11", studentCount: 48 },
];

export const mockAdminSubjects: AdminSubject[] = [
  {
    id: "1",
    name: "Physics",
    group: "Science",
    chapterCount: 15,
    mcqCount: 850,
  },
  {
    id: "2",
    name: "Chemistry",
    group: "Science",
    chapterCount: 14,
    mcqCount: 720,
  },
  {
    id: "3",
    name: "Biology",
    group: "Science",
    chapterCount: 18,
    mcqCount: 920,
  },
  {
    id: "4",
    name: "Mathematics",
    group: "Science",
    chapterCount: 12,
    mcqCount: 680,
  },
  {
    id: "5",
    name: "English",
    group: "General",
    chapterCount: 10,
    mcqCount: 450,
  },
  {
    id: "6",
    name: "Bangla",
    group: "General",
    chapterCount: 12,
    mcqCount: 520,
  },
];

export const mockAdminChapters: AdminChapter[] = [
  {
    id: "1",
    name: "Force and Motion",
    subjectName: "Physics",
    position: 1,
    mcqCount: 65,
  },
  {
    id: "2",
    name: "Work, Energy & Power",
    subjectName: "Physics",
    position: 2,
    mcqCount: 58,
  },
  {
    id: "3",
    name: "Gravitation",
    subjectName: "Physics",
    position: 3,
    mcqCount: 52,
  },
  { id: "4", name: "Waves", subjectName: "Physics", position: 4, mcqCount: 48 },
  {
    id: "5",
    name: "Atomic Structure",
    subjectName: "Chemistry",
    position: 1,
    mcqCount: 55,
  },
  {
    id: "6",
    name: "Chemical Bonding",
    subjectName: "Chemistry",
    position: 2,
    mcqCount: 62,
  },
  {
    id: "7",
    name: "Organic Chemistry",
    subjectName: "Chemistry",
    position: 3,
    mcqCount: 78,
  },
  {
    id: "8",
    name: "Cell Biology",
    subjectName: "Biology",
    position: 1,
    mcqCount: 68,
  },
  {
    id: "9",
    name: "Genetics",
    subjectName: "Biology",
    position: 2,
    mcqCount: 72,
  },
];

export const mockAdminMcqs: AdminMcq[] = [
  {
    id: "1",
    question: "What is the SI unit of force?",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    answer: "Newton",
    type: "Single Choice",
    subject: "Physics",
    chapter: "Force and Motion",
    isMath: false,
    session: 2024,
  },
  {
    id: "2",
    question: "Which of the following is a vector quantity?",
    options: ["Speed", "Mass", "Velocity", "Temperature"],
    answer: "Velocity",
    type: "Single Choice",
    subject: "Physics",
    chapter: "Force and Motion",
    isMath: false,
    session: 2024,
  },
  {
    id: "3",
    question: "The chemical formula of water is:",
    options: ["H₂O", "CO₂", "NaCl", "H₂SO₄"],
    answer: "H₂O",
    type: "Single Choice",
    subject: "Chemistry",
    chapter: "Basic Chemistry",
    isMath: false,
    session: 2024,
  },
  {
    id: "4",
    question: "DNA stands for:",
    options: [
      "Deoxyribonucleic Acid",
      "Dinucleic Acid",
      "Deoxyribose Acid",
      "Ribonucleic Acid",
    ],
    answer: "Deoxyribonucleic Acid",
    type: "Single Choice",
    subject: "Biology",
    chapter: "Genetics",
    isMath: false,
    session: 2024,
  },
];

export const mockAdminExams: AdminExam[] = [
  {
    id: "1",
    title: "Physics Weekly Test - Week 5",
    total: 40,
    duration: 45,
    mcq: 40,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 22),
    status: "Active",
    type: "Weekly Test",
    hasNegativeMark: true,
    negativeMark: 0.25,
    subjects: ["Physics"],
    batches: ["Morning Batch A", "Morning Batch B"],
    attemptCount: 67,
    avgScore: 72.5,
  },
  {
    id: "2",
    title: "Chemistry Chapter Test - Organic Chemistry",
    total: 30,
    duration: 30,
    mcq: 30,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    status: "Pending",
    type: "Chapter Test",
    hasNegativeMark: false,
    negativeMark: 0,
    subjects: ["Chemistry"],
    batches: ["Science A", "Science B"],
    attemptCount: 0,
    avgScore: 0,
  },
  {
    id: "3",
    title: "Biology Mock Exam - Full Syllabus",
    total: 100,
    duration: 90,
    mcq: 100,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "Completed",
    type: "Mock Exam",
    hasNegativeMark: true,
    negativeMark: 0.5,
    subjects: ["Biology"],
    batches: ["All Batches"],
    attemptCount: 145,
    avgScore: 68.3,
  },
  {
    id: "4",
    title: "Mathematics Daily Practice",
    total: 20,
    duration: 20,
    mcq: 20,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 2),
    status: "Active",
    type: "Daily Practice",
    hasNegativeMark: false,
    negativeMark: 0,
    subjects: ["Mathematics"],
    batches: ["Evening Batch A", "Evening Batch B"],
    attemptCount: 23,
    avgScore: 78.2,
  },
  {
    id: "5",
    title: "Combined Science Test - Mid Term",
    total: 80,
    duration: 75,
    mcq: 80,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    status: "Completed",
    type: "Mid Term",
    hasNegativeMark: true,
    negativeMark: 0.25,
    subjects: ["Physics", "Chemistry", "Biology"],
    batches: ["All Batches"],
    attemptCount: 312,
    avgScore: 65.8,
  },
];

export const mockAdminAttempts: AdminExamAttempt[] = [
  {
    id: "1",
    studentName: "Ahmed Rahman",
    studentId: "STD-2024-001",
    examTitle: "Physics Weekly Test - Week 5",
    score: 32,
    totalQuestions: 40,
    correctAnswers: 32,
    wrongAnswers: 5,
    skippedQuestions: 3,
    status: "Submitted",
    submissionType: "Manual",
    duration: 42,
    tabSwitches: 0,
    bestStreak: 8,
    startTime: new Date(Date.now() - 1000 * 60 * 60),
    endTime: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    id: "2",
    studentName: "Fatima Akter",
    studentId: "STD-2024-002",
    examTitle: "Physics Weekly Test - Week 5",
    score: 35,
    totalQuestions: 40,
    correctAnswers: 35,
    wrongAnswers: 3,
    skippedQuestions: 2,
    status: "Submitted",
    submissionType: "Manual",
    duration: 38,
    tabSwitches: 1,
    bestStreak: 12,
    startTime: new Date(Date.now() - 1000 * 60 * 90),
    endTime: new Date(Date.now() - 1000 * 60 * 52),
  },
  {
    id: "3",
    studentName: "Rafiq Islam",
    studentId: "STD-2024-003",
    examTitle: "Mathematics Daily Practice",
    score: 16,
    totalQuestions: 20,
    correctAnswers: 16,
    wrongAnswers: 2,
    skippedQuestions: 2,
    status: "In Progress",
    duration: 15,
    tabSwitches: 0,
    bestStreak: 6,
    startTime: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "4",
    studentName: "Marium Khan",
    studentId: "STD-2024-004",
    examTitle: "Biology Mock Exam - Full Syllabus",
    score: 78,
    totalQuestions: 100,
    correctAnswers: 78,
    wrongAnswers: 15,
    skippedQuestions: 7,
    status: "Submitted",
    submissionType: "Auto-TimeUp",
    duration: 90,
    tabSwitches: 3,
    bestStreak: 15,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 90),
  },
  {
    id: "5",
    studentName: "Kamal Hossain",
    studentId: "STD-2024-005",
    examTitle: "Combined Science Test - Mid Term",
    score: 62,
    totalQuestions: 80,
    correctAnswers: 62,
    wrongAnswers: 12,
    skippedQuestions: 6,
    status: "Submitted",
    submissionType: "Manual",
    duration: 71,
    tabSwitches: 0,
    bestStreak: 10,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6 + 1000 * 60 * 71),
  },
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 625,
  totalExams: 48,
  totalMcqs: 4140,
  activeExams: 2,
  totalAttempts: 2847,
  avgPassRate: 72.4,
  newStudentsThisMonth: 45,
  pendingVerifications: 12,
};

export const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "exam_submitted",
    description: "Ahmed Rahman submitted Physics Weekly Test - Week 5",
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    id: "2",
    type: "exam_submitted",
    description: "Fatima Akter submitted Physics Weekly Test - Week 5",
    timestamp: new Date(Date.now() - 1000 * 60 * 52),
  },
  {
    id: "3",
    type: "student_registered",
    description: "New student Kamal Hossain registered",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    type: "exam_created",
    description: "Chemistry Chapter Test - Organic Chemistry created",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: "5",
    type: "mcq_added",
    description: "25 new MCQs added to Physics - Gravitation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: "6",
    type: "user_verified",
    description: "Teacher Fatima Begum verified",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
];

export const mockPerformanceData: PerformanceData[] = [
  { month: "Jul", exams: 8, avgScore: 68, attempts: 412 },
  { month: "Aug", exams: 10, avgScore: 71, attempts: 523 },
  { month: "Sep", exams: 12, avgScore: 69, attempts: 587 },
  { month: "Oct", exams: 9, avgScore: 73, attempts: 498 },
  { month: "Nov", exams: 11, avgScore: 75, attempts: 612 },
  { month: "Dec", exams: 8, avgScore: 72, attempts: 445 },
];
