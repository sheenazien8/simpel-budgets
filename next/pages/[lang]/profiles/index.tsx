import { useAuthAction } from "@/actions";
import { IProfile, RResetPassword } from "@/models";
import { Button, Layout, Modal, Text } from "@/ui";
import { classNames, toastProgress } from "@/utils/helper";
import {
  CogIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const { resetPassword, getProfile, logout } = useAuthAction();
  const [errors, setErrors] = useState<RResetPassword>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfile>();

  const load = async () => {
    const data = await getProfile();
    setProfile(data.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout title="Profil" loading={!profile}>
      <>
        <Modal
          open={showModal}
          setOpen={(status) => {
            setShowModal(status);
          }}
          title="Ganti kata sandi"
        >
          <Formik
            initialValues={{
              email: profile?.email ?? "",
              password: "",
              password_confirmation: "",
            }}
            onSubmit={async (values: RResetPassword) => {
              setLoading(true);
              toastProgress(
                resetPassword(values, setErrors),
                "Mengubah kata sandi",
                () => {
                  setShowModal(false);
                  setLoading(false);
                },
                () => {
                  setLoading(false);
                },
              );
            }}
          >
            {(formik) => (
              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <Text
                  disabled={true}
                  name="email"
                  label={""}
                  formik={formik}
                  value={formik.values.email}
                />
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
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
                <div>
                  <Button type="submit" block loading={loading}>
                    Simpan
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Modal>

        <div className="grid grid-cols-1 gap-4">
          <div>
            Nama Pengguna: <span className="font-bold">{profile?.name}</span>
          </div>
          <div>
            Email: <span className="font-bold">{profile?.email}</span>
          </div>
          <div>
            Bergabung sejak:{" "}
            <span className="font-bold">{profile?.joined_at}</span>
          </div>

          <Button onClick={() => setShowModal(!showModal)} className="gap-x-2">
            <CogIcon className="h-6 w-6" />
            Ganti kata sandi
          </Button>
          <Button onClick={() => logout()} className="gap-x-2" color="warning">
            <PowerIcon className="h-6 w-6" /> Logout
          </Button>
        </div>
      </>
    </Layout>
  );
};

export default Profile;

