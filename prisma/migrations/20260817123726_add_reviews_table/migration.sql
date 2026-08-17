/*
  Warnings:

  - Added the required column `editCount` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "editCount" INTEGER NOT NULL;
