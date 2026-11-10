import dotenv, { config } from "dotenv";

import path from "path";

config({ path: path.resolve(__dirname, `../../${process.env.NODE_ENV}.env`) });

const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV || "dev";
const salt = process.env.SALT;
const adminSignature = process.env.ADMIN_SIGNATURE;
const userSignature = process.env.USER_SIGNATURE;
const adminRefreshSignature = process.env.ADMIN_REFRESH_SIGNATURE;
const userRefreshSignature = process.env.USER_REFRESH_SIGNATURE;
const googleAccount = process.env.GOOGLE_ACCOUNT;
const passwordAccount = process.env.PASSWORD_ACCOUNT;
const databaseUrl = process.env.Database_URL;
const serverUrl = process.env.SERVER_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const iterations = process.env.ITERATIONS;
const redisConnection = process.env.REDIS_CONNECTION;
const awsRegion = process.env.AWS_REGION as string;
const awsBucketName = process.env.AWS_BUCKET_NAME as string;

export const env = {
  port,
  nodeEnv,
  salt,
  adminSignature,
  userSignature,
  adminRefreshSignature,
  userRefreshSignature,
  googleAccount,
  passwordAccount,
  databaseUrl,
  serverUrl,
  googleClientId,
  jwtSecret,
  jwtExpiresIn,
  iterations,
  redisConnection,
  awsRegion,
  awsBucketName,
};