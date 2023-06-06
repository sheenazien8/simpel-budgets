import { AxiosError, AxiosResponse } from "axios";
import { ResponseData, MMonth, RMonth } from "@/App/models";
import { encodeQuery, instance } from "@/App/utils/helper";
import { useRouter } from "next/router";

export const useMonthAction = () => {
  const router = useRouter();
  const get = async (query?: RMonth): Promise<AxiosResponse<ResponseData<MMonth[]>>> => {
    try {
      const response = await instance.get<ResponseData<MMonth[]>>(`/api/months?${encodeQuery(query)}`);
      if (response.status != 200) {
        console.log(response);
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push("login")
          throw error;
        }
      }
      throw error;
    }
  };

  const create = async (
    values: RMonth,
    setError: (arg: RMonth) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>("/api/months", values);
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push("login")
          throw error;
        }
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            year: errorResponse?.year ? errorResponse?.year[0] : "",
            name: errorResponse?.name ? errorResponse?.name[0] : "",
            status: errorResponse?.status ? errorResponse?.status[0] : false,
          });
        }
      }
      throw error;
    }
  };
  const detail = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData<MMonth>>> => {
    try {
      const response = await instance.get<ResponseData<MMonth>>(
        `/api/months/${id}`,
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
          router?.push("login")
          throw error;
        }
      }
      throw error;
    }
  };
  const update = async (
    id: string | number,
    values: RMonth,
    setError: (arg: RMonth) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.put<ResponseData>(
        `/api/months/${id}`,
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
          router?.push("login")
          throw error;
        }
      }
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            year: errorResponse?.year ? errorResponse?.year[0] : "",
            name: errorResponse?.name ? errorResponse?.name[0] : "",
            status: errorResponse?.status ? errorResponse?.status[0] : false,
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
      const response = await instance.delete<ResponseData>(`/api/months/${id}`);
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          router?.push("login")
          throw error;
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
