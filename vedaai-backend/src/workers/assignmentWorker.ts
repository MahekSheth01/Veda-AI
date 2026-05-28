import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { Assignment } from "../models/Assignment";
import { getIO } from "../sockets";
import { generateQuestionPaper } from "../services/aiService";
export const assignmentWorker = new Worker(
    "assignment-generation",
    async (job) => {
        const { assignmentId } = job.data;
        try {
            console.log("Processing Job:", job.id, "| Assignment:", assignmentId);
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                throw new Error(`Assignment not found: ${assignmentId}`);
            }
            assignment.status = "processing";
            await assignment.save();
            const io = getIO();
            io.emit("assignment-processing", { assignmentId });

            const generatedPaper =
                await generateQuestionPaper(
                    assignment.additionalInfo || "",

                    assignment.questionTypes
                        ? assignment.questionTypes.toObject()
                        : [],

                    assignment.schoolName || "",

                    assignment.subject || "",

                    assignment.grade || ""
                );
            assignment.generatedPaper = generatedPaper;
            assignment.status = "completed";
            await assignment.save();
            
            io.emit("assignment-completed", {
                assignmentId: assignment._id,
                generatedPaper,
            });
            console.log("Assignment Generated Successfully:", assignmentId);
        } catch (error) {
            console.error("Worker Error:", error);
            try {
                await Assignment.findByIdAndUpdate(assignmentId, {
                    status: "failed",
                });
            } catch (_) { }
            try {
                const io = getIO();
                io.emit("assignment-failed", { assignmentId });
            } catch (_) { }
        }
    },
    {
        connection: createRedisConnection(),
    }

);