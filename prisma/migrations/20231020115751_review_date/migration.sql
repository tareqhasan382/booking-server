/*
  Warnings:

  - You are about to alter the column `amount` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
