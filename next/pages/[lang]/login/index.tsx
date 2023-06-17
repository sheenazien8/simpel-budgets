import { useAuthAction } from "@/actions";
import { RLogin } from "@/models";
import { Button, LayoutGuest, Text } from "@/ui";
import { classNames, toastProgress } from "@/utils/helper";
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getDictionary } from "./../dictionaries";

export async function getStaticProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      lang: dict.login,
      locale: props.params.lang,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [
      { params: { lang: "id", verified: "true" } },
      { params: { lang: "en", verified: "true" } },
    ],
    fallback: false,
  };
}

export default function Login({ lang, locale }: any) {
  const router = useRouter();
  const { verified } = router?.query;
  const { login } = useAuthAction();
  const [errors, setErrors] = useState<RLogin>();
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (verified === "true") {
      toast.success("Email berhasil diverifikasi, silahkan login!");
      router?.push("/login");
    }
  }, [verified]);

  return (
    <LayoutGuest>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            height={80}
            width={100}
            className="mx-auto h-20 w-auto"
            src="/images/logo-square.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {lang.welcome}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={async (values: RLogin) => {
                setLoading(true);
                toastProgress(
                  login(values, setErrors),
                  "Login",
                  () => setLoading(false),
                  () => setLoading(false),
                );
              }}
            >
              {(formik) => (
                <form
                  className="space-y-6"
                  onSubmit={formik.handleSubmit}
                  autoComplete="off"
                >
                  <Text
                    name="username"
                    label={lang.username}
                    type="text"
                    formik={formik}
                    value={formik.values.username}
                    errors={errors?.username}
                  />
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {lang.password}
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

                  <div className="flex items-center justify-between flex-row-reverse">
                    <div className="text-sm">
                      <Link
                        href="/reset-password"
                        as="a"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        {lang.forgot}
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Button type="submit" block size="md" loading={loading}>
                      {lang.signin}
                    </Button>
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
                    {lang.textRegister}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <Button
                    color="plain"
                    href="/register"
                    locale={locale}
                    className="hover:bg-indigo-50 border border-indigo-300 text-indigo-500"
                  >
                    <span className="sr-only">{lang.register}</span>
                    <p className="text-indigo-500">{lang.register}!</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGuest>
  );
}
