/*
  Warnings:

  - You are about to drop the `password_resets` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'usuario';

-- DropTable
DROP TABLE "password_resets";
