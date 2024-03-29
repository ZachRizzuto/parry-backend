import { PrismaClient } from "@prisma/client";
import Router from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../auth-utils";

const prisma = new PrismaClient();

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).send(users);
});

userRouter.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  if (user === null) {
    res.status(404).send({ error: "No Content" });
  } else res.send(user);
});

userRouter.patch(
  "/:user/balance",
  authMiddleware,
  validateRequest({
    body: z.object({
      balance: z.number(),
    }),
  }),
  async (req, res) => {
    try {
      await prisma.user.update({
        where: {
          id: req.user!.id,
        },
        data: {
          balance: req.body.balance,
        },
      });

      return res.status(201).send({ message: "Updated balance" });
    } catch (e) {
      res.status(400).send({ message: "Couldn't edit balance " });
    }
  }
);

userRouter.patch(
  "/:user/calorie_goal",
  authMiddleware,
  validateRequest({
    body: z.object({
      calorie_goal: z.number(),
    }),
  }),
  async (req, res) => {
    try {
      await prisma.user.update({
        where: {
          id: req.user!.id,
        },
        data: {
          calorie_goal: req.body.calorie_goal,
        },
      });

      return res.status(201).send({ message: "Updated calorie goal" });
    } catch (e) {
      res.status(400).send({ message: "Couldn't edit calorie_goal " });
    }
  }
);
