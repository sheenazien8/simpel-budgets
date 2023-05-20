import React, { useLayoutEffect, useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  PlusCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/inertia-react";
import { useAuthAction } from "../actions/auth";
import ToasterCustom from "./ToasterCustom";
import { classNames, useHashRouteToggle } from "../utils/helper";
import { Inertia } from "@inertiajs/inertia";
import { MInfo } from "../models";
import { useInfoAction } from "../actions/info";
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  HomeIcon,
  PowerIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Button from "./Button";

interface ILayout {
  children: JSX.Element;
  title?: string | JSX.Element;
  description?: string | JSX.Element;
}

const Layout = (props: ILayout) => {
  const { get } = useInfoAction();
  const [info, setInfo] = useState<MInfo>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-sidebar");
  const load = async () => {
    const data = await get();
    setInfo(data.data.data);
  };
  const { logout } = useAuthAction();
  if (!localStorage.getItem("token")) {
    Inertia.visit("login");
  }
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <HomeIcon className="h-6 w-6 text-gray-500" />,
      toolbar: true,
      component: "Home",
    },
    {
      name: "Bulan",
      href: "/months",
      icon: <CalendarIcon className="h-6 w-6 text-gray-500" />,
      toolbar: true,
      component: "Month",
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
      name: "Akun",
      href: "/accounts",
      icon: <BuildingLibraryIcon className="h-6 w-6 text-gray-500" />,
      toolbar: true,
      component: "Account",
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
  ];
  useLayoutEffect(() => {
    load();
  }, []);
  const { component } = usePage();

  return (
    <>
      <div className="min-h-screen">
        <div className="">
          <Disclosure as="nav" className="bg-white shadow-md fixed w-screen">
            {() => (
              <>
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 justify-between">
                    <div className="flex">
                      <div className="flex flex-shrink-0 items-center">
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
                      </div>
                    </div>
                    <div className="-mr-2 flex items-center gap-x-1">
                      <Button
                        href="/notifications"
                        size="sm"
                        color="plain"
                        className={classNames(
                          "inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border-none shadow-none",
                          component.includes("Notification") && "bg-gray-100",
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
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel>
                  <div className="space-y-1 pt-2 pb-3">
                    {navigation.map((item) => (
                      <Link
                        href={item.href != "" ? item.href : "#"}
                        key={item.name}
                        as="a"
                        className={classNames(
                          component.includes(item.component)
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                            : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                          "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                        )}
                        aria-current={
                          component.includes(item.component)
                            ? "page"
                            : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div
                      className="p-3 shadow-transparent hover:shadow-none text-black flex justify-start w-full cursor-pointer gap-x-2 hover:bg-gray-100"
                      onClick={() => logout()}
                    >
                      <PowerIcon className="h-6 w-6 text-gray-500" />
                      <p>Logout</p>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
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
                  <p className="text-gray-600 text-[14px]">
                    {props.description}
                  </p>
                )}
              </div>
            )}
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className={`px-4 ${(props.title || props.description) ? '' : ''} sm:px-0`}>{props.children}</div>
            </div>
          </main>
        </div>
        <section
          id="bottom-bar"
          className="bg-white fixed w-full bottom-0 h-14 border border-gray-300 shadow-2xl flex"
        >
          {navigation.map(
            (item) =>
              item.toolbar && (
                <Link
                  className={classNames(
                    "flex-1 flex items-center justify-center cursor-pointer",
                    component.includes(item.component)
                      ? "bg-gray-200 border-r"
                      : "",
                  )}
                  href={item.href != "" ? item.href : "#"}
                  as="div"
                >
                  {item.icon}
                </Link>
              ),
          )}
        </section>
      </div>
      <ToasterCustom />
    </>
  );
};

export default Layout;
