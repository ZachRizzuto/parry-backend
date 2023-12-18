import { prisma } from "./app";

const clearDb = async () => {
  try {
    await prisma.entry.deleteMany();
    await prisma.day.deleteMany();
    await prisma.user.deleteMany();
    await prisma.food.deleteMany();
  } catch (e) {
    console.log(e);
  }
  console.log("Cleared DB");
};

clearDb();
