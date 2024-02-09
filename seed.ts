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
    await prisma.foodEntry.deleteMany();
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

    const sampleFoods = [
      {
        food: "Banana",
        calories: 80,
        amount: "1 Oz",
      },
      {
        food: "Strawberry",
        calories: 20,
        amount: "1 Whole",
      },
      {
        food: "Hamburger",
        calories: 354,
        amount: "1 Whole",
      },
      {
        food: "French Fries",
        calories: 365,
        amount: "1 Whole",
      },
      {
        food: "Mashed Potatoes",
        calories: 214,
        amount: "1 Cup",
      },
      {
        food: "Grilled Cheese Sandwhich",
        calories: 378,
        amount: "1 Whole",
      },
      {
        food: "Chicken Nuggets",
        calories: 296,
        amount: "100 G",
      },
      {
        food: 'Pizza 8"',
        calories: 1100,
        amount: "1 Whole",
      },
      {
        food: "10 Count Boneless Wings",
        calories: 650,
        amount: "1 Whole",
      },
    ];

    for (let food of sampleFoods) {
      await prisma.food.create({
        data: {
          ...food,
        },
      });
    }

    const foods = await prisma.food.findMany();

    const sampleEntry = {
      userId: sampleUserOne.id,
      dayId: day.id,
      mealType: "Snack",
      mealName: "Brunch",
      createdAt: date.getTime().toString(),
    };

    const entry = await prisma.entry.create({
      data: {
        ...sampleEntry,
      },
    });

    const foodEntry = await prisma.foodEntry.create({
      data: {
        foodId: foods[0].id,
        entryId: entry.id,
      },
    });

    await prisma.foodEntry.create({
      data: {
        foodId: foods[1].id,
        entryId: entry.id,
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
