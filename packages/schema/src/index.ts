import { z } from "zod";

const requiredString = z.string().min(1, "Required");

export const ClassNameSchema = z.object({
  name: requiredString,
  description: z.string().optional(),
});

export type ClassNameSchemaType = z.infer<typeof classNameSchema>;
