import { AxiosResponse } from "axios";
import { MInfo, ResponseData } from "@/App/models";
import { instance } from "@/App/utils/helper";

export const useInfoAction = () => {
  const get = async (): Promise<AxiosResponse<ResponseData<MInfo>>> => {
    try {
      const response = await instance.get<ResponseData<MInfo>>(`/api/info`);
      if (response.status != 200) {
        throw response.data;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    get,
  };
};
