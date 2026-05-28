import Redis from "ioredis";

// This file is imported by both server and workers.
// Make sure dotenv is loaded in ALL execution contexts.
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error(
    "Missing REDIS_URL. Please set it in vedaai-backend/.env"
  );
}

export const createRedisConnection = () => {
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    tls: redisUrl.startsWith("rediss://") ? {} : undefined,
    enableReadyCheck: true,
  });
};

export const redis = createRedisConnection();



redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("ready", () => {
  console.log("Redis Ready");
});

redis.on("error", (err) => {
  console.error(
    "Redis Error:",
    err
  );
});