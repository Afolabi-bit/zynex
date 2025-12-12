/*
  Warnings:

  - You are about to drop the `TestMetric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestMetric" DROP CONSTRAINT "TestMetric_testId_fkey";

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT DEFAULT 'pending';

-- DropTable
DROP TABLE "TestMetric";

-- CreateIndex
CREATE INDEX "Test_domainId_idx" ON "Test"("domainId");
