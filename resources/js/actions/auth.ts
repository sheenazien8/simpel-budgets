import { Inertia } from "@inertiajs/inertia";
import { AxiosError } from "axios";
import { MJwt, ResponseData, RLogin, RRegister, RResetToken } from "../models";
import { instance } from "../utils/helper";

const useAuthAction = () => {
  const login = async (
    values: RLogin,
    setError: (arg: RLogin) => void,
  ): Promise<void> => {
    try {
      const data = await instance.post<ResponseData<MJwt>>(
        "/api/auth/login",
        values,
      );
      if (data.status == 200) {
        localStorage.setItem("token", data.data.data?.access_token ?? "")
        Inertia.visit("/months", {});
        return;
      }
      throw data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            username: errorResponse?.username ? errorResponse?.username[0] : "",
            password: errorResponse?.password ? errorResponse?.password[0] : "",
          });
        }
      }
      throw error;
    }
  };

  const register = async (values: RRegister, setError: (arg: RRegister) => void): Promise<void> => {
    try {
      const data = await instance.post<ResponseData<MJwt>>(
        "/api/auth/register",
        values,
      );
      if (data.status == 200) {
        Inertia.visit("/login", {});
        return;
      }
      throw data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            email: errorResponse?.email ? errorResponse?.email[0] : "",
            name: errorResponse?.name ? errorResponse?.name[0] : "",
            password: errorResponse?.password ? errorResponse?.password[0] : "",
            password_confirmation: errorResponse?.password_confirmation ? errorResponse?.password_confirmation[0] : "",
          });
        }
      }
      throw error;
    }
  };

  const resetToken = async (
    values: RResetToken,
    setError: (arg: RResetToken) => void,
  ): Promise<void> => {
    try {
      const data = await instance.post<ResponseData<void>>(
        "/api/auth/reset-token",
        values,
      );
      if (data.status == 200) {
        return;
      }
      throw data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorResponse = (error as AxiosError<ResponseData>).response?.data
          .errors;
        if (errorResponse != undefined) {
          setError({
            email: errorResponse?.email ? errorResponse?.email[0] : "",
          });
        }
      }
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const data = await instance.post<ResponseData>(
        "/api/auth/logout",
      );
      if (data.status == 200) {
        localStorage.removeItem("token");
        Inertia.visit("/login", {});
      }
      throw data;
    } catch (error) {
      throw error;
    }
  };

  return { login, register, logout, resetToken };
};

export { useAuthAction };
