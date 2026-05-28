"use client";
import { X, Minus, Plus } from "lucide-react";
import { useAssignmentStore, QuestionType } from "../../store/assignmentStore";
const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Questions",
  "Diagram/Graph Based Questions",
  "Numerical Problems",
  "True / False Questions",
  "Fill in the Blanks",
  "Match the Following",
];
interface Props { item: QuestionType; }
export default function QuestionTypeRow({ item }: Props) {
  const { removeQuestionType, updateQuestionType } = useAssignmentStore();
  const step = (field: "questions" | "marks", dir: 1 | -1) => {
    const cur = item[field] as number;
    updateQuestionType(item.id, field, Math.max(1, cur + dir));
  };
  return (
    <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
      {/* TYPE DROPDOWN */}
      <div className="flex-1 relative">
        <select
          value={item.title}
          onChange={(e) => updateQuestionType(item.id, "title", e.target.value)}
          className="w-full h-9 pl-3 pr-8 rounded-lg bg-transparent text-[13px] font-medium text-gray-800 outline-none cursor-pointer appearance-none"
        >
          {QUESTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="text-gray-300">×</div>
      {/* QUESTIONS STEPPER */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg h-9 px-2 bg-white w-24 justify-between shrink-0">
        <button type="button" onClick={() => step("questions", -1)} className="text-gray-400 hover:text-gray-700 transition-colors w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50">
          <Minus size={12} strokeWidth={2.5} />
        </button>
        <span className="text-[13px] font-medium w-4 text-center">{item.questions}</span>
        <button type="button" onClick={() => step("questions", 1)} className="text-gray-400 hover:text-gray-700 transition-colors w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50">
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>
      <div className="text-gray-300">×</div>
      {/* MARKS STEPPER */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg h-9 px-2 bg-white w-24 justify-between shrink-0">
        <button type="button" onClick={() => step("marks", -1)} className="text-gray-400 hover:text-gray-700 transition-colors w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50">
          <Minus size={12} strokeWidth={2.5} />
        </button>
        <span className="text-[13px] font-medium w-4 text-center">{item.marks}</span>
        <button type="button" onClick={() => step("marks", 1)} className="text-gray-400 hover:text-gray-700 transition-colors w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-50">
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>
      {/* DELETE */}
      <button
        type="button"
        onClick={() => removeQuestionType(item.id)}
        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shrink-0 hidden md:flex"
      >
        <X size={14} />
      </button>
    </div>
  );
}
