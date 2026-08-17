/*
  Warnings:

  - You are about to drop the column `editCount` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "editCount",
ADD COLUMN     "edit_count" INTEGER NOT NULL DEFAULT 0;
