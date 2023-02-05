import { Formik } from "formik";
import React from "react";
import { FBudget, MMonth } from "../../models";
import Button from "../Button";
import Select from "../Input/Select";
import Text from "../Input/Text";

interface IFormFilter {
  onSubmit: (arg: FBudget) => void;
  initialFilter?: FBudget;
  onClear: () => void;
  months: MMonth[];
  loadingSubmit: boolean;
}

const FormFilter = (props: IFormFilter) => {
  const months = [
    { value: "", label: "Clear Bulan" },
    { value: "0", label: "Pilih Semua" },
  ].concat(
    props.months.map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );
  return (
    <Formik initialValues={props.initialFilter ?? {}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
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
          <div className="grid grid-cols-1 gap-y-2">
            <Button block type="submit" loading={props.loadingSubmit}>
              Simpan
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={props.onClear}
            >
              Clear Filter
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormFilter;
