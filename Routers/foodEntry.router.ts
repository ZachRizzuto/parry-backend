import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../auth-utils";

export const foodEntryRouter = Router();

foodEntryRouter.post(
  "/",
  authMiddleware,
  validateRequest({
    body: z.object({
      foods: z.array(z.number()),
    }),
  }),
  async (req, res) => {
    try {
    } catch (e) {}
  }
);
