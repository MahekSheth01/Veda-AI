'use client';

import React, { useState, useEffect } from 'react';
import styles from './CreateAssignment.module.css';
import { UploadCloud, X, Plus, CalendarPlus, ArrowLeft, ArrowRight, Mic, ChevronDown, Minus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAssignmentStore } from '../../store/assignmentStore';
import { api } from '../../services/api';

interface FormData {
  schoolName: string;
  subject: string;
  grade: string;
  dueDate: string;
  additionalInfo: string;
}

export default function CreateAssignment() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const [file, setFile] = useState<File | null>(null);
  
  const {
    questionTypes,
    addQuestionType,
    updateQuestionType,
    removeQuestionType,
    generationStatus,
    setGenerationStatus,
    setLastSubmittedData,
  } = useAssignmentStore();

  const totalQuestions = questionTypes.reduce((s, q) => s + q.questions, 0);
  const totalMarks = questionTypes.reduce((s, q) => s + q.questions * q.marks, 0);

  useEffect(() => {
    if (generationStatus === "loading") {
      setGenerationStatus("idle");
    }
  }, [generationStatus, setGenerationStatus]);

  const onSubmit = async (data: FormData) => {
    if (questionTypes.length === 0) {
      alert("Please add at least one question type.");
      return;
    }
    try {
      setGenerationStatus("loading");
      const payload = {
        schoolName: data.schoolName || "Delhi Public School",
        subject: data.subject || "General Subject",
        grade: data.grade || "10th Grade",
        dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        additionalInfo: data.additionalInfo || "No additional instructions provided.",
        questionTypes: questionTypes.map(({ title, questions, marks }) => ({ title, questions, marks })),
      };
      setLastSubmittedData({ ...payload, questionTypes });
      
      const response = await api.post("/assignments", payload);
      const pendingAssignment = response.data.assignment;
      
      const newAssignmentStore = useAssignmentStore.getState();
      newAssignmentStore.setCurrentAssignmentId(pendingAssignment._id);
      newAssignmentStore.addAssignment({
        _id: pendingAssignment._id,
        schoolName: pendingAssignment.schoolName,
        subject: pendingAssignment.subject,
        grade: pendingAssignment.grade,
        dueDate: pendingAssignment.dueDate,
        createdAt: pendingAssignment.createdAt || new Date().toISOString(),
        status: "pending"
      });

      import('../../services/socket').then(({ socket }) => {
        const onComplete = (socketData: any) => {
          if (socketData.assignmentId === pendingAssignment._id) {
            newAssignmentStore.setGeneratedAssignment(socketData.generatedPaper);
            newAssignmentStore.addAssignment({
              _id: pendingAssignment._id,
              schoolName: pendingAssignment.schoolName,
              subject: pendingAssignment.subject,
              grade: pendingAssignment.grade,
              dueDate: pendingAssignment.dueDate,
              createdAt: pendingAssignment.createdAt || new Date().toISOString(),
              status: "completed"
            });
            newAssignmentStore.setGenerationStatus("completed");
            socket.off("assignment-completed", onComplete);
            socket.off("assignment-failed", onFailed);
            router.push('/assignments/output');
          }
        };

        const onFailed = (socketData: any) => {
          if (socketData.assignmentId === pendingAssignment._id) {
            setGenerationStatus("error");
            alert("Assignment generation failed (API Rate Limit Exceeded). Please try again later.");
            socket.off("assignment-completed", onComplete);
            socket.off("assignment-failed", onFailed);
          }
        };

        socket.on("assignment-completed", onComplete);
        socket.on("assignment-failed", onFailed);
      });

    } catch (err) {
      console.error(err);
      setGenerationStatus("error");
      alert("Generation request failed.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Fullscreen Loading Overlay */}
      {generationStatus === "loading" && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingSpinner}>
              <Loader2 size={40} className={styles.spinnerIcon} />
            </div>
            <h2 className={styles.loadingTitle}>Generating Assignment</h2>
            <p className={styles.loadingSubtitle}>Our AI is crafting your question paper. This may take a moment...</p>
            <div className={styles.loadingDots}>
              <span className={styles.dot1}></span>
              <span className={styles.dot2}></span>
              <span className={styles.dot3}></span>
            </div>
          </div>
        </div>
      )}
      {/* Top Header Block */}
      <div className={styles.headerBlock}>
        <div className={styles.titleWrapper}>
          <div className={styles.greenDot}></div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Create Assignment</h1>
            <p className={styles.subtitle}>Set up a new assignment for your students</p>
          </div>
        </div>
      </div>

      <div className={styles.mobileHeader}>
        <button type="button" onClick={() => router.push('/assignments')} className={styles.mobileBackBtn}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.mobileTitle}>Create Assignment</h1>
        <div style={{ width: 40 }}></div>
      </div>

      {/* Progress Line */}
      <div className={styles.progressLineWrapper}>
        <div className={styles.progressLineContainer}>
          <div className={styles.progressSegmentActive}></div>
          <div className={styles.progressSegmentInactive}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
        {/* Assignment Details Header */}
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Assignment Details</h2>
          <p className={styles.formSubtitle}>Basic information about your assignment</p>
        </div>

        <div className={styles.formBody}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <div className={styles.uploadBox} onClick={() => document.getElementById("file-input")?.click()}>
              <div className={styles.uploadIconWrap}>
                <UploadCloud size={24} color="#1E1E1E" />
              </div>
              <div className={styles.uploadTextGroup}>
                <span className={styles.uploadMainText}>Choose a file or drag & drop it here</span>
                <span className={styles.uploadSubText}>JPEG, PNG, upto 10MB</span>
              </div>
              <button type="button" className={styles.browseBtn}>Browse</button>
            </div>
            <span className={styles.uploadLabelText}>Upload images of your preferred document/image</span>
            <input
              id="file-input" type="file" accept=".pdf,.txt,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className={styles.basicInputsGrid}>
            <div className={styles.basicInputRow}>
              <span className={styles.uploadLabelText}>School Name</span>
              <input type="text" {...register("schoolName")} required placeholder="e.g. DPS Bokaro" className={styles.basicInput} />
            </div>
            <div className={styles.basicInputRow}>
              <span className={styles.uploadLabelText}>Subject</span>
              <input type="text" {...register("subject")} required placeholder="e.g. Mathematics" className={styles.basicInput} />
            </div>
            <div className={styles.basicInputRow}>
              <span className={styles.uploadLabelText}>Class</span>
              <input type="text" {...register("grade")} required placeholder="e.g. Class 10" className={styles.basicInput} />
            </div>
          </div>

          {/* Due Date */}
          <div className={styles.dueDateRow}>
            <div className={styles.dueDateCol}>
              <span className={styles.dueDateLabel}>Due Date</span>
              <div className={styles.dueDateInputWrapper}>
                <input type="date" id="dueDateInput" {...register("dueDate")} required className={styles.dueDateInput} placeholder="DD-MM-YYYY" />
                <CalendarPlus size={24} color="#A9A9A9" style={{ cursor: 'pointer' }} onClick={() => (document.getElementById('dueDateInput') as HTMLInputElement)?.showPicker()} />
              </div>
            </div>
          </div>

          {/* Question Types Grid */}
          <div className={styles.qtSection}>
            <div className={styles.qtDesktopView}>
              {/* Types Left Column */}
              <div className={styles.qtColLeft}>
                <span className={styles.qtLabel}>Question Type</span>
                
                {questionTypes.map((qt) => (
                  <div key={qt.id} className={styles.qtItemRow}>
                    <div className={styles.qtSelectorWrapper}>
                      <select 
                        className={styles.qtSelector}
                        value={qt.title}
                        onChange={(e) => updateQuestionType(qt.id, "title", e.target.value)}
                      >
                        <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                        <option value="Short Questions">Short Questions</option>
                        <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                        <option value="Numerical Problems">Numerical Problems</option>
                      </select>
                      <button type="button" className={styles.qtRemoveBtn} onClick={() => removeQuestionType(qt.id)}>
                        <X size={12} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className={styles.qtAddBtnWrapper}>
                  <button type="button" className={styles.qtAddBtn} onClick={addQuestionType}>
                    <Plus size={16} color="#FFF" />
                  </button>
                  <button type="button" className={styles.qtAddText} onClick={addQuestionType}>
                    Add Question Type
                  </button>
                </div>
              </div>

              {/* Counters Right Column */}
              <div className={styles.countersGrid}>
                <div className={styles.counterCol}>
                  <span className={styles.counterHeader}>No. of Questions</span>
                  {questionTypes.map(qt => (
                    <div key={`q-${qt.id}`} className={styles.counterBox}>
                      <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "questions", Math.max(1, qt.questions - 1))}><Minus size={12} /></button>
                      <span className={styles.counterVal}>{qt.questions}</span>
                      <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "questions", qt.questions + 1)}><Plus size={12} /></button>
                    </div>
                  ))}
                </div>
                
                <div className={styles.counterCol}>
                  <span className={styles.counterHeader}>Marks</span>
                  {questionTypes.map(qt => (
                    <div key={`m-${qt.id}`} className={styles.counterBox}>
                      <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "marks", Math.max(1, qt.marks - 1))}><Minus size={12} /></button>
                      <span className={styles.counterVal}>{qt.marks}</span>
                      <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "marks", qt.marks + 1)}><Plus size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.qtMobileView}>
              <span className={styles.qtLabel}>Question Type</span>
              {questionTypes.map((qt) => (
                <div key={`mob-${qt.id}`} className={styles.qtMobileCard}>
                  <div className={styles.qtMobileDropdownRow}>
                    <select 
                      className={styles.qtSelector}
                      value={qt.title}
                      onChange={(e) => updateQuestionType(qt.id, "title", e.target.value)}
                    >
                      <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                      <option value="Short Questions">Short Questions</option>
                      <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                      <option value="Numerical Problems">Numerical Problems</option>
                    </select>
                    <button type="button" className={styles.qtRemoveBtn} onClick={() => removeQuestionType(qt.id)}>
                      <X size={12} strokeWidth={2} />
                    </button>
                  </div>
                  <div className={styles.qtMobileCountersBox}>
                    <div className={styles.qtMobileCounterCol}>
                      <span className={styles.qtMobileCounterLabel}>No. of Questions</span>
                      <div className={styles.qtMobileCounterControls}>
                        <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "questions", Math.max(1, qt.questions - 1))}><Minus size={12} /></button>
                        <span className={styles.counterVal}>{qt.questions}</span>
                        <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "questions", qt.questions + 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                    <div className={styles.qtMobileCounterCol}>
                      <span className={styles.qtMobileCounterLabel}>Marks</span>
                      <div className={styles.qtMobileCounterControls}>
                        <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "marks", Math.max(1, qt.marks - 1))}><Minus size={12} /></button>
                        <span className={styles.counterVal}>{qt.marks}</span>
                        <button type="button" className={styles.counterBtn} onClick={() => updateQuestionType(qt.id, "marks", qt.marks + 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.qtMobileAddWrapper}>
                <button type="button" className={styles.qtAddBtn} onClick={addQuestionType}>
                  <Plus size={16} color="#FFF" />
                </button>
                <button type="button" className={styles.qtAddText} onClick={addQuestionType}>
                  Add Question Type
                </button>
              </div>
            </div>

            <div className={styles.totalsBlock}>
              <div className={styles.totalText}>Total Questions : {totalQuestions}</div>
              <div className={styles.totalText}>Total Marks : {totalMarks}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className={styles.addInfoSection}>
            <span className={styles.addInfoLabel}>Additional Information (For better output)</span>
            <div className={styles.addInfoTextareaWrapper}>
              <textarea 
                className={styles.addInfoTextarea}
                {...register("additionalInfo")}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
              ></textarea>
              <button type="button" className={styles.micBtn}>
                <Mic size={16} color="#303030" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={styles.bottomActionBar}>
          <button type="button" className={styles.prevBtn} onClick={() => router.push('/assignments')}>
            <ArrowLeft size={16} /> Previous
          </button>
          
          <button type="submit" disabled={generationStatus === "loading"} className={styles.nextBtn}>
            {generationStatus === "loading" ? "Generating..." : "Next"} <ArrowRight size={16} />
          </button>
        </div>

      </form>
    </div>
  );
}
