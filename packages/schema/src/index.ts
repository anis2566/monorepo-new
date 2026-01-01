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
  batchId: z.string().optional(),
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

export const BatchSchema = z.object({
  name: requiredString,
  classNameId: requiredString,
});

export type BatchSchemaType = z.infer<typeof BatchSchema>;

export const ExamSchema = z
  .object({
    title: requiredString,
    cq: z.string().optional(),
    mcq: z.string().optional(),
    duration: requiredString,
    startDate: requiredString,
    endDate: requiredString,
    hasSuffle: z.boolean({ message: "required" }),
    hasRandom: z.boolean({ message: "required" }),
    hasNegativeMark: z.boolean({ message: "required" }),
    negativeMark: z.string().optional(),
    classNameIds: z.array(z.string()).min(1, { message: "required" }),
    subjectIds: z.array(z.string()).min(1, { message: "required" }),
    batchIds: z.array(z.string()).min(1, { message: "required" }),
  })
  .superRefine((data, ctx) => {
    // Validate that at least one of cq or mcq is provided
    if (!data.cq && !data.mcq) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of cq, mcq is required",
        path: ["cq"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of cq, mcq is required",
        path: ["mcq"],
      });
    }

    // Validate negativeMark is required when hasNegativeMark is true
    if (data.hasNegativeMark && !data.negativeMark) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Negative mark is required when negative marking is enabled",
        path: ["negativeMark"],
      });
    }
  });

export type ExamSchemaType = z.infer<typeof ExamSchema>;
