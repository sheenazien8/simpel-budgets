import { MAccount, MBudget, MMonth, RBudget } from "@/models";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Price, Select, CustomSelect, Text } from "@/ui";
import { useAccountAction, useMonthAction } from "@/actions";

interface IFormData {
  onSubmit: (args: RBudget) => void;
  errors?: RBudget;
  onDelete: () => void;
  initialValues?: MBudget | RBudget;
  loadingSubmit: boolean;
  loadingDelete: boolean;
}

const FormData = (props: IFormData) => {
  const { get: getMonth } = useMonthAction();
  const { get: getAccount } = useAccountAction();
  const [monthData, setMonths] = useState<MMonth[]>();
  const [accountData, setAccounts] = useState<MAccount[]>();
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

  useEffect(() => {
    load();
  }, []);

  return (
    <Formik initialValues={props.initialValues ?? {}} onSubmit={props.onSubmit}>
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
            errors={props.errors?.plan}
            value={formik.values?.plan}
          />
          <Price
            label="Nominal"
            formik={formik}
            name={"nominal"}
            errors={props.errors?.nominal}
            value={formik.values?.nominal}
            currency="Rp"
          />
          <CustomSelect
            label="Nama Bulan"
            formik={formik}
            name={"month_id"}
            errors={String(props.errors?.month_id ?? "")}
            value={String(formik.values?.month_id ?? "")}
            options={months}
          />
          <Select
            label="Tipe anggaran"
            formik={formik}
            name={"type"}
            errors={String(props.errors?.type ?? "")}
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
            errors={String(props.errors?.account_id ?? "")}
            value={String(formik.values?.account_id ?? "")}
            options={accounts}
          />
          )}
          <div className="grid grid-cols-1 gap-y-2">
            <Button loading={props.loadingSubmit} type="submit">
              Simpan
            </Button>
            {(props.initialValues as MBudget)?.id && (
              <Button
                type="button"
                onClick={props.onDelete}
                loading={props.loadingDelete}
                color="danger"
              >
                Hapus
              </Button>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;
