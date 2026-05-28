import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db";
import assignmentRoutes from "./routes/assignmentRoutes";
import "./config/redis";
import "./workers/assignmentWorker";
import "./workers/pdfWorker"; // ← PDF BullMQ worker
import { initSocket } from "./sockets";
const app = express();
const server = http.createServer(app);
// SOCKET
initSocket(server);
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ROUTES
app.use("/api/assignments", assignmentRoutes);
// HEALTH CHECK
app.get("/", (_, res) => {
  res.json({ status: "VedaAI Backend Running", version: "1.0.0" });
});
// DATABASE
connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
