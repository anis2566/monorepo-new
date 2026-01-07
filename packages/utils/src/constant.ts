export enum ROLE {
  User = "User",
  Student = "Student",
  Admin = "Admin",
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 5;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 40, 50, 100, 200, 500];
export const DEFAULT_SORT_OPTIONS = [
  {
    label: "Newest",
    value: "desc",
  },
  {
    label: "Oldest",
    value: "asc",
  },
];
export const EXTENDED_SORT_OPTIONS = [
  {
    label: "ID (Ascending)",
    value: "id_asc",
  },
  {
    label: "ID (Descending)",
    value: "id_desc",
  },
  {
    label: "Newest",
    value: "desc",
  },
  {
    label: "Oldest",
    value: "asc",
  },
];

export const natiionality = ["Bangladeshi", "Other"];
export const religions = ["Islam", "Hindu", "Buddhist", "Christian", "Other"];
export const genders = ["Male", "Female", "Other"];
export const groups = ["Common", "Science", "Business Studies", "Humanities"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export enum MCQ_TYPE {
  Single = "Single",
  Multiple = "Multiple",
  Contextual = "Contextual",
}

export enum EXAM_STATUS {
  Pending = "Pending",
  Upcoming = "Upcoming",
  Ongoing = "Ongoing",
  Completed = "Completed",
}

export enum EXAM_TYPE {
  "Daily Exam" = "Daily Exam",
  "Chapter Final" = "Chapter Final",
  "Paper Final" = "Paper Final",
  "Subject Final" = "Subject Final",
  "Model Test" = "Model Test",
  "Mega Exam" = "Mega Exam",
}

export const timeSlots = [
  "9:00 AM - 9:30 AM",
  "9:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 1:00 PM",
  "1:00 PM - 1:30 PM",
  "1:30 PM - 2:00 PM",
  "2:00 PM - 2:30 PM",
  "2:30 PM - 3:00 PM",
  "3:00 PM - 3:30 PM",
  "3:30 PM - 4:00 PM",
  "4:00 PM - 4:30 PM",
  "4:30 PM - 5:00 PM",
  "5:00 PM - 5:30 PM",
  "5:30 PM - 6:00 PM",
  "6:00 PM - 6:30 PM",
  "6:30 PM - 7:00 PM",
  "7:00 PM - 7:30 PM",
  "7:30 PM - 8:00 PM",
  "8:00 PM - 8:30 PM",
  "8:30 PM - 9:00 PM",
];

export function sortTimeSlots(input: string[]): string[] {
  return input.sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b));
}
