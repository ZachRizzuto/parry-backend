import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../app";

export const foodRouter = Router();

foodRouter.get("/", async (req, res) => {
  const foods = await prisma.food.findMany();

  if (!foods) return res.status(204).send({ message: "Couldn't get foods" });

  return res.status(200).send(foods);
});

foodRouter.post(
  "/",
  validateRequest({
    body: z
      .object({
        food: z.string(),
        calories: z.number(),
        amount: z.string(),
      })
      .strict(),
  }),
  async (req, res) => {
    try {
      const food = await prisma.food.create({
        data: {
          food: req.body.food,
          calories: +req.body.calories,
          amount: req.body.amount,
        },
      });

      return res.status(201).send(food);
    } catch (e) {
      return res.status(500);
    }
  }
);
