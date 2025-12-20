-- CreateTable
CREATE TABLE `vehicles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vin` VARCHAR(17) NOT NULL,
    `stock_number` VARCHAR(50) NULL,
    `year` INTEGER NOT NULL,
    `make` VARCHAR(100) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `trim` VARCHAR(100) NULL,
    `price` DECIMAL(10, 2) NULL,
    `msrp` DECIMAL(10, 2) NULL,
    `mileage` INTEGER NULL,
    `exterior_color` VARCHAR(100) NULL,
    `interior_color` VARCHAR(100) NULL,
    `transmission` VARCHAR(50) NULL,
    `fuel_type` VARCHAR(50) NULL,
    `body_style` VARCHAR(50) NULL,
    `drivetrain` VARCHAR(50) NULL,
    `engine` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `features` JSON NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `is_sold` BOOLEAN NOT NULL DEFAULT false,
    `source_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_vin_key`(`vin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scrape_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `started_at` DATETIME(3) NOT NULL,
    `completed_at` DATETIME(3) NULL,
    `vehicles_found` INTEGER NULL,
    `vehicles_added` INTEGER NULL,
    `vehicles_updated` INTEGER NULL,
    `vehicles_removed` INTEGER NULL,
    `status` VARCHAR(50) NOT NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `message` TEXT NOT NULL,
    `vehicle_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicle_images` ADD CONSTRAINT `vehicle_images_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
