import { Formik } from "formik";
import React from "react";
import { FBudget, MMonth } from "../../models";
import Select from "../Input/Select";
import Text from "../Input/Text";

interface IFormFilter {
  onSubmit: (arg: FBudget) => void;
  initialFilter?: FBudget;
  onClear: () => void;
  months: MMonth[];
}

const FormFilter = (props: IFormFilter) => {
  const months = [{value: "", label: "Clear Bulan"}, { value: "0", label: "Pilih Semua" }].concat(
    props.months.map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );
  return (
    <Formik initialValues={props.initialFilter ?? {}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form className="space-y-4" onSubmit={formik.handleSubmit} autoComplete="off">
          <Text
            label={"Rencana"}
            formik={formik}
            name={"plan"}
            value={formik.values?.plan}
          />
          <Select
            value={String(formik.values?.month_id ?? "")}
            label="Nama Bulan"
            formik={formik}
            name={"month_id"}
            options={months}
          />
          <div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Simpan
            </button>
            <button
              type="button"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-sm"
              onClick={props.onClear}
            >
              Clear Filter
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormFilter;
