import { AxiosError } from "axios";
import { ResponseData, Shortcuts, SummaryFinancialRecord } from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { useRouter } from "next/router";

export interface IQueryDashboard {
  recapBy: string;
}

export const useDashboardAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const financialRecord = async (
    query: IQueryDashboard,
  ): Promise<ResponseData<SummaryFinancialRecord[]>> => {
    try {
      const response = await instance.get<ResponseData<SummaryFinancialRecord[]>>(
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
          router?.push(`/${lang}/login`);
        }
      }
      throw error;
    }
  };

  const getShortcuts = async (): Promise<ResponseData<Shortcuts[]>> => {
    try {
      const response = await instance.get<ResponseData<Shortcuts[]>>(
        `/api/dashboard/shortcuts`,
      );
      if (response.status != 200) {
        throw response.statusText;
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push(`/${lang}/login`);
        }
      }
      throw error;
    }
  };

  return {
    financialRecord,
    getShortcuts
  };
};
