CREATE TABLE `newsletterSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`emailAddress` varchar(320) NOT NULL,
	`consent` boolean NOT NULL DEFAULT false,
	`source` varchar(64) NOT NULL DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletterSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscriptions_emailAddress_unique` UNIQUE(`emailAddress`)
);
