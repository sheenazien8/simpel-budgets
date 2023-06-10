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

export { ResponseData, MInfo, MSimplePaginate };
export * from "./month";
export * from "./account";
export * from "./budget";
export * from "./cashflow";
export * from "./auth";
export * from "./goal";
export * from "./goal";
export * from "./debtsAndReceivables";
