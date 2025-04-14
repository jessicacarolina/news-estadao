/*
  Warnings:

  - You are about to drop the column `editoria` on the `News` table. All the data in the column will be lost.
  - Added the required column `section` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "editoria",
ADD COLUMN     "section" VARCHAR(20) NOT NULL;
