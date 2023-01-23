import {
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/inertia-react";
import { Formik } from "formik";
import React, { useState } from "react";
import { useAuthAction } from "../actions/auth";
import { RResetToken } from "../models";
import { classNames } from "../utils/helper";

export default function ResetPassword() {
  const { resetToken } = useAuthAction();
  const [errors, setErrors] = useState<RResetToken>();

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Percayakan arus keuangan anda ke kami!
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{
                email: ""
              }}
              onSubmit={async (values: RResetToken) => {
                try {
                    await resetToken(values, setErrors);
                } catch (error) {

                }
              }}
            >
              {(formik) => (
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
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
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Kirim Link
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
          </div>
        </div>
      </div>
    </>
  );
}

