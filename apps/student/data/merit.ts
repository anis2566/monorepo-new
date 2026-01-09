import { MeritStudent, ExamInfo } from "@/types/merit";

export const mockExams: ExamInfo[] = [
  {
    id: "exam-1",
    title: "HSC Physics - Chapter 1-3 Test",
    total: 100,
    duration: 60,
    startDate: "2025-01-05T10:00:00",
    endDate: "2025-01-05T11:00:00",
    type: "MCQ",
    status: "Completed",
    participantCount: 45,
    averageScore: 72,
    highestScore: 98,
    lowestScore: 34,
  },
  {
    id: "exam-2",
    title: "HSC Chemistry - Organic Chemistry",
    total: 50,
    duration: 30,
    startDate: "2025-01-08T14:00:00",
    endDate: "2025-01-08T14:30:00",
    type: "MCQ",
    status: "Completed",
    participantCount: 38,
    averageScore: 35,
    highestScore: 48,
    lowestScore: 18,
  },
  {
    id: "exam-3",
    title: "SSC Mathematics - Algebra Final",
    total: 80,
    duration: 45,
    startDate: "2025-01-06T09:00:00",
    endDate: "2025-01-06T09:45:00",
    type: "MCQ",
    status: "Completed",
    participantCount: 52,
    averageScore: 58,
    highestScore: 78,
    lowestScore: 22,
  },
];

const studentNames = [
  "Rafiq Ahmed",
  "Fatima Akter",
  "Mohammad Rahman",
  "Ayesha Siddiqua",
  "Imran Hossain",
  "Nusrat Jahan",
  "Karim Uddin",
  "Sadia Islam",
  "Tanvir Hassan",
  "Maliha Begum",
  "Shakib Khan",
  "Rabeya Khatun",
  "Jubayer Ahmed",
  "Tasnim Akter",
  "Mamun Rashid",
  "Sharmin Sultana",
  "Faisal Mahmud",
  "Taslima Akter",
  "Arif Hossain",
  "Ruma Begum",
];

const institutes = [
  "Dhaka College",
  "Notre Dame College",
  "Rajuk Uttara Model College",
  "Viqarunnisa Noon College",
  "Holy Cross College",
];

const classes = ["HSC-24", "HSC-25", "SSC-25", "SSC-26"];
const batches = ["Morning-A", "Morning-B", "Day-A", "Day-B", "Evening-A"];

function generateMeritList(exam: ExamInfo): MeritStudent[] {
  const students: MeritStudent[] = [];

  for (let i = 0; i < exam.participantCount; i++) {
    const score = Math.max(
      exam.lowestScore,
      Math.min(
        exam.highestScore,
        Math.round(exam.averageScore + (Math.random() - 0.5) * 40)
      )
    );
    const totalQuestions = exam.total;
    const correctAnswers = Math.round((score / exam.total) * totalQuestions);
    const wrongAnswers = Math.round((totalQuestions - correctAnswers) * 0.7);
    const skipped = totalQuestions - correctAnswers - wrongAnswers;

    students.push({
      id: `student-${exam.id}-${i}`,
      rank: 0,
      name: studentNames[i % studentNames.length],
      studentId: `STU${2024000 + i}`,
      roll: `${100 + i}`,
      className: classes[i % classes.length],
      batch: batches[i % batches.length],
      institute: institutes[i % institutes.length],
      score,
      totalMarks: exam.total,
      correctAnswers,
      wrongAnswers,
      skipped: Math.max(0, skipped),
      timeTaken: Math.round(exam.duration * 60 * (0.6 + Math.random() * 0.35)),
      percentage: Math.round((score / exam.total) * 100),
    });
  }

  // Sort by score descending and assign ranks
  students.sort((a, b) => b.score - a.score);

  let currentRank = 1;
  for (let i = 0; i < students.length; i++) {
    if (i > 0 && students[i].score < students[i - 1].score) {
      currentRank = i + 1;
    }
    students[i].rank = currentRank;
  }

  return students;
}

export const meritListsByExam: Record<string, MeritStudent[]> = {
  "exam-1": generateMeritList(mockExams[0]),
  "exam-2": generateMeritList(mockExams[1]),
  "exam-3": generateMeritList(mockExams[2]),
};
