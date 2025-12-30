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
export const groups = [
  "Common",
  "Science",
  "Business Studies",
  "Humanities"
];

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