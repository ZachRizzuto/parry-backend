import { PrismaClient } from "@prisma/client";
import { formatedDate } from "./app";
import { encryptPassword } from "./auth-utils";

const prisma = new PrismaClient();

const date = new Date();

const createUser = async ({
  user,
  password,
}: {
  user: string;
  password: string;
}) => {
  const passHash = await encryptPassword(password);

  return await prisma.user.create({
    data: {
      user,
      passHash,
    },
  });
};

const seedDb = async () => {
  try {
    await prisma.entry.deleteMany();
    await prisma.day.deleteMany();
    await prisma.user.deleteMany();
    await prisma.food.deleteMany();

    const sampleUserOne = await createUser({
      user: "sampleuser",
      password: "password",
    });

    const sampleDay = {
      userId: sampleUserOne.id,
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
      userId: sampleUserOne.id,
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

const run = async () => {
  await seedDb();
  process.exit();
};

run();
