interface ResponseGetAccount {
    data: MAccount[];
    account_sum_total: number;
}

interface MAccount {
  id: number;
  name: string;
  total: number;
  hide: boolean;
  saving: boolean;
  created_at: string;
  updated_at: string;
}

interface RAccount {
  name?: string;
  total?: number | string;
  hide?: boolean;
  saving?: boolean;
}

export type { MAccount, RAccount, ResponseGetAccount };
