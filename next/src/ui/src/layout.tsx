import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BellIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { MInfo } from "@/models";
import { useAuthAction } from "@/actions";
import { classNames } from "@/utils/helper";
import { useInfoAction } from "@/actions";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, ToasterCustom } from "..";
import { LoaderIcon } from "react-hot-toast";

export const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon className="h-6 w-6 text-gray-500" />,
    toolbar: true,
    component: "Home",
  },
  {
    name: "Cash flow",
    href: "/cashflow",
    icon: <BanknotesIcon className="h-6 w-6 text-gray-500" />,
    toolbar: true,
    component: "Cashflow",
  },
  {
    name: "Anggaran",
    href: "/budgets",
    icon: <CurrencyDollarIcon className="h-6 w-6 text-gray-500" />,
    toolbar: true,
    component: "Budget",
  },
  {
    name: "User",
    href: "/user",
    icon: <UserIcon className="h-6 w-6 text-gray-500" />,
    toolbar: true,
    component: "Account",
  },
  {
    name: "Bulan",
    href: "/months",
    icon: <BuildingLibraryIcon className="h-6 w-6 text-gray-500" />,
    toolbar: false,
    component: "Month",
  },
  {
    name: "Tujuan",
    href: "/goals",
    icon: <DocumentIcon className="h-6 w-6 text-gray-500" />,
    toolbar: false,
    component: "Goal",
  },
  {
    name: "Profil",
    href: "/profiles",
    icon: <UserIcon className="h-6 w-6 text-gray-500" />,
    toolbar: false,
    component: "Profile",
  },
  {
    name: "Hutang Piutang",
    href: "/hutang-piutang",
    toolbar: false,
    component: "DebtsAndReceivables",
  },
];

interface ILayout {
  children: JSX.Element;
  title?: string | JSX.Element;
  description?: string | JSX.Element;
  noBottomNav?: boolean;
  noPadding?: boolean;
  loading?: boolean;
}

export const Layout = (props: ILayout) => {
  const router = useRouter();
  const { get } = useInfoAction();
  const [info, setInfo] = useState<MInfo>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { lang } = router.query;
  const load = async () => {
    const data = await get();
    setInfo(data.data.data);
  };
  const { logout } = useAuthAction();
  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem("token")) {
      router?.push(`/${lang}/login`);
    }
  }

  useLayoutEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setWidth(document?.documentElement?.offsetWidth);
    setHeight(document?.documentElement?.offsetHeight - 200);
  }, []);

  return (
      <>
        <div className="min-h-screen">
          <div className="">
            <div className="bg-white shadow-md fixed w-screen">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Link href={`/${router?.query?.lang}/dashboard`}>
                        <img
                          className="block h-8 w-auto lg:hidden"
                          src="/images/logo-square.png"
                          alt="Your Company"
                        />
                        <img
                          className="hidden h-8 w-auto lg:block"
                          src="/images/logo-square.png"
                          alt="Your Company"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="-mr-2 flex items-center gap-x-1">
                    <Button
                      href={`/notifications`}
                      locale={router.query?.lang as string}
                      size="sm"
                      color="plain"
                      className={classNames(
                        "inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border-none shadow-none",
                        router?.pathname?.includes("Notification") &&
                          "bg-gray-100",
                      )}
                      onClick={() => {}}
                    >
                      <BellIcon className="block h-6 w-6 text-gray-400" />
                    </Button>
                    {/* <Button */}
                    {/*   size="sm" */}
                    {/*   color="plain" */}
                    {/*   className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border-none shadow-none" */}
                    {/*   onClick={() => {}} */}
                    {/* > */}
                    {/*   <PlusCircleIcon className="block h-6 w-6 text-gray-400" /> */}
                    {/* </Button> */}
                    {/* Mobile menu button */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-10 d-h-container">
            <header className="mt-10">
              {(info as MInfo)?.month ||
              info?.budget ||
              info?.account ||
              info?.cashflow ? (
                <div className="px-2">
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon
                          className="h-5 w-5 text-yellow-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Sekedar Info
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: String(
                                info?.month ||
                                  info?.budget ||
                                  info?.account ||
                                  info?.cashflow,
                              ),
                            }}
                          ></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {(props.title || props.description) && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {props.title && (
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-3">
                      {props.title}
                    </h1>
                  )}
                  {props.description && (
                    <div className="text-gray-600 text-[14px]">
                      {props.description}
                    </div>
                  )}
                </div>
              )}
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                  className={`${props.noPadding ? "" : "px-4"} ${
                    props.title || props.description ? "" : ""
                  } sm:px-0`}
                >
                  {props.loading ? (
                    <div
                      className={`flex justify-center items-center my-auto z-50 bg-gray-200 h-screen absolute left-0 top-0 bg-opacity-40`}
                      style={{
                        width: `${width}px`,
                      }}
                    >
                      <LoaderIcon className="h-20 w-20 text-white animate-spin" />
                    </div>
                  ) : (
                    props.children
                  )}
                </div>
              </div>
            </main>
          </div>
          {!props.noBottomNav && (
            <section
              id="bottom-bar"
              className="bg-white fixed w-full bottom-0 h-14 border border-gray-300 shadow-2xl flex"
            >
              {navigation.map(
                (item, index) =>
                  item.toolbar && (
                    <Link
                      key={index}
                      className={classNames(
                        "flex-1 flex items-center justify-center cursor-pointer",
                        router?.pathname?.includes(item.href)
                          ? "bg-gray-200 border-r"
                          : "",
                      )}
                      href={
                        item.href != ""
                          ? `/${router.query?.lang}${item.href}`
                          : "#"
                      }
                    >
                      {item.icon}
                    </Link>
                  ),
              )}
            </section>
          )}
        </div>
        <ToasterCustom />
      </>
  );
};
