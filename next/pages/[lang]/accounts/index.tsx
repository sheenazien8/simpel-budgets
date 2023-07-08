import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { DocumentIcon } from "@heroicons/react/20/solid";
import { Formik } from "formik";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useAccountAction } from "@/actions";
import { MAccount, RAccount } from "@/models";
import { formatMoney, toastProgress, useHashRouteToggle } from "@/utils/helper";
import {
  Button,
  CardList,
  EmptyState,
  Layout,
  Modal,
  Price,
  Text,
  Toggle,
} from "@/ui";
import { getDictionary } from "../dictionaries";
import { TrashIcon } from "@heroicons/react/24/outline";

interface IAccount {
  dict: any;
  locale: string;
}

export async function getStaticProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      dict: dict,
      locale: props.params.lang,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { lang: "id" } }, { params: { lang: "en" } }],
    fallback: false,
  };
}

export default function Page(props: IAccount) {
  const { get, create, detail, update, destroy } = useAccountAction();
  const [accounts, setAccounts] = useState<MAccount[]>();
  const [account_total, setAccountsTotal] = useState<number>();
  const [updated, setUpdated] = useState<boolean>(false);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [editData, setEditData] = useState<MAccount>();
  const [errors, setErrors] = useState<RAccount>();
  const [showSaldo, setShowSaldo] = useState<boolean>(false);
  const [loadingSubmit, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

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
    <Layout title="Akun" loading={!accounts} noBottomNav>
      <>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500 flex items-center">
              Total Saldo:{" "}
              {showSaldo ? (
                <>
                  <span className="font-bold">
                    {formatMoney(account_total)}
                  </span>
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
            className="mt-3 grid grid-cols-1 place-content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 overflow-x-scroll"
          >
            {accounts?.length == 0 && (
              <EmptyState
                title="Data akun kosong"
                description="Persiapkan kantung-kantung atau akun saldo anda!"
                button={
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => {
                        toggleActive(true);
                        setEditData(undefined);
                      }}
                    >
                      <PlusIcon className="h-5" /> Tambah Akun
                    </Button>
                  </div>
                }
              />
            )}
            {accounts?.map((account, index) => (
              <CardList
                key={index}
                title={account.name}
                icon={<DocumentIcon className="w-6" />}
                details={[
                  Number(account.hide) == 1
                    ? "*******"
                    : formatMoney(account.total),
                ]}
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
              setLoading(true);
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
                  setLoading(false);
                  toggleActive(false);
                  setUpdated(!updated);
                  setEditData(undefined);
                },
                () => setLoading(false),
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
                  currency="Rp"
                />
                <Toggle
                  formik={formik}
                  name="hide"
                  value={formik.values.hide}
                  checked={editData?.hide ?? false}
                  label="Sembunyikan saldo"
                />
                <Toggle
                  formik={formik}
                  name="saving"
                  value={formik.values.saving}
                  checked={editData?.saving ?? false}
                  label="Jadikan akun tabungan"
                />
                <div className="flex gap-x-2">
                  <Button loading={loadingSubmit} type="submit" block>
                    Simpan
                  </Button>
                  {editData?.id && (
                    <Button
                      loading={loadingDelete}
                      type="button"
                      color="danger"
                      onClick={async () => {
                        setLoadingDelete(true);
                        if (editData?.id != undefined) {
                          toastProgress(
                            destroy(editData?.id),
                            `Menghapus akun`,
                            () => {
                              setLoadingDelete(false);
                              toggleActive(false);
                              setUpdated(!updated);
                            },
                            () => setLoadingDelete(false),
                          );
                        }
                      }}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </form>
            )}
          </Formik>
        </Modal>
      </>
    </Layout>
  );
}
