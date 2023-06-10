import { AxiosError } from "axios";
import { ResponseData, SummaryFinancialRecord } from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { useRouter } from "next/router";

export interface IQueryDashboard {
  recapBy: string;
}

export const useDashboardAction = () => {
  const router = useRouter();
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
          router?.push("login");
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
