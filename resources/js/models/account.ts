interface ResponseGetAccount {
    data: MAccount[];
    account_sum_total: number;
}

interface MAccount {
  id: number;
  name: string;
  total: number;
  created_at: string;
  updated_at: string;
}

interface RAccount {
  name?: string;
  total?: number | string;
}

export { MAccount, RAccount, ResponseGetAccount };
