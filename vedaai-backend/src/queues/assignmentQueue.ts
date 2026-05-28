import { Queue } from "bullmq";

import { createRedisConnection } from "../config/redis";

export const assignmentQueue =
  new Queue(
    "assignment-generation",
    {
      connection: createRedisConnection(),
    }
  );