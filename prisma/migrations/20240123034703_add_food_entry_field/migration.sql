/*
  Warnings:

  - You are about to drop the `_EntryToFood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EntryToFood";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FoodEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entryId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    CONSTRAINT "FoodEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FoodEntry_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodEntry_entryId_foodId_key" ON "FoodEntry"("entryId", "foodId");
