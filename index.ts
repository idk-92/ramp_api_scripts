import btoa from "btoa";
import type { ApiResponse } from "./transactions";

// console.log(val)
// bru.setVar('RAMP_TOKEN',response);

async function getRampToken() {
  const endpoint = "https://api.ramp.com/developer/v1/token";
  const clientId = "ramp_id_5rdHpqWDykN9yhcNlza7MKH1ciOSoK7ddKKTh3Nl";
  const clientSecret =
    "ramp_sec_Vwh49ScJ6ZdDN6v5sTaTxgGvzSLOreBeWlK5wkTWxWZG2vve";

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
const url = "https://api.ramp.com/developer/v1/transactions?page_size=3";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const transactionRes = await fetch(url, options);

const result: ApiResponse = (await transactionRes.json()) as ApiResponse;
result.data[0].merchant_name




result.data.forEach((transaction) => {
  const {
    id,
    merchant_name,
    user_transaction_time,
    sk_category_name,
    accounting_categories,
    card_id,
    merchant_category_code,
    synced_at,
    sk_category_id,
    policy_violations,
    merchant_descriptor,
    card_holder,
    accounting_field_selections,
    disputes,
    currency_code,
    merchant_category_code_description,
    amount,
    line_items,
    merchant_id,
    memo,
    state,
    settlement_date,
    original_transaction_amount,
  } = transaction;

  // Use the parsed transaction fields here

  const cardHolderName = `${card_holder.first_name} ${card_holder.last_name}`;
  const string = '1'
  const obj = {}
  const number = `${obj}`

  // insert into db statements

  return;
});
// id
// merchant_name
// user_transaction_time
// sk_category_name
// accounting_categories
// card_id
// merchant_category_code
// synced_at
// sk_category_id
// policy_violations
// merchant_descriptor
// card_holder
// accounting_field_selections
// disputes
// currency_code
// merchant_category_code_description
// amount
// line_items
// merchant_id
// memo
// state
// settlement_date
// original_transaction_amount
// Handle the result of the POST request

// result.data;
// console.log("🚀🚀 ~ result.data:", result.data);



[]
{ 1:'a',2:'b' } 
{1:{}}

