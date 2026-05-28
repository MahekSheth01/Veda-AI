"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAssignmentStore } from "../../store/assignmentStore";
import { api } from "../../services/api";
import QuestionTypeRow from "./QuestionTypeRow";
import GeneratingLoader from "../../components/ui/GeneratingLoader";
import { Upload, Calendar, Plus, Mic, AlertCircle } from "lucide-react";
interface FormData {
  schoolName: string;
  subject: string;
  grade: string;
  dueDate: string;
  additionalInfo: string;
}
export default function CreateAssignmentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const {
    questionTypes,
    addQuestionType,
    generationStatus,
    setGenerationStatus,
    setLastSubmittedData,
    setCurrentView,
  } = useAssignmentStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const totalQuestions = questionTypes.reduce((s, q) => s + q.questions, 0);
  const totalMarks     = questionTypes.reduce((s, q) => s + q.questions * q.marks, 0);
  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!["application/pdf", "text/plain", "image/png", "image/jpeg"].includes(f.type)) return;
    setFile(f);
  };
  const onSubmit = async (data: FormData) => {
    if (questionTypes.length === 0) {
      alert("Please add at least one question type.");
      return;
    }
    try {
      setGenerationStatus("loading");
      const payload = {
        schoolName:    data.schoolName,
        subject:       data.subject,
        grade:         data.grade,
        dueDate:       data.dueDate,
        additionalInfo: data.additionalInfo,
        questionTypes: questionTypes.map(({ title, questions, marks }) => ({ title, questions, marks })),
      };
      setLastSubmittedData({ ...payload, questionTypes });
      await api.post("/assignments", payload);
    } catch (err) {
      console.error(err);
      setGenerationStatus("error");
    }
  };
  return (
    <div className="px-6 py-5 w-full mx-auto max-w-[1100px]">
      {/* PAGE HEADER */}
      <div className="mb-5 flex flex-col justify-center h-[56px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h1 className="text-[15px] font-semibold text-gray-900">Create Assignment</h1>
        </div>
        <p className="text-[12px] text-gray-500 mt-0.5 ml-4">
          Set up a new assignment for your students.
        </p>
      </div>
      {/* ERROR */}
      {generationStatus === "error" && (
        <div className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-[13px]">
          <AlertCircle size={15} />
          Generation failed. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 space-y-7 shadow-sm">
        {/* ── ASSIGNMENT DETAILS SECTION ── */}
        <div className="border-b border-gray-100 pb-5 mb-5 flex justify-center flex-col items-center">
          <div className="w-[120px] h-1 bg-gray-200 rounded-full mb-6 mx-auto hidden" />
          <h2 className="text-[16px] font-semibold text-gray-900 text-center">Assignment Details</h2>
          <p className="text-[12px] text-gray-500 mt-1 text-center">Basic information about your assignment.</p>
        </div>
        {/* FILE UPLOAD */}
        <div className="max-w-[700px] mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
            className={`border border-dashed rounded-[20px] p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-[#FAFAFA]"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Upload size={20} className="text-gray-500" />
            </div>
            {file ? (
              <p className="text-[13px] font-medium text-gray-700">{file.name}</p>
            ) : (
              <div className="text-center">
                <p className="text-[14px] font-medium text-gray-800">Choose a file or drag & drop it here</p>
                <p className="text-[12px] text-gray-500 mt-1">JPEG, PNG, upto 10MB</p>
              </div>
            )}
            <button
              type="button"
              className="mt-2 h-8 px-5 rounded-full border border-gray-200 bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={(e) => { e.stopPropagation(); document.getElementById("file-input")?.click(); }}
            >
              Browse Files
            </button>
            <input
              id="file-input" type="file" accept=".pdf,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <p className="text-[12px] text-gray-500 mt-3 text-center">Upload images of your preferred document/image</p>
        </div>
        {/* DUE DATE */}
        <div className="max-w-[700px] mx-auto">
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Due Date</label>
          <div className="relative">
            <input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
              className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-gray-400 transition-colors bg-[#FAFAFA]"
            />
            <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
        </div>
        {/* SCHOOL / SUBJECT / GRADE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[700px] mx-auto">
          {[
            { name: "schoolName", label: "School Name", placeholder: "e.g. DPS Bokaro" },
            { name: "subject",    label: "Subject",     placeholder: "e.g. Mathematics" },
            { name: "grade",      label: "Class",       placeholder: "e.g. Class 10" },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                {...register(name as keyof FormData, { required: `${label} is required` })}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[13px] outline-none focus:border-gray-400 transition-colors"
              />
              {errors[name as keyof FormData] && (
                <p className="text-red-500 text-xs mt-1">{errors[name as keyof FormData]?.message}</p>
              )}
            </div>
          ))}
        </div>
        {/* QUESTION TYPE TABLE */}
        <div className="max-w-[700px] mx-auto pt-2">
          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-[1fr_120px_100px_32px] gap-3 mb-2 px-1">
            <span className="text-[12px] font-medium text-gray-700">Question Type</span>
            <span className="text-[12px] font-medium text-gray-700 text-center">No. of Questions</span>
            <span className="text-[12px] font-medium text-gray-700 text-center">Marks</span>
            <span />
          </div>
          {/* ROWS */}
          <div className="space-y-3 bg-[#F8F9FA] p-4 rounded-2xl border border-gray-100">
            {questionTypes.map((item) => (
              <QuestionTypeRow key={item.id} item={item} />
            ))}
            
            {/* ADD ROW */}
            <div className="pt-2">
              <button
                type="button"
                onClick={addQuestionType}
                className="flex items-center gap-2 text-[13px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
                  <Plus size={12} strokeWidth={2.5} />
                </span>
                Add Question Type
              </button>
            </div>
          </div>
          {/* TOTALS */}
          <div className="mt-4 flex flex-col items-end gap-1 text-[13px] text-gray-700">
            <div>Total Questions: <span className="font-semibold">{totalQuestions}</span></div>
            <div>Total Marks: <span className="font-semibold">{totalMarks}</span></div>
          </div>
        </div>
        {/* ADDITIONAL INFORMATION */}
        <div className="max-w-[700px] mx-auto pt-2">
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Additional Information <span className="text-gray-400 font-normal">(For better output)</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g. Generate a question paper for 3 hour exam duration..."
              {...register("additionalInfo")}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[13px] outline-none focus:border-gray-400 transition-colors resize-none pr-10"
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <Mic size={14} className="text-gray-600" />
            </button>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex items-center justify-between gap-4 pt-6 max-w-[700px] mx-auto border-t border-gray-100">
          <button
            type="button"
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-2 h-10 px-5 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            ← Previous
          </button>
          <button
            type="submit"
            disabled={generationStatus === "loading"}
            className="flex items-center gap-2 h-10 px-6 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium hover:bg-[#333] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generationStatus === "loading" ? "Generating..." : "Next →"}
          </button>
        </div>
      </form>
      {/* GENERATING OVERLAY */}
      {generationStatus === "loading" && <GeneratingLoader />}
    </div>
  );
}
