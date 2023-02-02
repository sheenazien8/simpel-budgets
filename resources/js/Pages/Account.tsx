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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Text from "../Components/Input/Text";
import Price from "../Components/Input/Price";
import Toggle from "../Components/Input/Toggle";

interface IAccount {}

const List = () => {
  const { get, create, detail, update, destroy } = useAccountAction();
  const [accounts, setAccounts] = useState<MAccount[]>();
  const [account_total, setAccountsTotal] = useState<number>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [editData, setEditData] = useState<MAccount>();
  const [errors, setErrors] = useState<RAccount>();
  const [showSaldo, setShowSaldo] = useState<boolean>(false);

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
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Total Saldo:{" "}
            {showSaldo ? (
              <>
                <span className="font-bold">{formatMoney(account_total)}</span>
                <EyeSlashIcon
                  className="ml-3 w-6 cursor-pointer"
                  onClick={() => setShowSaldo(!showSaldo)}
                />
              </>
            ) : (
              <>
                <span className="font-bold">*********</span>
                <EyeIcon
                  className="ml-3 w-6 cursor-pointer"
                  onClick={() => setShowSaldo(!showSaldo)}
                />
              </>
            )}
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
              details={[Number(account.hide) == 1 ? "*******" : formatMoney(account.total)]}
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
              <Text
                label="Nama"
                formik={formik}
                name={"name"}
                type={"text"}
                errors={errors?.name}
                value={formik.values.name}
              />
              <Price
                label="Saldo"
                formik={formik}
                name={"total"}
                errors={errors?.total}
                value={formik.values.total}
              />
              <Toggle
                formik={formik}
                name="hide"
                value={formik.values.hide}
                label="Sembunyikan saldo"
              />
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
