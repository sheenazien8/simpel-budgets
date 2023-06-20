import { AxiosError, AxiosResponse } from "axios";
import { ResponseData, MGoal, RGoalDetail } from "@/models";
import { encodeQuery, instance } from "@/utils/helper";
import { useRouter } from "next/router";

export const useGoalDetailAction = () => {
  const router = useRouter();
  const { lang } = router.query;
  const get = async (
    detailId: number,
    query?: RGoalDetail,
  ): Promise<AxiosResponse<ResponseData<MGoal>>> => {
    try {
      const response = await instance.get<ResponseData<MGoal>>(
        `/api/goals/${detailId}/details?${encodeQuery(query)}`,
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
    values: RGoalDetail,
    detailId: number,
    setError: (arg: RGoalDetail) => void,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.post<ResponseData>(
        `/api/goals/${detailId}/details`,
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
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            nominal: errorResponse?.nominal ? errorResponse?.nominal[0] : "",
          });
        }
      }
      throw error;
    }
  };

  const destroy = async (
    id: string | number,
    detailId: number,
  ): Promise<AxiosResponse<ResponseData>> => {
    try {
      const response = await instance.delete<ResponseData>(
        `/api/goals/${id}/details/${detailId}`,
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
    destroy,
  };
};
