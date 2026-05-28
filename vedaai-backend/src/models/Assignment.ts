import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    schoolName: { type: String, default: "" },
    subject: { type: String, default: "" },
    grade: { type: String, default: "" },
    dueDate: String,
    additionalInfo: String,
    questionTypes: [
      {
        title: String,
        questions: Number,
        marks: Number,
      },
    ],
    generatedPaper: Object,
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
export const Assignment = mongoose.model("Assignment", assignmentSchema);