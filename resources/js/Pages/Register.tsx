import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { Formik } from "formik";
import React, { useState } from "react";
import { useAuthAction } from "../actions/auth";
import Button from "../Components/Button";
import Text from "../Components/Input/Text";
import LayoutGuest from "../Components/LayoutGuest";
import { RRegister } from "../models";
import { classNames, toastProgress } from "../utils/helper";

export default function Register() {
  const { register } = useAuthAction();
  const [errors, setErrors] = useState<RRegister>();
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
                  setLoading(true);
                  toastProgress(
                    register(values, setErrors),
                    "Register",
                    () => setLoading(false),
                    () => setLoading(false),
                  );
                }}
              >
                {(formik) => (
                  <form className="space-y-6" onSubmit={formik.handleSubmit}>
                    <Text
                      name="name"
                      label="Username"
                      type="text"
                      formik={formik}
                      value={formik.values.name}
                      errors={errors?.name}
                    />

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
                      <Button type="submit" block loading={loading}>
                        Daftar
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <Button
                    color="plain"
                    href="login"
                    className="hover:bg-indigo-50 border border-indigo-300 text-indigo-500"
                  >
                    <span className="sr-only">Daftar!</span>
                    <p>Login</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </LayoutGuest>
  );
}
