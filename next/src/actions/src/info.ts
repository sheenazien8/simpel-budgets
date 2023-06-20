import { AxiosError, AxiosResponse } from "axios";
import { MInfo, ResponseData } from "@/models";
import { instance } from "@/utils/helper";
import { useRouter } from "next/router";

export const useInfoAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (): Promise<AxiosResponse<ResponseData<MInfo>>> => {
    try {
      const response = await instance.get<ResponseData<MInfo>>(`/api/info`);
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
  };
};
