"use client";
import { useEffect, useState } from "react";
import { useAssignmentStore } from "../../store/assignmentStore";
import QuestionSection from "./QuestionSection";
import AnswerKey from "./AnswerKey";
import { api, API_BASE_URL } from "../../services/api";
import { socket } from "../../services/socket";
import { RotateCcw, Download, Loader2, AlertCircle } from "lucide-react";
type PdfState = "idle" | "queued" | "ready" | "error";
export default function AssignmentOutputPage() {
  const {
    generatedAssignment,
    currentAssignmentId,
    lastSubmittedData,
    generationStatus,
    setGenerationStatus,
    setCurrentView,
  } = useAssignmentStore();
  const [regenerating, setRegenerating] = useState(false);
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  const [pdfJobId, setPdfJobId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    const onReady = (data: { jobId: string }) => {
      setPdfState("ready");
      triggerDownload(data.jobId);
    };
    const onFailed = () => {
      setPdfState("error");
      setPdfError("PDF generation failed. Please try again.");
    };
    socket.on("pdf-ready", onReady);
    socket.on("pdf-failed", onFailed);
    return () => {
      socket.off("pdf-ready", onReady);
      socket.off("pdf-failed", onFailed);
    };
  }, [pdfJobId]);
  const triggerDownload = async (jobId: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/assignments/pdf/${jobId}`);
      if (!resp.ok) throw new Error();
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `question-paper-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setPdfState("idle");
    } catch {
      setPdfState("error");
      setPdfError("Failed to download PDF.");
    }
  };
  const handleDownloadPDF = async () => {
    if (!currentAssignmentId) {
      setPdfState("error");
      setPdfError("Assignment ID missing. Please regenerate.");
      return;
    }
    try {
      setPdfState("queued");
      setPdfError("");
      const { data } = await api.post(`/assignments/${currentAssignmentId}/pdf`);
      setPdfJobId(data.jobId);
    } catch {
      setPdfState("error");
      setPdfError("Failed to start PDF generation.");
    }
  };
  const handleRegenerate = async () => {
    if (!lastSubmittedData) return;
    try {
      setRegenerating(true);
      setGenerationStatus("loading");
      await api.post("/assignments", {
        schoolName:    lastSubmittedData.schoolName,
        subject:       lastSubmittedData.subject,
        grade:         lastSubmittedData.grade,
        dueDate:       lastSubmittedData.dueDate,
        additionalInfo: lastSubmittedData.additionalInfo,
        questionTypes: lastSubmittedData.questionTypes.map(
          ({ title, questions, marks }) => ({ title, questions, marks })
        ),
      });
    } catch {
      setGenerationStatus("error");
    } finally {
      setRegenerating(false);
    }
  };
  if (!generatedAssignment) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="text-center p-6">
          <h2 className="text-[18px] font-semibold text-gray-900">No Assignment Generated</h2>
          <p className="text-[13px] text-gray-500 mt-2">Create an assignment to view the output.</p>
          <button onClick={() => setCurrentView("create")}
            className="mt-5 bg-[#1A1A1A] text-white text-[13px] font-medium px-5 h-9 rounded-full hover:bg-[#333] transition-colors">
            ← Back to Create
          </button>
        </div>
      </div>
    );
  }
  const subject = generatedAssignment.subject;
  const grade   = generatedAssignment.class;
  const school  = generatedAssignment.schoolName;
  const aiMsg   = `Certainly, Lakshya! Here are customized Question Paper for your ${grade} ${subject} classes on the NCERT chapters:`;
  return (
    <div className="px-6 py-5 w-full mx-auto max-w-[1100px]">
      {/* ERROR BANNERS */}
      {pdfState === "error" && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[13px]">
          <AlertCircle size={15} />
          {pdfError}
        </div>
      )}
      {generationStatus === "error" && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[13px]">
          <AlertCircle size={15} />
          Regeneration failed. Please try again.
        </div>
      )}
      <div className="rounded-[24px] overflow-hidden shadow-sm flex flex-col">
        
        <div className="bg-[#1D1D1D] px-8 pt-8 pb-[80px] -mb-[50px]">
          <p className="text-[15px] font-medium text-white/90 leading-relaxed max-w-[800px]">
            {aiMsg}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleDownloadPDF}
              disabled={pdfState === "queued" || pdfState === "ready"}
              className="flex items-center gap-2 h-9 px-4 rounded-full bg-white text-gray-900 text-[13px] font-medium hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pdfState === "queued" || pdfState === "ready"
                ? <Loader2 size={14} className="animate-spin" />
                : <Download size={14} />
              }
              {pdfState === "queued" ? "Generating..." : "Download as PDF"}
            </button>
            
            <button
              onClick={handleRegenerate}
              disabled={regenerating || !lastSubmittedData}
              title="Regenerate"
              className="flex items-center gap-2 h-9 px-4 rounded-full border border-white/20 text-white text-[13px] font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={14} className={regenerating ? "animate-spin" : ""} />
              {regenerating ? "Regenerating..." : "Regenerate"}
            </button>
          </div>
        </div>

        <div id="assignment-paper" className="bg-white rounded-[24px] z-10 p-8 md:p-12 min-h-[500px] border border-gray-100">
          
          <div className="text-center pb-8 flex flex-col items-center">
            <h1 className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-tight">
              {generatedAssignment.schoolName}
            </h1>
            <p className="mt-2 text-[15px] text-gray-800 font-medium">
              Subject: {generatedAssignment.subject}
            </p>
            <p className="mt-1 text-[15px] text-gray-800 font-medium">
              Class: {generatedAssignment.class}
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[14px] text-gray-800 font-medium">
            <p>Time Allowed: {generatedAssignment.duration}</p>
            <p>Maximum Marks: {generatedAssignment.maxMarks}</p>
          </div>

          <div className="mt-8">
            <p className="text-[13px] text-gray-600 mb-6 italic">All questions are compulsory unless stated otherwise.</p>
            <div className="max-w-[400px] space-y-4">
              {["Name", "Roll Number", "Class/5th Section"].map((label) => (
                <div key={label} className="flex items-end gap-2">
                  <span className="text-[14px] text-gray-700 font-medium min-w-[130px]">{label}: </span>
                  <div className="flex-1 border-b border-gray-400 border-dashed" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 space-y-10">
            {generatedAssignment.sections.map((section: any, i: number) => (
              <QuestionSection key={i} section={section} />
            ))}
          </div>

          {generatedAssignment.answerKey && generatedAssignment.answerKey.length > 0 && (
            <AnswerKey answerKey={generatedAssignment.answerKey} />
          )}
          
        </div>
      </div>
    </div>
  );
}
