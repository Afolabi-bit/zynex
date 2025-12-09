/*
  Warnings:

  - Added the required column `device` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `network` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "device" TEXT NOT NULL,
ADD COLUMN     "network" TEXT NOT NULL;
