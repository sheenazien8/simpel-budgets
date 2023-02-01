interface ResponseGetMCashflow {
    data: MCashflow[],
    transaction_sum_nominal: number;
    total_transactions: number;
}

interface MCashflow {
  id: number;
  account_id: number;
  account_target: number;
  budget_id: number;
  budget_name: string;
  account_name: string;
  account_target_name: string;
  nominal: number;
  date: string;
  notes: string;
  reccuring: boolean;
  type: number;
  created_at: string;
  updated_at: string;
}

interface RCashflow {
  account_id?: number | string;
  account_target?: number | string;
  budget_id?: number | string;
  nominal?: number | string;
  notes?: string;
  date?: string;
  reccuring?: boolean | string;
  type?: number | string;
  offset?: number | string;
  page?: number | string;
}

export { MCashflow, RCashflow, ResponseGetMCashflow };
