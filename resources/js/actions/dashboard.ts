import { Inertia } from "@inertiajs/inertia";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseData } from "../models";
import { SummaryFinancialRecord } from "../models/dashboard";
import { encodeQuery, instance } from "../utils/helper";

export interface IQueryDashboard {
  recapBy: string;
}

const useDashboardAction = () => {
  const financialRecord = async (query: IQueryDashboard): Promise<
    ResponseData<SummaryFinancialRecord>
  > => {
    try {
      const response = await instance.get<ResponseData<SummaryFinancialRecord>>(
        `/api/dashboard/financial-record?${encodeQuery(query)}`,
      );
      if (response.status != 200) {
        throw response.statusText;
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          Inertia.visit("login");
          throw error;
        }
      }
      throw error;
    }
  };

  return {
    financialRecord,
  };
};

export { useDashboardAction };
