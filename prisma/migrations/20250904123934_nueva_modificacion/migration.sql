/*
  Warnings:

  - You are about to drop the column `orderReadyAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderReadyAt",
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryComment" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "ticketGenerated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'pendiente',
ALTER COLUMN "status" SET DATA TYPE TEXT;
