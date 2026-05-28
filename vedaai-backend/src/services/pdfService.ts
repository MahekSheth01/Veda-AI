import PDFDocument from "pdfkit";
interface Question {
  question: string;
  difficulty: string;
  marks: number;
  options?: string[];
}
interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}
interface AnswerKeyEntry {
  questionNo: number;
  answer: string;
}
interface AnswerKeySection {
  sectionTitle: string;
  answers: AnswerKeyEntry[];
}
interface GeneratedPaper {
  schoolName: string;
  subject: string;
  class: string;
  duration: string;
  maxMarks: number;
  sections: Section[];
  answerKey?: AnswerKeySection[];
}
const cap = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#16a34a",
  medium: "#ca8a04",
  hard: "#dc2626",
};

/**
 * Check if we need a new page, and add one if the remaining space is
 * less than the requested height.
 */
function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > doc.page.height - 60) {
    doc.addPage();
  }
}

export const generateExamPaperPDF = (
  paper: GeneratedPaper
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    const pageW = doc.page.width - 120; // usable width
    const centerOpts = { align: "center" as const, width: pageW };
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#111111")
      .text(paper.schoolName || "School Name", 60, doc.y, centerOpts);
    doc.moveDown(0.3);
    doc
      .fontSize(13)
      .font("Helvetica")
      .fillColor("#444444")
      .text(`Subject: ${paper.subject}    |    Class: ${paper.class}`, 60, doc.y, centerOpts);
    doc.moveDown(0.5);
    // Divider
    doc
      .moveTo(60, doc.y)
      .lineTo(doc.page.width - 60, doc.y)
      .lineWidth(1.5)
      .strokeColor("#111111")
      .stroke();
    doc.moveDown(0.6);
    
    const colW = pageW / 3;
    const startY = doc.y;
    ["Student Name", "Roll Number", "Section"].forEach((label, i) => {
      const x = 60 + i * colW;
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text(label, x, startY, { width: colW - 10 });
      doc
        .moveTo(x, startY + 18)
        .lineTo(x + colW - 15, startY + 18)
        .lineWidth(0.8)
        .strokeColor("#333333")
        .stroke();
    });
    doc.y = startY + 30;
    doc.moveDown(0.8);
    
    const boxTop = doc.y;
    doc
      .roundedRect(60, boxTop, pageW, 36, 6)
      .fillColor("#F5F5F5")
      .fill();
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#111111")
      .text(`Duration: ${paper.duration}`, 75, boxTop + 12, {
        width: pageW / 2 - 20,
      });
    doc
      .font("Helvetica")
      .text(
        `Maximum Marks: ${paper.maxMarks}`,
        60 + pageW / 2,
        boxTop + 12,
        { align: "right", width: pageW / 2 - 15 }
      );
    doc.y = boxTop + 50;

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#111111")
      .text("General Instructions:", 60);
    doc.moveDown(0.2);
    const instructions = [
      "Read all questions carefully before attempting.",
      "Marks are indicated beside each question in [ ].",
      "Attempt all required questions in each section.",
      "Maintain neat handwriting throughout.",
    ];
    instructions.forEach((inst) => {
      doc
        .fontSize(9.5)
        .font("Helvetica")
        .fillColor("#444444")
        .text(`• ${inst}`, 70, doc.y, { width: pageW - 10 });
    });
    doc.moveDown(0.8);
    
    paper.sections.forEach((section) => {
      ensureSpace(doc, 80);
      // Section header divider
      doc
        .moveTo(60, doc.y)
        .lineTo(doc.page.width - 60, doc.y)
        .lineWidth(1)
        .strokeColor("#CCCCCC")
        .stroke();
      doc.moveDown(0.4);
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#111111")
        .text(section.title, 60, doc.y, { width: pageW });
      doc.moveDown(0.15);
      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .fillColor("#666666")
        .text(section.instruction, 60, doc.y, { width: pageW });
      doc.moveDown(0.5);
      // Questions
      section.questions.forEach((q, i) => {
        const diff = (q.difficulty || "medium").toLowerCase();
        const diffColor = DIFFICULTY_COLORS[diff] ?? "#555555";
        const marksLabel = `[${q.marks} ${q.marks === 1 ? "Mark" : "Marks"}]`;
        const questionText = `Q${i + 1}. ${q.question}  ${marksLabel}`;
        // Estimate needed height: rough approximation
        ensureSpace(doc, 60);
        const qY = doc.y;
        // Render question number bold, then question text regular
        doc
          .fontSize(10.5)
          .font("Helvetica-Bold")
          .fillColor("#111111")
          .text(`Q${i + 1}. `, 60, qY, { continued: true });
        doc
          .font("Helvetica")
          .text(`${q.question}  `, { continued: true, width: pageW - 10 });
        doc
          .font("Helvetica-Bold")
          .text(marksLabel, { continued: false });
        doc.moveDown(0.15);
        // Difficulty badge
        doc
          .fontSize(8.5)
          .font("Helvetica-Bold")
          .fillColor(diffColor)
          .text(`[${cap(diff)}]`, 75, doc.y, { width: pageW - 15 });
        // MCQ options (if present)
        if (q.options && q.options.length > 0) {
          doc.moveDown(0.15);
          const optLabels = ["(A)", "(B)", "(C)", "(D)"];
          q.options.forEach((opt: string, oi: number) => {
            doc
              .fontSize(9.5)
              .font("Helvetica")
              .fillColor("#333333")
              .text(`    ${optLabels[oi] ?? `(${oi + 1})`}  ${opt}`, 80, doc.y, {
                width: pageW - 20,
              });
          });
        }
        doc.moveDown(0.6);
      });
    });

    if (paper.answerKey && paper.answerKey.length > 0) {
      doc.addPage();
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .fillColor("#111111")
        .text("Answer Key", 60, 60, { align: "center", width: pageW });
      doc
        .moveTo(60, doc.y + 8)
        .lineTo(doc.page.width - 60, doc.y + 8)
        .lineWidth(1)
        .strokeColor("#CCCCCC")
        .stroke();
      doc.y += 20;
      paper.answerKey.forEach((section) => {
        doc.moveDown(0.5);
        ensureSpace(doc, 40);
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor("#333333")
          .text(section.sectionTitle, 60, doc.y, { width: pageW });
        doc.moveDown(0.3);
        section.answers.forEach((ans) => {
          ensureSpace(doc, 30);
          doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .fillColor("#111111")
            .text(`Q${ans.questionNo}. `, 60, doc.y, { continued: true });
          doc
            .font("Helvetica")
            .fillColor("#333333")
            .text(ans.answer, { width: pageW - 30 });
          doc.moveDown(0.4);
        });
      });
      // End marker
      doc.moveDown(1);
      doc
        .fontSize(8.5)
        .font("Helvetica-Oblique")
        .fillColor("#AAAAAA")
        .text("— End of Question Paper —", 60, doc.y, {
          align: "center",
          width: pageW,
        });
    }

    const footerY = doc.page.height - 35;
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#AAAAAA")
      .text("Generated by VedaAI", 60, footerY, {
        align: "center",
        width: pageW,
      });
    doc.end();
  });
};

