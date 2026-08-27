CREATE TABLE `productAvailability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productSlug` varchar(128) NOT NULL,
	`status` enum('available','unavailable') NOT NULL DEFAULT 'available',
	`updatedByUserId` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productAvailability_id` PRIMARY KEY(`id`),
	CONSTRAINT `productAvailability_productSlug_unique` UNIQUE(`productSlug`)
);
