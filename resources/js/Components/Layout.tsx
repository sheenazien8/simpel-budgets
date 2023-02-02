import React, { useLayoutEffect, useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/inertia-react";
import { useAuthAction } from "../actions/auth";
import ToasterCustom from "./ToasterCustom";
import { classNames } from "../utils/helper";
import { Inertia } from "@inertiajs/inertia";
import { MInfo } from "../models";
import { useInfoAction } from "../actions/info";

interface ILayout {
  children: JSX.Element;
  title?: string | JSX.Element;
  description?: string | JSX.Element;
}

const Layout = (props: ILayout) => {
  const { get } = useInfoAction();
  const [info, setInfo] = useState<MInfo>();
  const load = async () => {
    const data = await get();
    setInfo(data.data.data);
  };
  const { logout } = useAuthAction();
  if (!localStorage.getItem("token")) {
    Inertia.visit("login");
  }
  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Bulan", href: "/months" },
    { name: "Anggaran", href: "/budgets" },
    { name: "Akun", href: "/accounts" },
    { name: "Cash flow", href: "/cashflow" },
    { name: "Tujuan", href: "/goals" },
    {
      name: "Logout",
      href: "",
      onClick: async () => {
        await logout();
      },
    },
  ];
  useLayoutEffect(() => {
    load();
  }, []);
  const { url } = usePage();
  return (
    <>
      <div className="min-h-screen">
        <div className="">
          <Disclosure as="nav" className="bg-white shadow-sm fixed w-screen">
            {({ open }: any) => (
              <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                      <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                        {navigation.map((item) => (
                          <Link
                            href={item.href != "" ? item.href : "#"}
                            onClick={item.onClick}
                            key={item.name}
                            className={classNames(
                              url.split("?")[0] === item.href.split("?")[0]
                                ? "border-indigo-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                            )}
                            aria-current={
                              url.split("?")[0] === item.href.split("?")[0]
                                ? "page"
                                : undefined
                            }
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                      <button
                        type="button"
                        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      {/* <Menu as="div" className="relative ml-3">
          <div>
          <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="sr-only">Open user menu</span>
          <img
          className="h-8 w-8 rounded-full"
          src={user.imageUrl}
          alt=""
          />
          </Menu.Button>
          </div>
          <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigation.map((item) => (
          <Menu.Item key={item.name}>
          {({ active }) => (
          <a
          href={item.href}
          className={classNames(
          active ? "bg-gray-100" : "",
          "block px-4 py-2 text-sm text-gray-700",
          )}
          >
          {item.name}
          </a>
          )}
          </Menu.Item>
          ))}
          </Menu.Items>
          </Transition>
          </Menu> */}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                  <div className="space-y-1 pt-2 pb-3">
                    {navigation.map((item) => (
                      <Link
                        href={item.href != "" ? item.href : "#"}
                        onClick={item.onClick}
                        key={item.name}
                        as="a"
                        className={classNames(
                          url.split("?")[0] === item.href.split("?")[0]
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                            : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                          "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                        )}
                        aria-current={
                          url.split("?")[0] === item.href.split("?")[0]
                            ? "page"
                            : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  {/* <div className="border-t border-gray-200 pt-4 pb-3">
          <div className="flex items-center px-4">
          <div className="flex-shrink-0">
          <img
          className="h-10 w-10 rounded-full"
          src={user.imageUrl}
          alt=""
          />
          </div>
          <div className="ml-3">
          <div className="text-base font-medium text-gray-800">
          {user.name}
          </div>
          <div className="text-sm font-medium text-gray-500">
          {user.email}
          </div>
          </div>
          <button
          type="button"
          className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          </div>
          <div className="mt-3 space-y-1">
          {userNavigation.map((item) => (
          <Disclosure.Button
          key={item.name}
          as="a"
          href={item.href}
          className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
          {item.name}
          </Disclosure.Button>
          ))}
          </div>
          </div> */}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        <div className="py-10">
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
                      <p>
                        {info?.month ||
                          info?.budget ||
                          info?.account ||
                          info?.cashflow}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <header className="mt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-3">
                {props.title}
              </h1>
              {props.description && (
                <p className="text-gray-600 text-[14px]">{props.description}</p>
              )}
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">{props.children}</div>
            </div>
          </main>
        </div>
      </div>
      <ToasterCustom />
    </>
  );
};

export default Layout;
