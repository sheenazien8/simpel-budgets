import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { PlusIcon } from "@heroicons/react/20/solid";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import { DocumentIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Formik } from "formik";
import { MAccount, RAccount } from "../models/account";
import { useAccountAction } from "../actions";
import {
  classNames,
  formatMoney,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { EmptyState } from "../Components/EmptyState";

interface IAccount {}

const List = () => {
  const { get, create, detail, update, destroy } = useAccountAction();
  const [accounts, setAccounts] = useState<MAccount[]>();
  const [account_total, setAccountsTotal] = useState<number>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [editData, setEditData] = useState<MAccount>();
  const [errors, setErrors] = useState<RAccount>();

  const load = async () => {
    const accounts = await get();
    setAccounts(accounts.data.data?.data);
    setAccountsTotal(accounts.data.data?.account_sum_total);
    toggleActive(false);
  };

  useEffect(() => {
    load();
  }, [updated]);
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-500">
            Total Saldo:{" "}
            <span className="font-bold">
              {formatMoney(account_total)}
            </span>
          </h2>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            value="Tambah"
            onClick={() => {
              toggleActive(true);
              setEditData(undefined);
            }}
          >
            <PlusIcon className="h-5" />
          </button>
        </div>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 place-content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 h-[550px] overflow-x-scroll"
        >
          {accounts?.length == 0 && (
            <EmptyState
              title="Data akun kosong"
              description="Persiapkan kantung-kantung atau akun saldo anda!"
              button={
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  value="Tambah"
                  onClick={() => {
                    toggleActive(true);
                    setEditData(undefined);
                  }}
                >
                  <PlusIcon className="h-5" /> Tambah Akun
                </button>
              }
            />
          )}
          {accounts?.map((account, index) => (
            <CardList
              key={index}
              title={account.name}
              icon={<DocumentIcon className="w-6" />}
              details={[formatMoney(account.total)]}
              onClick={async () => {
                const accountData = await detail(account.id);
                toggleActive(true);
                setEditData(accountData.data.data);
                setErrors({
                  name: "",
                  total: "",
                });
              }}
            />
          ))}
        </ul>
      </div>
      <Modal
        open={isOpen}
        setOpen={(status) => toggleActive(status)}
        title={editData ? "Ubah Akun" : "Tambah Akun"}
      >
        <Formik
          initialValues={editData ?? {}}
          onSubmit={async (values: RAccount) => {
            let progess: any;
            if (!editData?.id) {
              progess = create(values, setErrors);
            } else {
              progess = update(editData.id, values, setErrors);
            }
            toastProgress(
              progess,
              `${!editData?.id ? "Pembuatan" : "Perubahan"} akun`,
              () => {
                toggleActive(false);
                setUpdated(!updated);
                setEditData(undefined);
              },
            );
          }}
        >
          {(formik) => (
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama
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
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="total"
                  className="block text-sm font-medium text-gray-700"
                >
                  Saldo
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">Rp.</span>
                  </div>
                  <input
                    type="number"
                    name="total"
                    id="total"
                    className={classNames(
                      errors?.total
                        ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                        : "",
                      "block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                    )}
                    onChange={formik.handleChange}
                    value={formik.values.total}
                    placeholder="0.00"
                    aria-describedby="price-currency"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="price-currency"
                    >
                      {errors?.name ? (
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      ) : (
                        "IDR"
                      )}
                    </span>
                  </div>
                </div>
                {errors?.total && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.total}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                >
                  Simpan
                </button>
                {editData?.id && (
                  <button
                    type="button"
                    className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                    onClick={async () => {
                      if (editData?.id != undefined) {
                        toastProgress(
                          destroy(editData?.id),
                          `Menghapus akun`,
                          () => {
                            toggleActive(false);
                            setUpdated(!updated);
                          },
                        );
                      }
                    }}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const Account = (props: IAccount) => {
  return (
    <Layout title="Akun">
      <List {...props} />
    </Layout>
  );
};

export default Account;
