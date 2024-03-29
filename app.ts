import { PrismaClient, User } from "@prisma/client";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import { authRouter } from "./Routers/auth.router";
import { dayRouter } from "./Routers/day.router";
import { entryRouter } from "./Routers/entries.router";
import { foodRouter } from "./Routers/foods";
import { userRouter } from "./Routers/users";

configDotenv();

const date = new Date();

export const formatedDate = `${
  date.getMonth() + 1
}-${date.getDay()}-${date.getFullYear()}`;

export const timeNow = date.getTime();

export const getTimeNow = () => {
  const date = new Date();

  return date.getTime();
};

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

if (!process.env.JWT_SECRET) {
  throw new Error("Missing evironment variables");
}

export const jwtSecret = process.env.JWT_SECRET;

export const prisma = new PrismaClient();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Whats Up!</h1>");
});

app.use("/entries", entryRouter);

app.use("/days", dayRouter);

app.use("/users", userRouter);

app.use("/foods", foodRouter);

app.use("/auth", authRouter);

app.listen(3001);

export {};
