interface ResponseData<t = undefined> {
  data?: t;
  errors?: {
    [key: string]: string[];
  };
  message?: string;
}

interface MSimplePaginate<t = any> {
    data: t,
    current_page: number,
    first_page_url: string;
    from: number;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
}

interface MInfo {
  month: string;
  account: string;
  budget: string;
  cashflow: string;
}

export type { ResponseData, MInfo, MSimplePaginate };
export * from "./src/month";
export * from "./src/account";
export * from "./src/budget";
export * from "./src/cashflow";
export * from "./src/auth";
export * from "./src/goal";
export * from "./src/goal";
export * from "./src/debtsAndReceivables";
export * from "./src/dashboard";
export * from "./src/debt";
