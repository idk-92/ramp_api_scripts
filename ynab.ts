import { getTableColumns, sql, SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import postgres from "postgres";
import ynab from "ynab";
import { bills, ynabTransactions } from "./drizzle/schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL is not set");
}

const accessToken = "nqeancJrx0I-e-yIKRXwVtqJ_zwRBrUcVw4WKtAUeag";
const ynabAPI = new ynab.API(accessToken);
const budgetId = "904d2779-d66a-45da-ae37-2c0e7080125a";

const transactionsResponse = await ynabAPI.transactions.getTransactions(
  budgetId
);
console.log("🚀🚀 ~ transactionsResponse:", transactionsResponse.data);

const client = postgres(connectionString);
const db = drizzle(client);
type NewYnabTransactionsType = typeof ynabTransactions.$inferInsert;

const newTransactionsList: NewYnabTransactionsType[] =
  (transactionsResponse?.data.transactions).map((record, i) => {
    // Use the parsed transaction fields here

    return {
      id: record.id,
      date: record.date,
      amount: String(record.amount),
      memo: record.memo,
      cleared: record.cleared,
      approved: record.approved,
      flagColor: record.flag_color,
      accountId: record.account_id,
      payeeId: record.payee_id,
      categoryId: record.category_id,
      transferAccountId: record.transfer_account_id,
      transferTransactionId: record.transfer_transaction_id,
      matchedTransactionId: record.matched_transaction_id,
      importId: record.import_id,
      importPayeeName: record.import_payee_name,
      importPayeeNameOriginal: record.import_payee_name_original,
      debtTransactionType: record.debt_transaction_type,
      deleted: record.deleted,
      accountName: record.account_name,
      payeeName: record.payee_name,
      categoryName: record.category_name,
    } as NewYnabTransactionsType;
  });

const buildConflictUpdateColumns = <
  T extends PgTable | SQLiteTable,
  Q extends keyof T["_"]["columns"]
>(
  table: T,
  columns: Q[]
) => {
  const cls = getTableColumns(table);

  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);

    return acc;
  }, {} as Record<Q, SQL>);
};

const batchInsertTransaction = async (trans: NewYnabTransactionsType[]) => {
  const res = await db
    .insert(ynabTransactions)
    .values(trans)
    .onConflictDoUpdate({
      target: [ynabTransactions.id],
      set: buildConflictUpdateColumns(ynabTransactions, [
        "date",
        "amount",
        "memo",
        "cleared",
        "approved",
        "flagColor",
        "accountId",
        "payeeId",
        "categoryId",
        "transferAccountId",
        "transferTransactionId",
        "matchedTransactionId",
        "importId",
        "importPayeeName",
        "importPayeeNameOriginal",
        "debtTransactionType",
        "deleted",
        "accountName",
        "payeeName",
        "categoryName",
      ]),
    });
};
try {
  await batchInsertTransaction(newTransactionsList);
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}

console.log("done!");
process.exit();
