import { Inertia } from "@inertiajs/inertia";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseData, MGoal, RGoal } from "../models";
import { encodeQuery, instance } from "../utils/helper";

const useGoalAction = () => {
  const get = async (query?: RGoal): Promise<AxiosResponse<ResponseData<MGoal[]>>> => {
    try {
      const response = await instance.get<ResponseData<MGoal[]>>(`/api/goals?${encodeQuery(query)}`);
      if (response.status != 200) {
        console.log(response);
        throw response.data;
      }
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.request.status == 401) {
          localStorage.removeItem("token");
          Inertia.visit("login")
          throw error;
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
          Inertia.visit("login")
          throw error;
        }
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({

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
          Inertia.visit("login")
          throw error;
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
          Inertia.visit("login")
          throw error;
        }
      }
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({

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
          Inertia.visit("login")
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

export { useGoalAction };

