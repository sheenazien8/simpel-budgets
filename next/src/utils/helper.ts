import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
// import next config
import getConfig from "next/config";

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatMoney(number?: number, withSymbol = true) {
  if (number == undefined) {
    number = 0;
  }

  let num = new Number(number);
  if (withSymbol) {
    return num?.toLocaleString("IDR", { style: "currency", currency: "IDR" });
  }

  return num.toLocaleString("IDR");
}

export function kFormatter(num: number): string {
    return num > 999 ? (num / 1000).toFixed() : num.toString();
}

const encodeQuery = (data: any) => {
  let query = "";
  for (let d in data)
    query += encodeURIComponent(d) + "=" + encodeURIComponent(data[d]) + "&";
  return query.slice(0, -1);
};

const resolveQueryParameter = (url: string): URLSearchParams => {
  const params = new URLSearchParams(url.substring(1));

  return params;
};

const { publicRuntimeConfig } = getConfig();

const instance = axios.create({
  baseURL: publicRuntimeConfig.API_URL,
});

instance.interceptors.request.use(
  function (config) {
    const token = window?.localStorage.getItem("token");
    if (token && config.headers != undefined) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
      console.log("OK");
    return Promise.reject(error);
  },
);

const useHashRouteToggle = (modalHash: string): [boolean, Function] => {
  const [isOpen, toggleOpen] = useState(false);

  const toggleActive = (open: boolean) => {
    if (open) {
      window.location.assign(modalHash);
    } else {
      window.location.replace("#");
    }
  };

  useEffect(() => {
    const handleOnHashChange = () => {
      const isHashMatch = window.location.hash === modalHash;
      toggleOpen(isHashMatch);
    };

    window.addEventListener("hashchange", handleOnHashChange);

    return () => window.removeEventListener("hashchange", handleOnHashChange);
  }, [modalHash]);

  return [isOpen, toggleActive];
};

const toastProgress = (
  promis: Promise<any>,
  proses: string,
  succes?: Function,
  fail?: Function
) => {
  toast.promise(promis, {
    loading: `${proses} ....`,
    success: () => {
      if (succes != undefined) {
        succes();
      }
      return `${proses} sukses`;
    },
    error: (err: any) => {
      if (fail != undefined) {
        fail();
      }
      return `${proses} gagal: ${(err.response?.data as any)?.message}`;
    },
  });
};

export {
  instance,
  encodeQuery,
  resolveQueryParameter,
  useHashRouteToggle,
  toastProgress,
};

