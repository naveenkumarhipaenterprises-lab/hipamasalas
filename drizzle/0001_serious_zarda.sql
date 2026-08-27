CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`mobileNumber` varchar(32) NOT NULL,
	`emailAddress` varchar(320),
	`businessType` varchar(64) NOT NULL,
	`productInterest` varchar(128) NOT NULL,
	`message` text,
	`consent` boolean NOT NULL DEFAULT false,
	`source` varchar(64) NOT NULL DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
