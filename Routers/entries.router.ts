import { Router } from "express";
import { prisma, timeNow } from "../app";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authMiddleware } from "../auth-utils";

export const entryRouter = Router();

entryRouter.post(
  "/",
  authMiddleware,
  validateRequest({
    body: z.object({
      createdAt: z.bigint(),
      foodId: z.number(),
      dayId: z.number(),
    }),
  }),
  async (req, res) => {
    try {
      const newEntry = await prisma.entry.create({
        data: {
          userId: req.user!.id,
          foodId: req.body.foodId,
          dayId: req.body.dayId,
          createdAt: timeNow.toString(),
        },
      });

      return res.status(200).send(newEntry);
    } catch (e) {
      return res.status(500).send({ message: "Sorry couldn't create entry" });
    }
  }
);

entryRouter.get("/:userId/:dayId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const dayId = parseInt(req.params.dayId);

  const entries = await prisma.entry.findMany({
    where: {
      userId: userId,
      dayId: dayId,
    },
  });

  if (!entries)
    return res.status(400).send({ message: "Couldn't get entries" });

  return res.status(200).send(entries);
});

entryRouter.get("/", async (req, res) => {
  const entries = await prisma.entry.findMany();

  if (!entries) return res.status(400).send({ message: "No entries" });

  return res.status(200).send(entries);
});
