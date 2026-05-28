import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface QuestionType {
  id: string;
  title: string;
  questions: number;
  marks: number;
}
export interface GeneratedQuestion {
  question: string;
  difficulty: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
}
export interface AnswerKeyAnswer {
  questionNo: number;
  answer: string;
}
export interface AnswerKeySection {
  sectionTitle: string;
  answers: AnswerKeyAnswer[];
}
export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}
export interface GeneratedAssignment {
  schoolName: string;
  subject: string;
  class: string;
  duration: string;
  maxMarks: number;
  sections: GeneratedSection[];
  answerKey?: AnswerKeySection[];
}
export interface LastSubmittedData {
  schoolName: string;
  subject: string;
  grade: string;
  dueDate: string;
  additionalInfo: string;
  questionTypes: QuestionType[];
}
// Lightweight record shown on dashboard cards
export interface AssignmentRecord {
  _id: string;
  schoolName: string;
  subject: string;
  grade: string;
  dueDate: string;
  createdAt: string;
  status: string;
}
// Store Interface
export interface AssignmentStore {

  // QUESTION TYPES
  questionTypes: QuestionType[];
  addQuestionType: () => void;
  updateQuestionType: (id: string, field: keyof QuestionType, value: string | number) => void;
  removeQuestionType: (id: string) => void;

  // GENERATION STATE
  generationStatus: "idle" | "loading" | "completed" | "error";
  setGenerationStatus: (status: "idle" | "loading" | "completed" | "error") => void;

  // CURRENT ASSIGNMENT ID
  currentAssignmentId: string | null;
  setCurrentAssignmentId: (id: string) => void;

  // GENERATED ASSIGNMENT
  generatedAssignment: GeneratedAssignment | null;
  setGeneratedAssignment: (assignment: GeneratedAssignment) => void;

  // LAST SUBMITTED DATA (for Regenerate)
  lastSubmittedData: LastSubmittedData | null;
  setLastSubmittedData: (data: LastSubmittedData) => void;

  // ASSIGNMENTS LIST (for dashboard)
  assignments: AssignmentRecord[];
  addAssignment: (a: AssignmentRecord) => void;
  removeAssignment: (id: string) => void;

  // PAGE VIEW
  currentView: "dashboard" | "create" | "output";
  setCurrentView: (view: "dashboard" | "create" | "output") => void;

}

// Store Setup
export const useAssignmentStore = create<AssignmentStore>()(
  persist(
    (set) => ({
      questionTypes: [
        { id: crypto.randomUUID(), title: "Multiple Choice Questions", questions: 5, marks: 1 },
      ],
      addQuestionType: () =>
        set((state) => ({
          questionTypes: [
            ...state.questionTypes,
            { id: crypto.randomUUID(), title: "Short Questions", questions: 3, marks: 2 },
          ],
        })),
      updateQuestionType: (id, field, value) =>
        set((state) => ({
          questionTypes: state.questionTypes.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        })),
      removeQuestionType: (id) =>
        set((state) => ({
          questionTypes: state.questionTypes.filter((item) => item.id !== id),
        })),
      generationStatus: "idle",
      setGenerationStatus: (status) => set({ generationStatus: status }),
      currentAssignmentId: null,
      setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
      generatedAssignment: null,
      setGeneratedAssignment: (assignment) => set({ generatedAssignment: assignment }),
      lastSubmittedData: null,
      setLastSubmittedData: (data) => set({ lastSubmittedData: data }),
      assignments: [],
      addAssignment: (a) =>
        set((state) => ({
          assignments: [a, ...state.assignments.filter((x) => x._id !== a._id)],
        })),
      removeAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a._id !== id),
        })),
      currentView: "dashboard",
      setCurrentView: (view) => set({ currentView: view }),
    }),
    {
      name: "assignment-store", // name of the item in localStorage
    }
  )
);