interface ResponseGetMBudget {
  data: MBudget[];
  total_nominal_budgets: number;
}
interface MBudget {
  id: number;
  plan: string;
  type: number;
  account_id?: number;
  month_id: number;
  month: string;
  nominal: number;
  transactions_sum_nominal: number;
  created_at: string;
  updated_at: string;
}

interface RBudget {
  plan?: number | string;
  type?: number | string;
  month_id?: number | string;
  account_id?: number | string;
  nominal?: number | string;
  ids?: number[] | string[];
}

interface FBudget {
  plan?: string;
  month_id?: number | string;
  current_activated?: number;
}

export type { MBudget, RBudget, FBudget, ResponseGetMBudget };
