import { FDebt, MDebt, RDebt, RDebtPayment, ResponseData } from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";

export const useDebtActions = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (query?: FDebt): Promise<MDebt[]> => {
    try {
      const response = await instance.get<ResponseData<MDebt[]>>(
        `/api/debts?${encodeQuery(query)}`,
      );
      if (response.status != 200) {
        throw response.data;
      }

      return response.data?.data ?? [];
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
    values: RDebt,
    setError: (arg: RDebt) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>("/api/debts", values);
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
            name: errorResponse?.name ? errorResponse?.name[0] : "",
            amount: errorResponse?.amount ? errorResponse?.amount[0] : "",
            type: errorResponse?.type ? errorResponse?.type[0] : "",
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
  ): Promise<AxiosResponse<ResponseData<MDebt>>> => {
    try {
      const response = await instance.get<ResponseData<MDebt>>(
        `/api/debts/${id}/payments`,
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

  const destroy = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.delete<ResponseData>(`/api/debts/${id}`);
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

  const addDebtPayment = async (
    id: string | number,
    values: RDebtPayment,
    setError: (arg: RDebtPayment) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>(
        `/api/debts/${id}/payments`,
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
        if (error.request.status == 422) {
          const errorResponse = (error as AxiosError<ResponseData>).response
            ?.data.errors;
          if (errorResponse != undefined) {
            setError({
              amount: errorResponse?.amount ? errorResponse?.amount[0] : "",
              date: errorResponse?.date ? errorResponse?.date[0] : "",
              account_id: errorResponse?.account_id
                ? errorResponse?.account_id[0]
                : "",
            });
          }
        }
      }
      throw error;
    }
  };

  const destroyPayment = async (
    idDebt: string | number,
    idDebtPayment: string | number,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.delete<ResponseData>(
        `/api/debts/${idDebt}/payments/${idDebtPayment}`,
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
    destroy,
    addDebtPayment,
    destroyPayment
  };
};
