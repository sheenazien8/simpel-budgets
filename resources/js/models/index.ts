interface ResponseData<t = undefined> {
  data?: t;
  errors?: {
    [key: string]: string[];
  };
  message?: string;
}
interface MInfo {
  month: string;
  account: string;
  budget: string;
  cashflow: string;
}
export { ResponseData, MInfo };
export * from "./month";
export * from "./account";
export * from "./budget";
export * from "./cashflow";
export * from "./auth";
