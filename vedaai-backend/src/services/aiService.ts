import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-2.0-flash-001",
];
interface QuestionType {
  title: string;
  questions: number;
  marks: number;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const callGeminiWithRetry = async (
  modelName: string,
  prompt: string,
  maxRetries = 3
): Promise<string> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode ?? 0;
      const isRetryable = status === 503 || status === 429;
      if (isRetryable && attempt < maxRetries) {
        const waitMs = attempt * 8000; // 8s, 16s, 24s
        console.log(
          `[${modelName}] Attempt ${attempt} failed (${status}). Retrying in ${waitMs / 1000}s...`
        );
        await sleep(waitMs);
        continue;
      }
      // Non-retryable or exhausted retries — bubble up
      throw err;
    }
  }
  throw new Error("Exhausted retries");
};
export const generateQuestionPaper = async (
  additionalInfo: string,
  questionTypes: QuestionType[],
  schoolName: string,
  subject: string,
  grade: string
) => {
  // Calculate totals
  const totalMarks = questionTypes.reduce(
    (acc, qt) => acc + qt.questions * qt.marks,
    0
  );
  const totalQuestions = questionTypes.reduce(
    (acc, qt) => acc + qt.questions,
    0
  );
  const estimatedMinutes = Math.max(60, totalQuestions * 3);
  const durationHours = Math.ceil(estimatedMinutes / 60);
  const duration = durationHours === 1 ? "1 Hour" : `${durationHours} Hours`;
  // Build section spec
  const sectionSpec = questionTypes
    .map(
      (qt, i) =>
        `Section ${String.fromCharCode(65 + i)} – ${qt.title}: generate EXACTLY ${qt.questions} question(s), each worth ${qt.marks} mark(s).`
    )
    .join("\n");
  const prompt = `
You are an expert educator. Generate a professional, structured exam question paper.
PAPER DETAILS:
- School: ${schoolName || "ABC Public School"}
- Subject: ${subject || "General Studies"}
- Class / Grade: ${grade || "Grade 10"}
- Total Marks: ${totalMarks}
- Estimated Duration: ${duration}
SECTIONS TO GENERATE:
${sectionSpec}
ADDITIONAL INSTRUCTIONS FROM TEACHER:
${additionalInfo || "None. Use standard difficulty progression."}
STRICT OUTPUT RULES:
1. Return ONLY a valid JSON object — no markdown, no code fences, no explanation text.
2. Each section must contain EXACTLY the number of questions specified.
3. The "difficulty" field must be one of exactly: "easy", "medium", "hard" (lowercase only).
4. Questions must be appropriate for ${grade || "the grade level"} students studying ${subject || "the subject"}.
5. Section titles should follow the format "Section A – [Type Name]".
6. Each section "instruction" should mention how many questions and marks per question.
7. Distribute difficulty: early questions easy, later ones harder within each section.
8. Include an "answerKey" array at the root level. For every question in every section, provide a concise but complete answer. For MCQs include the correct option text. For short/long answers provide a model answer.
JSON STRUCTURE (fill all fields with real content):
{
  "schoolName": "${schoolName || "ABC Public School"}",
  "subject": "${subject || "General Studies"}",
  "class": "${grade || "Grade 10"}",
  "duration": "${duration}",
  "maxMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A – Multiple Choice Questions",
      "instruction": "Attempt all questions. Each question carries 1 mark.",
      "questions": [
        {
          "question": "Full question text here?",
          "difficulty": "easy",
          "marks": 1,
          "options": ["Option A", "Option B", "Option C", "Option D"]
        }
      ]
    }
  ],
  "answerKey": [
    {
      "sectionTitle": "Section A – Multiple Choice Questions",
      "answers": [
        { "questionNo": 1, "answer": "The correct answer text here" }
      ]
    }
  ]
}
`;

  let lastError: any;
  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      console.log(`Trying model: ${modelName}`);
      const text = await callGeminiWithRetry(modelName, prompt, 3);
      // Strip markdown wrapping if any
      const cleaned = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      // Normalise difficulty values to lowercase
      if (parsed.sections && Array.isArray(parsed.sections)) {
        parsed.sections = parsed.sections.map((section: any) => ({
          ...section,
          questions: section.questions.map((q: any) => ({
            ...q,
            difficulty: String(q.difficulty || "medium").toLowerCase(),
          })),
        }));
      }
      console.log(`✅ Generated successfully with: ${modelName}`);
      return parsed;
    } catch (err: any) {
      const status = err?.status ?? 0;
      console.warn(`Model ${modelName} failed (${status}). Trying next...`);
      lastError = err;
    }
  }
  console.error("All models failed:", lastError);
  throw lastError;
};