-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "accounting";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "actionType" AS ENUM('BREAK', 'CHECK_IN', 'CHECK_OUT', 'ITEM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "employee_log_status" AS ENUM('NEEDS_VERIFICATION', 'APPROVED', 'REJECTED', 'UNKNOWN', 'CONFIRMED_BY_USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "Available Positions" AS ENUM('Customer Relations Specialist (CRS)', 'Plant Manager', 'Assistant Plant Manager', 'Finisher (DC)', 'Store Manager', 'Finisher (L)', 'Central CRS', 'Washer', 'Production Support', 'District Manager', 'Dry Cleaner', 'Driver', 'Custodian', 'CEO', 'Chief Engineer', 'SVP, Retail', 'Executive Admin', 'SVP, Ops');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "barcodeType" AS ENUM('EMPLOYEE', 'ACTION', 'HOTEL', 'ITEM', 'CUSTOMER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "request_status" AS ENUM('PENDING', 'SUCCESS', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."ramp_transactions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ramp_id" uuid,
	"merchant_name" text,
	"user_transaction_time" timestamp with time zone,
	"sk_category_name" text,
	"merchant_descriptor" text,
	"card_holder" text,
	"merchant_category_code_description" text,
	"amount" numeric,
	"currency_code" text,
	"memo" text,
	"state" text,
	"settlement_date" timestamp with time zone,
	"location_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."vendor_list" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"vendor" text NOT NULL,
	"active" boolean NOT NULL,
	"street_address" text,
	"street_address2" text,
	"city" text,
	"state" text,
	"zip" text,
	"phone" text,
	"email" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."transaction_id" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unique_id" text,
	"source" text,
	"source_detail" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."bank_wf_ops" (
	"id" bigint PRIMARY KEY NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"date" date,
	"amount" numeric,
	"description" text,
	"check_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."check_id" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"check_id" text,
	"bank_account" text,
	"source" text,
	"source_detail" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."vendor_categorization" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"vendor" text,
	"active" boolean NOT NULL,
	"reference" text,
	"category" text,
	"gl_description" text,
	"district" text,
	"location" text,
	"recurrence_period" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounting"."bank_wf_pr" (
	"id" bigint PRIMARY KEY NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"date" date,
	"amount" numeric,
	"description" text,
	"check_id" text
);

*/