interface ResponseGetAccount {
    data: MAccount[];
    account_sum_total: number;
}

interface MAccount {
  id: number;
  name: string;
  total: number;
  hide: string[];
  created_at: string;
  updated_at: string;
}

interface RAccount {
  name?: string;
  total?: number | string;
  hide?: string[];
}

export { MAccount, RAccount, ResponseGetAccount };
