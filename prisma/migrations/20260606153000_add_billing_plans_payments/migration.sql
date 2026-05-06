-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "status" TEXT NOT NULL,
    "providerRef" TEXT,
    "raw" JSONB,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_provider_status_idx" ON "Payment"("provider", "status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
