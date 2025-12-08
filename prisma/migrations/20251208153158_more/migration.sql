-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestMetric" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "TestMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_url_key" ON "Domain"("url");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestMetric" ADD CONSTRAINT "TestMetric_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
