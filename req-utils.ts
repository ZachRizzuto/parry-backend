import { NextFunction, Request, Response } from "express";

export const formatFood = (food: string) => {
  const splitString = food.split(" ");

  const formattedString = splitString.map((word) => {
    const wordWithoutFirstLetter = word.slice(1, word.length);
    return word[0].toUpperCase() + wordWithoutFirstLetter;
  });

  const joinedString = formattedString.join(" ");

  return joinedString;
};

export const formatFoodMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const food = req.body.food;

  req.body.food = formatFood(food);

  next();
};
