import btoa from "btoa";
// import type { ApiResponse } from "./transactions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { bills } from "./drizzle/schema";
import { SQL, sql } from "drizzle-orm/sql/sql";
import { getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

interface ApiResponse {
  data: BillsData[];
  // page: Page;
}

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
    scope: "bills:read",
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
const API_URL = "https://api.ramp.com/developer/v1/bills";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
let transactionRes: Response | undefined;
try {
  transactionRes = await fetch(API_URL, options);
  console.log("🚀🚀 ~ transactionRes is ok:", transactionRes.ok);
} catch (err) {
  console.error("Error fetching transactions");
  console.error(err);
}

const result: ApiResponse = (await transactionRes?.json()) as ApiResponse;

const client = postgres(connectionString);
const db = drizzle(client);
type NewBillsRecord = typeof bills.$inferInsert;

const newTransactionsList: NewBillsRecord[] = (result?.data as BillsData[]).map(
  (record, i) => {
    const {
      accounting_field_selections,
      amount,
      created_at,
      // deep_link_url,
      due_at,
      entity_id,
      id,
      invoice_number,
      issued_at,
      // line_items,
      payment,
      remote_id,
      status,
      vendor,
    } = record;
    console.log(
      "🚀🚀 ~ constnewTransactionsList:BillsData[]=result?.data.map ~ record:",
      record
    );
    const accounting_labels = accounting_field_selections.map(
      (sel) => sel.name
    );

    // Use the parsed transaction fields here

    return {
      id,
      amount: String(amount?.amount),
      currencyCode: amount?.currency_code,
      createdAt: created_at,
      dueAt: due_at,
      entityId: entity_id,
      invoiceNumber: invoice_number,
      issuedAt: issued_at,
      remoteId: remote_id,
      status: status,
      paymentEffectiveDate: payment?.effective_date,
      paymentDate: payment?.payment_date,
      paymentMethod: payment?.payment_method,
      paymentAmount: String(payment?.amount.amount),
      vendorName: vendor?.remote_name,
      vendorType: vendor?.type,
      accountingLabels: accounting_labels,
    } as NewBillsRecord;
  }
);

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

const batchInsertTransaction = async (trans: NewBillsRecord[]) => {
  const res = await db
    .insert(bills)
    .values(trans)
    .onConflictDoUpdate({
      target: [bills.id],
      set: buildConflictUpdateColumns(bills, [
        "amount",
        "currencyCode",
        "createdAt",
        "dueAt",
        "entityId",
        "invoiceNumber",
        "issuedAt",
        "remoteId",
        "status",
        "paymentEffectiveDate",
        "paymentDate",
        "paymentMethod",
        "paymentAmount",
        "vendorName",
        "vendorType",
        "accountingLabels",
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

type LineItem = {
  accounting_field_selections: AccountingFieldSelection[];
  amount: {
    amount: number;
    currency_code: string;
  };
  memo: string;
};

type Vendor = {
  remote_id: string;
  remote_name: string;
  type: "BUSINESS" | "INDIVIDUAL";
};

type AccountingFieldSelection = {
  category_info: CategoryInfo;
  external_id: string;
  id: string;
  name: string;
}[];

type CategoryInfo = {
  external_id: string;
  id: string;
  name: string;
  type:
    | "AMORTIZATION_TEMPLATE"
    | "BILLABLE"
    | "CUSTOMERS_JOBS"
    | "DEFERRAL_CODE"
    | "GL_ACCOUNT"
    | "INVENTORY_ITEM"
    | "JOURNAL"
    | "MERCHANT";
};
type Payment = {
  amount: {
    amount: number;
    currency_code: string;
  };

  effective_date?: string;
  payment_date?: string;
  payment_method?: string;
};
type BillsData = {
  accounting_field_selections: {
    external_id: string;
    id: string;
    name: string;
    category_info: CategoryInfo;
  }[];
  amount: {
    amount: number;
    currency_code: string;
  };
  created_at: string;
  deep_link_url: string;
  due_at: string;
  entity_id: string;
  id: string;
  invoice_number: string;
  issued_at: string;
  line_items: LineItem[];
  payment: Payment;
  remote_id: string;
  status: "OPEN" | "PAID";
  vendor: Vendor;
};
