import { z } from "zod";

const requiredString = z.string().min(1, "Required");

export const ClassNameSchema = z.object({
  name: requiredString,
  description: z.string().optional(),
});

export type ClassNameSchemaType = z.infer<typeof ClassNameSchema>;

export const InstituteSchema = z.object({
  name: requiredString,
  session: requiredString,
});

export type InstituteSchemaType = z.infer<typeof InstituteSchema>;

export const StudentSchema = z.object({
  session: requiredString,
  studentId: requiredString,
  name: requiredString,
  nameBangla: requiredString,
  fName: requiredString,
  mName: requiredString,
  gender: requiredString,
  dob: requiredString,
  nationality: requiredString,
  religion: requiredString,
  imageUrl: z.string().optional(),
  section: z.string().optional(),
  shift: z.string().optional(),
  group: requiredString,
  roll: requiredString,
  fPhone: z.string().length(11, "Valid phone number required"),
  mPhone: z.string().length(11, "Valid phone number required"),
  presentHouseNo: requiredString,
  presentMoholla: requiredString,
  presentPost: requiredString,
  presentThana: requiredString,
  permanentVillage: requiredString,
  permanentPost: requiredString,
  permanentThana: requiredString,
  permanentDistrict: requiredString,
  instituteId: requiredString,
  classNameId: requiredString,
});

export type StudentSchemaType = z.infer<typeof StudentSchema>;

export const SubjectSchema = z.object({
  name: requiredString,
  group: requiredString,
});

export type SubjectSchemaType = z.infer<typeof SubjectSchema>;

export const ChapterSchema = z.object({
  name: requiredString,
  position: requiredString,
  subjectId: requiredString,
});

export type ChapterSchemaType = z.infer<typeof ChapterSchema>;

const McqSchema = z.object({
  question: requiredString,
  answer: requiredString,
  chapterId: requiredString,
  subjectId: requiredString,
  options: z.array(z.string()).min(1, { message: "required" }),
  type: requiredString,
  isMath: z.boolean({ message: "required" }),
  reference: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  context: z.string().optional(),
  statements: z.array(z.string()).optional(),
});

export const McqsSchema = z.array(McqSchema);
