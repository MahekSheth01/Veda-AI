'use client';

import React, { useEffect, useState } from 'react';
import styles from './AssignmentOutput.module.css';
import { Download, Loader2, AlertCircle, RefreshCcw, ArrowLeft, Plus, Grid, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../store/assignmentStore';
import { api, API_BASE_URL } from '../../services/api';
import { socket } from '../../services/socket';

type PdfState = "idle" | "queued" | "ready" | "error";

export default function AssignmentOutput() {
  const router = useRouter();
  const { generatedAssignment, currentAssignmentId } = useAssignmentStore();
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
      setPdfError("Assignment ID missing.");
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

  const handleRegenerate = () => {
    router.push('/assignments/create');
  };

  const getDifficultyClass = (difficulty: string) => {
    const diff = difficulty?.toLowerCase() || "";
    if (diff === "easy") return styles.difficultyEasy;
    if (diff === "medium" || diff === "moderate") return styles.difficultyMedium;
    if (diff === "hard" || diff === "challenging") return styles.difficultyHard;
    return styles.difficultyMedium; 
  };

  if (!generatedAssignment) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
        <div style={{ textAlign: 'center', padding: 24, background: '#FFF', borderRadius: 24 }}>
          <h2>No Assignment Generated</h2>
          <p style={{ color: '#5E5E5E', marginTop: 8 }}>Please create an assignment to view the output.</p>
          <Link href="/assignments/create">
            <button className={styles.downloadBtn} style={{ marginTop: 24, marginInline: 'auto', background: '#303030', color: '#FFF' }}>
              &larr; Back to Create
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const aiMsg = `Certainly, Lakshya! Here are customized Question Paper for your ${generatedAssignment.class} ${generatedAssignment.subject} classes:`;

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.container}>
        {pdfState === "error" && (
          <div style={{ padding: 12, backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: 8, width: '100%', maxWidth: 1060, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} />
            {pdfError}
          </div>
        )}

      <div className={styles.successBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTextWrapper}>
            <p className={styles.bannerText}>{aiMsg}</p>
          </div>
          <div className={styles.actionBar}>
            <button 
              onClick={handleDownloadPDF}
              disabled={pdfState === "queued" || pdfState === "ready"}
              className={styles.downloadBtn}
            >
              {(pdfState === "queued" || pdfState === "ready") ? <Loader2 size={16} color="#303030" className="animate-spin" /> : <Download size={16} color="#303030" />}
              <span className={styles.downloadBtnText}>
                {pdfState === "queued" ? "Generating..." : "Download as PDF"}
              </span>
            </button>
            <button 
              onClick={handleRegenerate}
              className={styles.regenerateBtn}
            >
              <RefreshCcw size={16} />
              Regenerate
            </button>
          </div>
        </div>
      </div>

      <div className={styles.documentPreview}>
        <h1 className={styles.docHeaderTitle}>
          {generatedAssignment.schoolName}<br/>
          Subject: {generatedAssignment.subject}<br/>
          Class: {generatedAssignment.class}
        </h1>

        <div className={styles.docMeta}>
          <p className={styles.docMetaText}>Time Allowed: {generatedAssignment.duration}</p>
          <p className={styles.docMetaText}>Maximum Marks: {generatedAssignment.maxMarks}</p>
        </div>

        <p className={styles.docInstruction}>All questions are compulsory unless stated otherwise.</p>

        <div className={styles.studentInfo}>
          <span className={styles.studentInfoText}>Name: ______________________</span>
          <span className={styles.studentInfoText}>Roll Number: ________________</span>
          <span className={styles.studentInfoText}>Class: {generatedAssignment.class} &nbsp;&nbsp; Section: __________</span>
        </div>

        {generatedAssignment.sections && generatedAssignment.sections.map((section: any, sIndex: number) => (
          <div key={sIndex} className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <h3 className={styles.sectionSubtitle}>{section.instruction}</h3>

            <div className={styles.questionsList}>
              {section.questions.map((q: any, qIndex: number) => (
                <div key={qIndex} className={styles.questionItem}>
                  <div className={styles.questionTextWrapper}>
                    <span className={`${styles.difficultyBadge} ${getDifficultyClass(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    <span>
                      {qIndex + 1}. {q.question} 
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                    </span>
                  </div>
                  {q.options && q.options.length > 0 && (
                    <ol className={styles.optionsList}>
                      {q.options.map((opt: string, oIndex: number) => (
                        <li key={oIndex}>{opt}</li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {generatedAssignment.answerKey && generatedAssignment.answerKey.length > 0 && (
          <div className={styles.answerKeySection}>
            <h3 className={styles.answerKeyTitle}>Answer Key</h3>
            {generatedAssignment.answerKey.map((akSection: any, i: number) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>{akSection.sectionTitle}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {akSection.answers.map((ans: any, j: number) => (
                    <div key={j} className={styles.answerKeyItem}>
                      <span style={{ fontWeight: 600, marginRight: 8 }}>Q{ans.questionNo}:</span>
                      <span>{ans.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
