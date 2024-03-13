interface CategoryInfo {
  external_id: string;
  id: string;
  name: string;
  type: string;
}

interface AccountingFieldSelection {
  category_info: CategoryInfo;
  external_id: string;
  id: string;
  name: string;
  type: string;
}

interface CardHolder {
  department_id: string;
  department_name: string;
  first_name: string;
  last_name: string;
  location_id: string;
  location_name: string;
  user_id: string;
}

interface Amount {
  amount: number;
  currency_code: string;
}

interface LineItem {
  accounting_field_selections: AccountingFieldSelection[];
  amount: Amount;
}

interface Transaction {
  accounting_categories: any[]; // Replace 'any' with a specific type if necessary
  accounting_field_selections: AccountingFieldSelection[];
  amount: number;
  card_holder: CardHolder;
  card_id: string;
  currency_code: string;
  disputes: any[]; // Replace 'any' with a specific type if necessary
  entity_id: string;
  id: string;
  line_items: LineItem[];
  memo: string | null;
  merchant_category_code: string | null;
  merchant_category_code_description: string | null;
  merchant_descriptor: string;
  merchant_id: string;
  merchant_name: string;
  original_transaction_amount: Amount;
  policy_violations: any[]; // Replace 'any' with a specific type if necessary
  receipts: any[]; // Replace 'any' with a specific type if necessary
  settlement_date: string;
  sk_category_id: string;
  sk_category_name: string;
  state: string;
  synced_at: string;
  user_transaction_time: string;
}

interface Page {
  next: string;
}

export interface ApiResponse {
  data: Transaction[];
  page: Page;
}
