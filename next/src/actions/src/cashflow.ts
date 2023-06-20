import { AxiosError, AxiosResponse } from "axios";
import {
  ResponseData,
  MCashflow,
  RCashflow,
  ResponseGetMCashflow,
} from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { useRouter } from "next/router";

export const useCashflowAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (
    query?: RCashflow,
  ): Promise<AxiosResponse<ResponseData<ResponseGetMCashflow>>> => {
    try {
      const response = await instance.get<ResponseData<ResponseGetMCashflow>>(
        `/api/transactions?${encodeQuery(query)}`,
      );
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const create = async (
    values: RCashflow,
    setError: (arg: RCashflow) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>(
        "/api/transactions",
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
            account_id: errorResponse?.account_id
              ? errorResponse?.account_id[0]
              : "",
            budget_id: errorResponse?.budget_id
              ? errorResponse?.budget_id[0]
              : "",
            nominal: errorResponse?.nominal ? errorResponse?.nominal[0] : "",
            notes: errorResponse?.notes ? errorResponse?.notes[0] : "",
            date: errorResponse?.date ? errorResponse?.date[0] : "",
            type: errorResponse?.type ? errorResponse?.type[0] : undefined,
          });
        }
      }
      throw error;
    }
  };
  const detail = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData<MCashflow>>> => {
    try {
      const response = await instance.get<ResponseData<MCashflow>>(
        `/api/transactions/${id}`,
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
    values: RCashflow,
    setError: (arg: RCashflow) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.put<ResponseData>(
        `/api/transactions/${id}`,
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
            account_id: errorResponse?.account_id
              ? errorResponse?.account_id[0]
              : "",
            budget_id: errorResponse?.budget_id
              ? errorResponse?.budget_id[0]
              : "",
            nominal: errorResponse?.nominal ? errorResponse?.nominal[0] : "",
            notes: errorResponse?.notes ? errorResponse?.notes[0] : "",
            date: errorResponse?.date ? errorResponse?.date[0] : "",
            type: errorResponse?.type ? errorResponse?.type[0] : "",
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
        `/api/transactions/${id}`,
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
  return {
    get,
    create,
    detail,
    update,
    destroy,
  };
};
