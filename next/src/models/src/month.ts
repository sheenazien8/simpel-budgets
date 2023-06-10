interface MMonth {
  id: number;
  name: string;
  year: string;
  status: boolean;
  budgets_sum_nominal: number;
  transactions_sum_nominal: number;
  over_budget: boolean;
  over_budget_desc: string;
  created_at: string;
  updated_at: string;
}

interface RMonth {
  name: string;
  year: number | string;
  status?: boolean | string;
}

export type { MMonth, RMonth };
