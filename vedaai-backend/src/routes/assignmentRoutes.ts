import { Router } from "express";
import {
  createAssignment,
  getAssignment,
  requestPdfGeneration,
  downloadPdf,
} from "../controllers/assignmentController";
const router = Router();
// NOTE: More specific routes MUST come before /:id to avoid conflicts
// POST   /api/assignments               – Create + queue AI generation
router.post("/", createAssignment);
// GET    /api/assignments/pdf/:jobId    – Download PDF from Redis (MUST be before /:id)
router.get("/pdf/:jobId", downloadPdf);
// GET    /api/assignments/:id           – Fetch assignment (Redis cached)
router.get("/:id", getAssignment);
// POST   /api/assignments/:id/pdf       – Queue BullMQ PDF generation job
router.post("/:id/pdf", requestPdfGeneration);
export default router;