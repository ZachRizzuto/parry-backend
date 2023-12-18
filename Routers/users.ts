import { PrismaClient } from "@prisma/client";
import Router from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

const prisma = new PrismaClient();

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.send(users);
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