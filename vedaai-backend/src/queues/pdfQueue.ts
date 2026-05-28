import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";
export const pdfQueue = new Queue("pdf-generation", {
  connection: createRedisConnection(),
});
