import { Formik } from "formik";
import React from "react";
import { MAccount, MBudget, MCashflow, RCashflow } from "../../models";
import Price from "../Input/Price";
import Select from "../Input/Select";
import Text from "../Input/Text";

interface IFormData {
  onSubmit: (args: RCashflow) => void;
  errors?: RCashflow;
  accounts: MAccount[];
  budgets: MBudget[];
  onDelete: () => void;
  initialValues?: MCashflow | RCashflow;
}

const FormData = (props: IFormData) => {
  const type = (props.initialValues as unknown as RCashflow)?.type;
  const defaultType = type == "" || type == 1 ? 1 : 2;

  let initialValues: MCashflow | RCashflow = {
    ...props.initialValues,
    type: defaultType,
  };

  const accounts = [{ value: "", label: "Pilih Akun" }].concat(
    props.accounts.map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );

  const budgets = [{ value: "", label: "Pilih Anggaran" }].concat(
    props.budgets.map((budget) => ({
      value: String(budget.id),
      label: `${budget.plan}`,
    })),
  );

  return (
    <Formik initialValues={initialValues} onSubmit={props.onSubmit}>
      {(formik) => (
        <form className="space-y-4" onSubmit={formik.handleSubmit} autoComplete="off">
          <Price
            label="Nominal"
            formik={formik}
            name={"nominal"}
            errors={props.errors?.nominal}
            value={formik.values?.nominal}
          />

          <Select
            label="Akun"
            formik={formik}
            name={"account_id"}
            errors={String(props.errors?.account_id ?? "")}
            value={String(formik.values?.account_id ?? "")}
            options={accounts}
          />
          <Select
            label="Type"
            formik={formik}
            name={"type"}
            errors={String(props.errors?.type ?? "")}
            value={String(formik.values?.type ?? "")}
            options={[
              { value: 1, label: "Pengeluaran" },
              { value: 2, label: "Pemasukan" },
              { value: 3, label: "Transfer" },
            ]}
          />
          {formik.values.type == 3 && (
            <Select
              label="Akun Target"
              formik={formik}
              name={"account_target"}
              errors={String(props.errors?.account_target ?? "")}
              value={String(formik.values?.account_target ?? "")}
              options={accounts}
            />
          )}
          {formik.values.type == 1 && (
            <Select
              label="Budget"
              formik={formik}
              name={"budget_id"}
              errors={String(props.errors?.budget_id ?? "")}
              value={String(formik.values?.budget_id ?? "")}
              options={budgets}
            />
          )}
          <Text
            label="Tanggal"
            formik={formik}
            name={"date"}
            type={"date"}
            errors={props.errors?.date}
            value={formik.values?.date}
          />
          <Text
            label="Catatan"
            formik={formik}
            name={"notes"}
            errors={props.errors?.notes}
            value={formik.values?.notes}
          />
          <div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Simpan
            </button>
            {(props.initialValues as MCashflow)?.id && (
              <button
                type="button"
                className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                onClick={props.onDelete}
              >
                Hapus
              </button>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;
