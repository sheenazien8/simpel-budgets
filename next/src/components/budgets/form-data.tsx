import { MAccount, MBudget, MMonth, RBudget } from "@/models";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Price, Select, Text } from "@/ui";
import { useAccountAction, useBudgetAction, useMonthAction } from "@/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toastProgress } from "@/utils/helper";
import { useRouter } from "next/router";
import { useConfirm } from "../../packages/confirm";

interface IFormData {
  dict: any;
  initialValues?: MBudget | RBudget;
}

const FormData = (props: IFormData) => {
  const { confirm } = useConfirm();
  const router = useRouter();
  const { get: getMonth } = useMonthAction();
  const { create, update, destroy } = useBudgetAction();
  const { get: getAccount } = useAccountAction();
  const [monthData, setMonths] = useState<MMonth[]>();
  const [accountData, setAccounts] = useState<MAccount[]>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [errors, setErrors] = useState<RBudget>();
  const months = [{ value: "", label: "Pilih Bulan" }].concat(
    (monthData ?? []).map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );

  const accounts = [{ value: "", label: "Pilih Akun" }].concat(
    (accountData ?? []).map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );

  const load = async () => {
    const months = await getMonth({
      name: "",
      year: "",
      status: Boolean(Number(1)),
    });
    setMonths(months.data.data);
    const accounts = await getAccount({
      saving: true,
    });
    setAccounts(accounts?.data?.data?.data);
  };

  const onSubmit = async (values: RBudget) => {
    setLoadingSubmit(true);
    let progess: any;
    if (!(props.initialValues as MBudget)?.id) {
      progess = create(values, setErrors);
    } else {
      progess = update((props.initialValues as MBudget)?.id, values, setErrors);
    }
    toastProgress(
      progess,
      `${
        !(props.initialValues as MBudget)?.id ? "Pembuatan" : "Perubahan"
      } anggaran`,
      () => {
        router.push(`/${router.query.lang}/budgets`);
      },
      () => setLoadingSubmit(false),
    );
  };

  const onDelete = async () => {
    setLoadingDelete(true);
    confirm({
      title: "Hapus Anggaran",
      description: "Apakah anda yakin ingin menghapus anggaran ini?",
      yes: async () => {
        if ((props.initialValues as MBudget)?.id != undefined) {
          toastProgress(
            destroy((props.initialValues as MBudget)?.id),
            `Menghapus anggaran`,
            () => {
              router.push(`/${router.query.lang}/budgets?`);
            },
            () => setLoadingDelete(false),
          );
        }
      },
      no: () => {
        setLoadingDelete(false);
      },
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Formik initialValues={props.initialValues ?? {}} onSubmit={onSubmit}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <Text
            label="Rencana"
            formik={formik}
            name={"plan"}
            errors={errors?.plan}
            value={formik.values?.plan}
          />
          <Price
            label="Nominal"
            formik={formik}
            name={"nominal"}
            errors={errors?.nominal}
            value={formik.values?.nominal}
            currency="Rp"
          />
          <Select
            label="Nama Bulan"
            formik={formik}
            name={"month_id"}
            errors={String(errors?.month_id ?? "")}
            value={String(formik.values?.month_id ?? "")}
            options={months}
          />
          <Select
            label="Tipe anggaran"
            formik={formik}
            name={"type"}
            errors={String(errors?.type ?? "")}
            value={String(formik.values?.type ?? "1")}
            options={[
              {
                value: "1",
                label: "Pengeluaran",
              },
              {
                value: "2",
                label: "Tabungan",
              },
            ]}
          />
          {String(formik.values.type) === "2" && (
            <Select
              label="Akun"
              formik={formik}
              name={"account_id"}
              errors={String(errors?.account_id ?? "")}
              value={String(formik.values?.account_id ?? "")}
              options={accounts}
            />
          )}
          <div className="flex gap-x-2">
            <Button loading={loadingSubmit} type="submit" block>
              Simpan
            </Button>
            {(props.initialValues as MBudget)?.id && (
              <Button
                type="button"
                onClick={onDelete}
                loading={loadingDelete}
                color="danger"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;
