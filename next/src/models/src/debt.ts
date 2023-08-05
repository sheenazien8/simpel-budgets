interface MDebt {
  id: number;
  user_id: number;
  account_id: number;
  name: string;
  description: string;
  amount: number;
  date: string;
  type: number;
  status: number;
  paid: number;
  created_at: string;
  updated_at: string;
  payments: MDebtPayment[];
}

interface MDebtPayment {
  id: number;
  debt_id: number;
  amount: number;
  date: string;
  debt?: MDebt;
}

interface RDebt {
  name?: string;
  description?: string;
  amount?: number | string;
  date?: string;
  account_id?: number | string;
  type?: number | string;
}

interface RDebtPayment {
  amount: number | string;
  date: string;
  account_id: number | string;
}

interface FDebt {}

export type { MDebt, RDebt, FDebt, RDebtPayment, MDebtPayment };
