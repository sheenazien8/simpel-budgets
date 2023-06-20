import { AxiosError, AxiosResponse } from "axios";
import { ResponseData, MGoal, RGoal } from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { useRouter } from "next/router";

export const useGoalAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (
    query?: RGoal,
  ): Promise<AxiosResponse<ResponseData<MGoal[]>>> => {
    try {
      const response = await instance.get<ResponseData<MGoal[]>>(
        `/api/goals?${encodeQuery(query)}`,
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

  const create = async (
    values: RGoal,
    setError: (arg: RGoal) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>("/api/goals", values);
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
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            title: errorResponse?.title ? errorResponse?.title[0] : "",
            description: errorResponse?.description
              ? errorResponse?.description[0]
              : "",
            target_date: errorResponse?.target_date
              ? errorResponse?.target_date[0]
              : "",
            nominal_target: errorResponse?.nominal_target
              ? errorResponse?.nominal_target[0]
              : "",
          });
        }
      }
      throw error;
    }
  };
  const detail = async (
    id: string | number,
  ): Promise<AxiosResponse<ResponseData<MGoal>>> => {
    try {
      const response = await instance.get<ResponseData<MGoal>>(
        `/api/goals/${id}`,
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
    values: RGoal,
    setError: (arg: RGoal) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.put<ResponseData>(
        `/api/goals/${id}`,
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
            title: errorResponse?.title ? errorResponse?.title[0] : "",
            description: errorResponse?.description
              ? errorResponse?.description[0]
              : "",
            target_date: errorResponse?.target_date
              ? errorResponse?.target_date[0]
              : "",
            nominal_target: errorResponse?.nominal_target
              ? errorResponse?.nominal_target[0]
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
      const response = await instance.delete<ResponseData>(`/api/goals/${id}`);
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
