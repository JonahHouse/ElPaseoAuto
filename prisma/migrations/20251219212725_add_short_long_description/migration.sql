/*
  Warnings:

  - You are about to drop the column `description` on the `vehicles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `vehicles` DROP COLUMN `description`,
    ADD COLUMN `long_description` TEXT NULL,
    ADD COLUMN `short_description` VARCHAR(500) NULL;
