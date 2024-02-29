import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { getTimeNow, prisma, timeNow } from "../app";
import { authMiddleware } from "../auth-utils";

export const entryRouter = Router();

entryRouter.post(
  "/",
  authMiddleware,
  validateRequest({
    body: z.object({
      dayId: z.number(),
      mealType: z.string(),
      mealName: z.string(),
      foodsIds: z.array(z.number()),
    }),
  }),
  async (req, res) => {
    const foods = req.body.foodsIds;
    try {
      const newEntry = await prisma.entry.create({
        data: {
          userId: req.user!.id,
          dayId: req.body.dayId,
          createdAt: `${getTimeNow()}`,
          mealType: req.body.mealType,
          mealName: req.body.mealName,
          foods: {
            create: foods.map((foodId) => ({
              food: {
                connect: {
                  id: foodId,
                },
              },
            })),
          },
        },
        include: {
          foods: {
            include: {
              food: true,
            },
          },
        },
      });

      return res.status(201).send(newEntry);
    } catch (e) {
      return res.status(500).send({ message: e });
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
    include: {
      foods: {
        include: {
          food: true,
        },
      },
    },
  });

  if (!entries) return res.status(204).send([]);

  return res.status(200).send(entries);
});

entryRouter.get("/", authMiddleware, async (req, res) => {
  const entries = await prisma.entry.findMany({
    where: {
      userId: req.user!.id,
    },
  });

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
    await prisma.foodEntry.deleteMany({
      where: {
        entryId: entry.id,
      },
    });

    await prisma.entry.delete({
      where: {
        userId: userId,
        id: entryId,
      },
    });

    return res.status(204).send({ message: "Deleted entry" });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
});
