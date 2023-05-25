interface ResponseGetAccount {
    data: MAccount[];
    account_sum_total: number;
}

interface MAccount {
  id: number;
  name: string;
  total: number;
  hide: string[];
  saving: string[];
  created_at: string;
  updated_at: string;
}

interface RAccount {
  name?: string;
  total?: number | string;
  hide?: string[];
  saving?: string[];
}

export { MAccount, RAccount, ResponseGetAccount };
