import { MAccount, RAccount, ResponseData, ResponseGetAccount } from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";

export interface QAccount {
    saving?: boolean;
}

export const useAccountAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (query?: QAccount): Promise<AxiosResponse<ResponseData<ResponseGetAccount>>> => {
    try {
      const response = await instance.get<ResponseData<ResponseGetAccount>>(`/api/accounts?${encodeQuery(query)}`);
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push(`/${lang}/login`);
          throw error;
        }
      }
      throw error;
    }
  };

  const create = async (
    values: RAccount,
    setError: (arg: RAccount) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>("/api/accounts", values);
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
            total: errorResponse?.total ? errorResponse?.total[0] : "",
            name: errorResponse?.name ? errorResponse?.name[0] : "",
          });
        }
      }
      throw error;
    }
  };
  const detail = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData<MAccount>>> => {
    try {
      const response = await instance.get<ResponseData<MAccount>>(
        `/api/accounts/${id}`,
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
    values: RAccount,
    setError: (arg: RAccount) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.put<ResponseData>(
        `/api/accounts/${id}`,
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
            total: errorResponse?.total ? errorResponse?.total[0] : "",
            name: errorResponse?.name ? errorResponse?.name[0] : "",
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
        `/api/accounts/${id}`,
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
    destroy
  };
};
