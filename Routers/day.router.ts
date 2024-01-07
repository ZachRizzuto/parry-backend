import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../app";
import { authMiddleware } from "../auth-utils";

export const dayRouter = Router();

dayRouter.get("/", authMiddleware, async (req, res) => {
  const days = await prisma.day.findMany({
    where: {
      userId: req.user!.id,
    },
  });
  return res.status(200).send(days);
});

dayRouter.get("/:date", authMiddleware, async (req, res) => {
  const day = await prisma.day.findFirst({
    where: {
      date: req.params.date,
      userId: req.user!.id,
    },
  });

  if (!day) {
    return res.status(204).send(undefined);
  }

  return res.status(200).send(day);
});

dayRouter.get("/:userId", authMiddleware, async (req, res) => {
  req.params.userId = req.user!.id.toString();
  6;

  // req.params.userId = req.user!.id.toString();

  const days = await prisma.day.findMany({
    where: {
      userId: +req.params.userId,
    },
  });

  if (days.length === 0)
    return res
      .status(400)
      .send({ message: "No days for this user or user doesn't exist" });

  return res.status(200).send(days);
});

dayRouter.post(
  "/",
  authMiddleware,
  validateRequest({
    body: z.object({
      date: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      const day = await prisma.day.create({
        data: {
          date: req.body.date,
          userId: req.user!.id,
        },
      });

      return res.status(201).send(day);
    } catch (e) {
      return res.status(400).send({ message: "Couldn't create day" });
    }
  }
);
