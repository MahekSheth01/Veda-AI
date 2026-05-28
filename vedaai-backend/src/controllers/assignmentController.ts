import { Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { assignmentQueue } from "../queues/assignmentQueue";
import { pdfQueue } from "../queues/pdfQueue";
import { redis } from "../config/redis";
import crypto from "crypto";
// ── CREATE ASSIGNMENT ─────────────────────────────────────────
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const {
      schoolName,
      subject,
      grade,
      dueDate,
      additionalInfo,
      questionTypes,
    } = req.body;
    if (!dueDate) {
      return res.status(400).json({ success: false, message: "Due date is required" });
    }
    if (!questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
      return res.status(400).json({ success: false, message: "At least one question type is required" });
    }
    const assignment = await Assignment.create({
      schoolName: schoolName || "",
      subject: subject || "",
      grade: grade || "",
      dueDate,
      additionalInfo: additionalInfo || "",
      questionTypes,
      status: "pending",
    });
    await assignmentQueue.add("generate-paper", {
      assignmentId: assignment._id,
    });
    return res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error("createAssignment Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create assignment" });
  }
};
// ── GET ASSIGNMENT ────────────────────────────────────────────
export const getAssignment = async (req: Request, res: Response) => {
  try {
    // Check Redis cache first
    const cacheKey = `assignment:${req.params.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, assignment: JSON.parse(cached), fromCache: true });
    }
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }
    // Cache completed assignments for 5 minutes
    if (assignment.status === "completed") {
      await redis.set(cacheKey, JSON.stringify(assignment), "EX", 300);
    }
    return res.status(200).json({ success: true, assignment });
  } catch (error) {
    console.error("getAssignment Error:", error);
    return res.status(500).json({ success: false, message: "Failed to get assignment" });
  }
};
// ── REQUEST PDF GENERATION (adds BullMQ job) ──────────────────
export const requestPdfGeneration = async (req: Request, res: Response) => {
  try {
    const { id: assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }
    if (!assignment.generatedPaper) {
      return res.status(400).json({ success: false, message: "Assignment not yet generated" });
    }
    // Unique job ID for tracking this specific PDF request
    const jobId = crypto.randomUUID();
    // Add to BullMQ PDF queue
    await pdfQueue.add("generate-pdf", { assignmentId, jobId });
    console.log(`PDF job queued: ${jobId} for assignment: ${assignmentId}`);
    return res.status(202).json({ success: true, jobId });
  } catch (error) {
    console.error("requestPdfGeneration Error:", error);
    return res.status(500).json({ success: false, message: "Failed to queue PDF generation" });
  }
};
// ── DOWNLOAD PDF (served from Redis) ─────────────────────────
export const downloadPdf = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const redisKey = `pdf:${jobId}`;
    const base64 = await redis.get(redisKey);
    if (!base64) {
      return res.status(404).json({
        success: false,
        message: "PDF not found or expired. Please regenerate.",
      });
    }
    const pdfBuffer = Buffer.from(base64, "base64");
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="assignment-${jobId.slice(0, 8)}.pdf"`,
      "Content-Length": pdfBuffer.length.toString(),
    });
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("downloadPdf Error:", error);
    return res.status(500).json({ success: false, message: "Failed to download PDF" });
  }
};
