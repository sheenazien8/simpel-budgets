import { Formik } from "formik";
import React from "react";
import { MMonth, RBudget } from "../../models";
import Select from "../Input/Select";

interface IFormCopy {
  onSubmit: (args: RBudget) => void;
  errors?: RBudget;
  months: MMonth[];
}

const FormCopy = (props: IFormCopy) => {
  const months = [{ value: "", label: "Pilih Bulan" }].concat(
    props.months.map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );

  return (
    <Formik initialValues={{}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form className="space-y-4" onSubmit={formik.handleSubmit} autoComplete="off">
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
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormCopy;

