import bcrypt from "bcrypt";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../app";
import {
  createTokenForUser,
  createUnsecuredUserInformation,
  encryptPassword,
  getDataFromAuthToken,
} from "../auth-utils";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateRequest({
    body: z
      .object({
        user: z.string(),
        password: z.string(),
      })
      .strict(),
  }),
  async (req, res) => {
    const user = await prisma.user.findFirst({
      where: {
        user: req.body.user,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.passHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userInformation = createUnsecuredUserInformation(user);
    const token = createTokenForUser(user);

    return res.status(200).json({ token, userInformation });
  }
);

authRouter.post(
  "/login/redirect",
  validateRequest({
    body: z.object({
      token: z.string(),
    }),
  }),
  async (req, res) => {
    const jwtData = getDataFromAuthToken(req.body.token);

    if (!jwtData) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await prisma.user.findUnique({
      where: {
        user: jwtData.user,
      },
    });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    return res.status(200).json({
      user: user.user,
      balance: user.balance,
      calorie_goal: user.calorie_goal,
    });
  }
);

authRouter.post(
  "/signup",
  validateRequest({
    body: z.object({
      user: z.string().min(1),
      password: z.string().min(1),
    }),
  }),
  async (req, res) => {
    const hashedPass = await encryptPassword(req.body.password);

    try {
      const user = await prisma.user.create({
        data: {
          user: req.body.user,
          passHash: hashedPass,
        },
      });

      return res.status(201).send({ message: "Successfully created account" });
    } catch (e) {
      res.status(400).json({
        message: "Couldn't create account",
      });
    }
  }
);
