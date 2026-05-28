import { z } from "zod";

export const assignmentSchema = z.object({
  dueDate: z.string().min(1, "Due date is required"),

  additionalInfo: z
    .string()
    .min(10, "Please enter at least 10 characters"),
});

export type AssignmentFormData =
  z.infer<typeof assignmentSchema>;