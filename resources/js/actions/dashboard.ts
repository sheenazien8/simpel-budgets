import { Inertia } from "@inertiajs/inertia";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseData } from "../models";
import { ResponseGetDashboard } from "../models/dashboard";
import { instance } from "../utils/helper";

const useDashboardAction = () => {
  const get = async (): Promise<AxiosResponse<ResponseData<ResponseGetDashboard>>> => {
    try {
      const response = await instance.get<ResponseData<ResponseGetDashboard>>("/api/dashboard");
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

  return {
      get
  }
}

export { useDashboardAction }
