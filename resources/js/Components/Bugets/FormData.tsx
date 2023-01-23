import { Formik } from "formik";
import React from "react";
import { MBudget, MMonth, RBudget } from "../../models";
import Price from "../Input/Price";
import Select from "../Input/Select";
import Text from "../Input/Text";

interface IFormData {
  onSubmit: (args: RBudget) => void;
  errors?: RBudget;
  onDelete: () => void;
  initialValues?: MBudget | RBudget;
  months: MMonth[];
}

const FormData = (props: IFormData) => {
  const months = [{ value: "", label: "Pilih Bulan" }].concat(
    props.months.map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );
  return (
    <Formik initialValues={props.initialValues ?? {}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          />
          <Select
            label="Nama Bulan"
            formik={formik}
            name={"month_id"}
            errors={String(props.errors?.month_id ?? "")}
            value={String(formik.values?.month_id ?? "")}
            options={months}
          />
          <div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Simpan
            </button>
            {(props.initialValues as MBudget)?.id && (
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
