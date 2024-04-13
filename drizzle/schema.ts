import { pgTable, pgEnum, uuid, numeric, text, timestamp, date, boolean, pgSchema, unique, bigint } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const actionType = pgEnum("actionType", ['BREAK', 'CHECK_IN', 'CHECK_OUT', 'ITEM'])
export const employeeLogStatus = pgEnum("employee_log_status", ['NEEDS_VERIFICATION', 'APPROVED', 'REJECTED', 'UNKNOWN', 'CONFIRMED_BY_USER'])
export const availablePositions = pgEnum("Available Positions", ['Customer Relations Specialist (CRS)', 'Plant Manager', 'Assistant Plant Manager', 'Finisher (DC)', 'Store Manager', 'Finisher (L)', 'Central CRS', 'Washer', 'Production Support', 'District Manager', 'Dry Cleaner', 'Driver', 'Custodian', 'CEO', 'Chief Engineer', 'SVP, Retail', 'Executive Admin', 'SVP, Ops'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const barcodeType = pgEnum("barcodeType", ['EMPLOYEE', 'ACTION', 'HOTEL', 'ITEM', 'CUSTOMER'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const requestStatus = pgEnum("request_status", ['PENDING', 'SUCCESS', 'ERROR'])

export const accounting = pgSchema("accounting");

export const bills = pgTable("bills", {
	id: uuid("id").primaryKey().notNull(),
	amount: numeric("amount"),
	currencyCode: text("currency_code"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	deepLinkUrl: text("deep_link_url"),
	dueAt: timestamp("due_at", { withTimezone: true, mode: 'string' }),
	entityId: text("entity_id"),
	invoiceNumber: text("invoice_number"),
	issuedAt: timestamp("issued_at", { withTimezone: true, mode: 'string' }),
	remoteId: text("remote_id"),
	status: text("status"),
	paymentEffectiveDate: timestamp("payment_effective_date", { withTimezone: true, mode: 'string' }),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }),
	paymentMethod: text("payment_method"),
	paymentAmount: numeric("payment_amount"),
	vendorName: text("vendor_name"),
	vendorType: text("vendor_type"),
	accountingLabels: text("accounting_labels").array(),
});

export const ynabTransactions = pgTable("ynab_transactions", {
	id: uuid("id").primaryKey().notNull(),
	date: date("date"),
	amount: numeric("amount", { precision: 20, scale:  2 }),
	memo: text("memo"),
	cleared: text("cleared"),
	approved: boolean("approved"),
	flagColor: text("flag_color"),
	accountId: text("account_id"),
	payeeId: text("payee_id"),
	categoryId: text("category_id"),
	transferAccountId: text("transfer_account_id"),
	transferTransactionId: text("transfer_transaction_id"),
	matchedTransactionId: text("matched_transaction_id"),
	importId: text("import_id"),
	importPayeeName: text("import_payee_name"),
	importPayeeNameOriginal: text("import_payee_name_original"),
	debtTransactionType: text("debt_transaction_type"),
	deleted: boolean("deleted"),
	accountName: text("account_name"),
	payeeName: text("payee_name"),
	categoryName: text("category_name"),
});

export const rampTransactions = accounting.table("ramp_transactions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	rampId: uuid("ramp_id"),
	merchantName: text("merchant_name"),
	userTransactionTime: timestamp("user_transaction_time", { withTimezone: true, mode: 'string' }),
	skCategoryName: text("sk_category_name"),
	merchantDescriptor: text("merchant_descriptor"),
	cardHolder: text("card_holder"),
	merchantCategoryCodeDescription: text("merchant_category_code_description"),
	amount: numeric("amount"),
	currencyCode: text("currency_code"),
	memo: text("memo"),
	state: text("state"),
	settlementDate: timestamp("settlement_date", { withTimezone: true, mode: 'string' }),
	locationName: text("location_name"),
	departmentName: text(" department_name"),
},
(table) => {
	return {
		rampTransactionsRampIdKey: unique("ramp_transactions_ramp_id_key").on(table.rampId),
	}
});