import btoa from "btoa";
import type { ApiResponse } from "./transactions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { rampTransactions } from "./drizzle/schema";
import { sql } from "drizzle-orm/sql/sql";

const connectionString = process.env.POSTGRES_URL;
const rampClientId = process.env.RAMP_CLIENT_ID;
const rampClientSecret = process.env.RAMP_CLIENT_SECRET;
if (!connectionString) {
  throw new Error("POSTGRES_URL is not set");
}

// console.log(val)
// bru.setVar('RAMP_TOKEN',response);

async function getRampToken() {
  const endpoint = "https://api.ramp.com/developer/v1/token";
  const clientId = rampClientId;
  const clientSecret = rampClientSecret;

  const b64header = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

  const headers = {
    Accept: "application/json",
    Authorization: b64header,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = {
    grant_type: "client_credentials",
    scope: "business:read transactions:read",
  };

  return await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: new URLSearchParams(body),
  });
}

const response = await getRampToken();
const data: {
  scope: string;
  expires_in: number;
  access_token: string;
  token_type: string;
} = (await response.json()) as any;

const token = data?.access_token;
const url = "https://api.ramp.com/developer/v1/transactions";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
let transactionRes: Response | undefined;
try {
  transactionRes = await fetch(url, options);
  console.log("🚀🚀 ~ transactionRes is ok", transactionRes.ok);
} catch (err) {
  console.error("Error fetching transactions");
  console.error(err);
}

const result: ApiResponse = (await transactionRes?.json()) as ApiResponse;

const client = postgres(connectionString);
const db = drizzle(client);
type NewTransaction = typeof rampTransactions.$inferInsert;

const newTransactionsList: NewTransaction[] = result?.data.map(
  (transaction, i) => {
    const {
      id,
      merchant_name,
      user_transaction_time,
      sk_category_name,

      merchant_descriptor,
      card_holder,

      currency_code,
      merchant_category_code_description,
      amount,

      memo,
      state,
      settlement_date,
    } = transaction;

    // Use the parsed transaction fields here

    return {
      rampId: id,
      merchantName: merchant_name,
      userTransactionTime: user_transaction_time,
      skCategoryName: sk_category_name,
      merchantDescriptor: merchant_descriptor,
      cardHolder: `${card_holder.first_name} ${card_holder.last_name}`,
      merchantCategoryCodeDescription: merchant_category_code_description,
      amount: amount,
      currencyCode: currency_code,
      memo: memo,
      state: state,
      settlementDate: settlement_date,
      locationName: card_holder.location_name,
      departmentName: card_holder.department_name,
    };
  }
);

const batchInsertTransaction = async (trans: NewTransaction[]) => {
  const res = await db
    .insert(rampTransactions)
    .values(trans)
    .onConflictDoUpdate({
      target: [rampTransactions.rampId],
      set: {
        amount: sql`excluded.amount`,
        memo: sql`excluded.memo`,
        settlementDate: sql`excluded.settlement_date`,
        userTransactionTime: sql`excluded.user_transaction_time`,
        merchantCategoryCodeDescription: sql`excluded.merchant_category_code_description`,
        merchantName: sql`excluded.merchant_name`,
        state: sql`excluded.state`,
      },
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
