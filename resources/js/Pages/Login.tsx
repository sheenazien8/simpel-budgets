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
import { RLogin } from "../models";
import { classNames, toastProgress } from "../utils/helper";

export default function Login() {
  const { login } = useAuthAction();
  const [errors, setErrors] = useState<RLogin>();
  const [showPassword, setShowpassword] = useState<boolean>(false);

  return (
    <LayoutGuest>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-20 w-auto"
            src="/images/logo-square.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Masuk ke rencana keuangan anda!
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
                username: "",
                password: "",
              }}
              onSubmit={async (values: RLogin) => {
                toastProgress(login(values, setErrors), "Login")
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
                        name="username"
                        id="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        className={classNames(
                          errors?.username
                            ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                            : "",
                          "block w-full rounded-md border-gray-300",
                        )}
                        aria-invalid="true"
                      />
                      {errors?.username && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                    {errors?.username && (
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        {errors.username}
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
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="/reset-password"
                        as="a"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
            </Formik>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Atau jika belum punya akun silahkan mendaftarkan diri.
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <Link
                    href="/register"
                    as="a"
                    className="inline-flex w-full justify-center rounded-md border border-indigo-300 bg-white py-2 px-4 text-sm font-medium text-indigo-500 shadow-sm hover:bg-indigo-50"
                  >
                    <span className="sr-only">Daftar!</span>
                    <p>Register</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGuest>
  );
}
