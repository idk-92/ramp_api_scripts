import {
  pgTable,
  pgSchema,
  pgEnum,
  bigint,
  timestamp,
  uuid,
  text,
  numeric,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const keyType = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);
export const factorType = pgEnum("factor_type", ["totp", "webauthn"]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);
export const actionType = pgEnum("actionType", [
  "BREAK",
  "CHECK_IN",
  "CHECK_OUT",
  "ITEM",
]);
export const employeeLogStatus = pgEnum("employee_log_status", [
  "NEEDS_VERIFICATION",
  "APPROVED",
  "REJECTED",
  "UNKNOWN",
  "CONFIRMED_BY_USER",
]);
export const availablePositions = pgEnum("Available Positions", [
  "Customer Relations Specialist (CRS)",
  "Plant Manager",
  "Assistant Plant Manager",
  "Finisher (DC)",
  "Store Manager",
  "Finisher (L)",
  "Central CRS",
  "Washer",
  "Production Support",
  "District Manager",
  "Dry Cleaner",
  "Driver",
  "Custodian",
  "CEO",
  "Chief Engineer",
  "SVP, Retail",
  "Executive Admin",
  "SVP, Ops",
]);
export const barcodeType = pgEnum("barcodeType", [
  "EMPLOYEE",
  "ACTION",
  "HOTEL",
  "ITEM",
  "CUSTOMER",
]);
export const requestStatus = pgEnum("request_status", [
  "PENDING",
  "SUCCESS",
  "ERROR",
]);

export const accounting = pgSchema("accounting");

export const rampTransactions = accounting.table("ramp_transactions", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  rampId: uuid("ramp_id"),
  merchantName: text("merchant_name"),
  userTransactionTime: timestamp("user_transaction_time", {
    withTimezone: true,
    mode: "string",
  }),
  skCategoryName: text("sk_category_name"),
  merchantDescriptor: text("merchant_descriptor"),
  cardHolder: text("card_holder"),
  merchantCategoryCodeDescription: text("merchant_category_code_description"),
  amount: numeric("amount"),
  currencyCode: text("currency_code"),
  memo: text("memo"),
  state: text("state"),
  settlementDate: timestamp("settlement_date", {
    withTimezone: true,
    mode: "string",
  }),
  locationName: text("location_name"),
});

export const vendorList = accounting.table("vendor_list", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  vendor: text("vendor").notNull(),
  active: boolean("active").notNull(),
  streetAddress: text("street_address"),
  streetAddress2: text("street_address2"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  phone: text("phone"),
  email: text("email"),
});

export const transactionId = accounting.table("transaction_id", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  uniqueId: text("unique_id"),
  source: text("source"),
  sourceDetail: text("source_detail"),
});

export const bankWfOps = accounting.table("bank_wf_ops", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  lastUpdated: timestamp("last_updated", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  date: date("date"),
  amount: numeric("amount"),
  description: text("description"),
  checkId: text("check_id"),
});

export const checkId = accounting.table("check_id", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  checkId: text("check_id"),
  bankAccount: text("bank_account"),
  source: text("source"),
  sourceDetail: text("source_detail"),
});

export const vendorCategorization = accounting.table("vendor_categorization", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  vendor: text("vendor"),
  active: boolean("active").notNull(),
  reference: text("reference"),
  category: text("category"),
  glDescription: text("gl_description"),
  district: text("district"),
  location: text("location"),
  recurrencePeriod: text("recurrence_period"),
});

export const bankWfPr = accounting.table("bank_wf_pr", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  lastUpdated: timestamp("last_updated", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  date: date("date"),
  amount: numeric("amount"),
  description: text("description"),
  checkId: text("check_id"),
});
