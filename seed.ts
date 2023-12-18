import { PrismaClient } from "@prisma/client";
import { formatedDate } from "./app";

const prisma = new PrismaClient();

const date = new Date();

const seedDb = async () => {
  try {
    await prisma.entry.deleteMany();
    await prisma.day.deleteMany();
    await prisma.user.deleteMany();
    await prisma.food.deleteMany();

    const sampleUser = {
      user: "zach",
      passHash: "zach@password",
    };

    const user = await prisma.user.create({
      data: {
        ...sampleUser,
      },
    });

    const sampleDay = {
      userId: user.id,
      date: formatedDate,
    };

    const day = await prisma.day.create({
      data: {
        ...sampleDay,
      },
    });

    const sampleFood = {
      food: "banana",
      calories: 80,
      amount: "1 oz",
    };

    const food = await prisma.food.create({
      data: {
        ...sampleFood,
      },
    });

    const sampleEntry = {
      userId: user.id,
      dayId: day.id,
      createdAt: date.getTime().toString(),
      foodId: food.id,
    };

    const entry = await prisma.entry.create({
      data: {
        ...sampleEntry,
      },
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Database seeded 🌱");
};

seedDb();
