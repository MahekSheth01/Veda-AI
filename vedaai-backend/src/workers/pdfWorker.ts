import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { Assignment } from "../models/Assignment";
import { getIO } from "../sockets";
import { generateExamPaperPDF } from "../services/pdfService";
// PDF is stored in Redis for 15 minutes (enough time to download)
const PDF_TTL_SECONDS = 900;
export const pdfWorker = new Worker(
  "pdf-generation",
  async (job) => {
    const { assignmentId, jobId } = job.data;
    try {
      console.log(`PDF Job ${jobId} | Assignment: ${assignmentId}`);
      // Fetch assignment with generated paper
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment not found: ${assignmentId}`);
      }
      if (!assignment.generatedPaper) {
        throw new Error(`No generated paper for assignment: ${assignmentId}`);
      }
      // Generate PDF buffer using pdfkit
      const pdfBuffer = await generateExamPaperPDF(
        assignment.generatedPaper as any
      );
      // Store PDF in Redis as base64 with TTL
      const redisKey = `pdf:${jobId}`;
      const redisClient = createRedisConnection();
      await redisClient.set(
        redisKey,
        pdfBuffer.toString("base64"),
        "EX",
        PDF_TTL_SECONDS
      );
      console.log(
        `PDF stored in Redis: ${redisKey} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`
      );
      redisClient.quit();
      // Notify frontend that PDF is ready
      const io = getIO();
      io.emit("pdf-ready", {
        jobId,
        assignmentId,
      });
      console.log(`PDF Job ${jobId} completed ✅`);
    } catch (error) {
      console.error(`PDF Worker Error [${jobId}]:`, error);
      // Notify frontend of failure
      try {
        const io = getIO();
        io.emit("pdf-failed", { jobId, assignmentId });
      } catch (_) {}
    }
  },
  {
    connection: createRedisConnection(),
  }
);
