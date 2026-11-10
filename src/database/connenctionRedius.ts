import { createClient } from "redis";
import { env } from "../config/env.service";

export const clientRedius = createClient({
  url: env.redisConnection as string,
});

export const connectRS = async () => {
  try {
    await clientRedius.connect();
    console.log("Connected to redis");
  } catch (error) {
    console.error("Error connecting to redis", error);
  }
};