import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma, jwtSecret } from "./app";
const saltRounds = 11;

export const encryptPassword = async (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const createUnsecuredUserInformation = (user: User) => ({
  user: user.user,
});

export const createTokenForUser = (user: User) => {
  const userInfo = {
    user: user.user,
  };

  return jwt.sign(userInfo, jwtSecret);
};

const jwtInfoSchema = z.object({
  user: z.string(),
  iat: z.number(),
});

export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwtInfoSchema.parse(jwt.verify(token, jwtSecret));
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split?.(" ") || [];
  const myJwtData = getDataFromAuthToken(token);

  if (!myJwtData) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const userFromJwt = await prisma.user.findFirst({
    where: {
      user: myJwtData.user,
    },
  });

  if (!userFromJwt) {
    return res.status(401).send({ message: "User not found" });
  }

  req.user = userFromJwt;

  next();
};
