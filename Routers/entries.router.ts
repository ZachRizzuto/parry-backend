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
      createdAt: z.number(),
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
          createdAt: `${timeNow}`,
        },
      });

      return res.status(200).send(newEntry);
    } catch (e) {
      return res.status(500).send({ message: "Sorry couldn't create entry" });
    }
  }
);

entryRouter.get("/:dayId", authMiddleware, async (req, res) => {
  const dayId = parseInt(req.params.dayId);

  const entries = await prisma.entry.findMany({
    where: {
      userId: req.user!.id,
      dayId: dayId,
    },
  });

  if (!entries) return res.status(204).send([]);

  return res.status(200).send(entries);
});

entryRouter.get("/", async (req, res) => {
  const entries = await prisma.entry.findMany();

  if (!entries) return res.status(400).send({ message: "No entries" });

  return res.status(200).send(entries);
});

entryRouter.delete("/:entryId", authMiddleware, async (req, res) => {
  let entryId = parseInt(req.params.entryId);

  const userId = req.user!.id;

  const entry = await prisma.entry.findFirst({
    where: {
      id: entryId,
      userId: userId,
    },
  });

  if (!entry) return res.status(204).send({ message: "Entry doesn't exist" });

  try {
    await prisma.entry.delete({
      where: {
        userId: userId,
        id: entryId,
      },
    });

    return res.status(204).send({ message: "Deleted entry" });
  } catch {
    return res.status(400).send("Couldn't delete entry");
  }
});
