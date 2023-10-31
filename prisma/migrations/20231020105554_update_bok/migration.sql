/*
  Warnings:

  - You are about to drop the column `reserved_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the `reserved` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reservedbook_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_reserved_id_fkey";

-- DropForeignKey
ALTER TABLE "reserved" DROP CONSTRAINT "reserved_tripsId_fkey";

-- DropForeignKey
ALTER TABLE "reserved" DROP CONSTRAINT "reserved_user_id_fkey";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "reserved_id",
ADD COLUMN     "reservedbook_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "reserved";

-- CreateTable
CREATE TABLE "reservedbook" (
    "id" TEXT NOT NULL,
    "start_day" TEXT NOT NULL,
    "end_daay" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" "StatusRole" NOT NULL DEFAULT 'pending',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tripsId" TEXT NOT NULL,

    CONSTRAINT "reservedbook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservedbook" ADD CONSTRAINT "reservedbook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservedbook" ADD CONSTRAINT "reservedbook_tripsId_fkey" FOREIGN KEY ("tripsId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_reservedbook_id_fkey" FOREIGN KEY ("reservedbook_id") REFERENCES "reservedbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
