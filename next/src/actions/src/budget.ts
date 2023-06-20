import { AxiosError, AxiosResponse } from "axios";
import {
  ResponseData,
  MBudget,
  RBudget,
  FBudget,
  ResponseGetMBudget,
} from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { useRouter } from "next/router";

export const useBudgetAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (
    query?: FBudget,
  ): Promise<AxiosResponse<ResponseData<ResponseGetMBudget>>> => {
    try {
      const response = await instance.get<ResponseData<ResponseGetMBudget>>(
        `/api/budgets?${encodeQuery(query)}`,
      );
      if (response.status != 200) {
        throw response.data;
      }
      return response;
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

  const create = async (
    values: RBudget,
    setError: (arg: RBudget) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>(
        "/api/budgets",
        values,
      );
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push(`/${lang}/login`);
        }
      }
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            plan: errorResponse?.plan ? errorResponse?.plan[0] : "",
            month_id: errorResponse?.month_id ? errorResponse?.month_id[0] : "",
            nominal: errorResponse?.nominal ? errorResponse?.nominal[0] : "",
            account_id: errorResponse?.account_id
              ? errorResponse?.account_id[0]
              : "",
          });
        }
      }
      throw error;
    }
  };
  const detail = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData<MBudget>>> => {
    try {
      const response = await instance.get<ResponseData<MBudget>>(
        `/api/budgets/${id}`,
      );
      if (response.status != 200) {
        console.log(response);
        throw response.data;
      }
      return response;
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
  const update = async (
    id: string | number,
    values: RBudget,
    setError: (arg: RBudget) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.put<ResponseData>(
        `/api/budgets/${id}`,
        values,
      );
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push(`/${lang}/login`);
        }
      }
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            plan: errorResponse?.plan ? errorResponse?.plan[0] : "",
            month_id: errorResponse?.month_id ? errorResponse?.month_id[0] : "",
            nominal: errorResponse?.nominal ? errorResponse?.nominal[0] : "",
            account_id: errorResponse?.account_id
              ? errorResponse?.account_id[0]
              : "",
          });
        }
      }
      throw error;
    }
  };
  const destroy = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.delete<ResponseData>(
        `/api/budgets/${id}`,
      );
      if (response.status != 200) {
        throw response.data;
      }
      return response;
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
  const copy = async (
    values: RBudget,
    setError: (arg: RBudget) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>(
        `/api/budgets/copy`,
        values,
      );
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push(`/${lang}/login`);
        }
      }
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            month_id: errorResponse?.month_id ? errorResponse?.month_id[0] : "",
          });
        }
      }
      throw error;
    }
  };

  return {
    get,
    create,
    detail,
    update,
    destroy,
    copy,
  };
};
