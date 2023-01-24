interface ResponseGetMBudget {
  data: MBudget[];
  total_nominal_budgets: number;
}
interface MBudget {
  id: number;
  plan: string;
  month_id: number;
  month: string;
  nominal: number;
  transactions_sum_nominal: number;
  created_at: string;
  updated_at: string;
}

interface RBudget {
  plan?: number | string;
  month_id?: number | string;
  nominal?: number | string;
  ids?: number[] | string[];
}

interface FBudget {
  plan?: string;
  month_id?: number | string;
  current_activated?: number;
}

export { MBudget, RBudget, FBudget, ResponseGetMBudget };
