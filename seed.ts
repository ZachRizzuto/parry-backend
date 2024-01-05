import { PrismaClient } from "@prisma/client";
import { formatedDate } from "./app";
import { encryptPassword } from "./auth-utils";

const prisma = new PrismaClient();

const date = new Date();

const seedDb = async () => {
  try {
    await prisma.entry.deleteMany();
    await prisma.day.deleteMany();
    await prisma.user.deleteMany();
    await prisma.food.deleteMany();

    const password = await encryptPassword("password");

    const sampleUser = {
      user: "sampleuser",
      passHash: password,
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

    const sampleFoods = {
      food: "banana",
      calories: 80,
      amount: "1 oz",
    };

    const food = await prisma.food.create({
      data: {
        ...sampleFoods,
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

  return console.log("Database seeded 🌱");
};

seedDb();
