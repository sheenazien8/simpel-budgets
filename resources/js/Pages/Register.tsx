import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/inertia-react";
import { Formik } from "formik";
import React, { useState } from "react";
import { useAuthAction } from "../actions/auth";
import LayoutGuest from "../Components/LayoutGuest";
import { RRegister } from "../models";
import { classNames, toastProgress } from "../utils/helper";

export default function Register() {
  const { register } = useAuthAction();
  const [errors, setErrors] = useState<RRegister>();
  const [showPassword, setShowpassword] = useState<boolean>(false);

  return (
    <LayoutGuest>
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="/images/logo-square.png"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Daftar dan rasakan keajaibannya.
            </h2>
            {/* <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              start your 14-day free trial
            </a>
          </p> */}
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <Formik
                initialValues={{
                  email: "",
                  name: "",
                  password: "",
                  password_confirmation: "",
                }}
                onSubmit={async (values: RRegister) => {
                  toastProgress(register(values, setErrors), "Register");
                }}
              >
                {(formik) => (
                  <form className="space-y-6" onSubmit={formik.handleSubmit}>
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={formik.handleChange}
                          value={formik.values.name}
                          className={classNames(
                            errors?.name
                              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                              : "",
                            "block w-full rounded-md border-gray-300",
                          )}
                          aria-invalid="true"
                        />
                        {errors?.name && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                      {errors?.name && (
                        <p
                          className="mt-2 text-sm text-red-600"
                          id="email-error"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          className={classNames(
                            errors?.email
                              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                              : "",
                            "block w-full rounded-md border-gray-300",
                          )}
                          aria-invalid="true"
                        />
                        {errors?.email && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                      {errors?.email && (
                        <p
                          className="mt-2 text-sm text-red-600"
                          id="email-error"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          className={classNames(
                            errors?.password
                              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                              : "",
                            "block w-full rounded-md border-gray-300",
                          )}
                          aria-invalid="true"
                        />
                        {errors?.password ? (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowpassword(!showPassword)}
                          >
                            {!showPassword ? (
                              <EyeSlashIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            ) : (
                              <EyeIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        )}
                      </div>
                      {errors?.password && (
                        <p
                          className="mt-2 text-sm text-red-600"
                          id="email-error"
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Konfirmasi Password
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password_confirmation"
                          id="password_confirmation"
                          onChange={formik.handleChange}
                          value={formik.values.password_confirmation}
                          className={classNames(
                            errors?.password_confirmation
                              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                              : "",
                            "block w-full rounded-md border-gray-300",
                          )}
                          aria-invalid="true"
                        />
                        {errors?.password_confirmation && (
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                      {errors?.password_confirmation && (
                        <p
                          className="mt-2 text-sm text-red-600"
                          id="email-error"
                        >
                          {errors.password_confirmation}
                        </p>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Daftar
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <Link
                    href="login"
                    as="a"
                    className="inline-flex w-full justify-center rounded-md border border-indigo-300 bg-white py-2 px-4 text-sm font-medium text-indigo-500 shadow-sm hover:bg-indigo-50"
                  >
                    <span className="sr-only">Daftar!</span>
                    <p>Login</p>
                  </Link>
                </div>
              </div>

              {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <a
                    href="#"
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
      </>
    </LayoutGuest>
  );
}
