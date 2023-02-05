import { Formik } from "formik";
import React from "react";
import { MMonth, RBudget } from "../../models";
import Button from "../Button";
import Select from "../Input/Select";

interface IFormCopy {
  onSubmit: (args: RBudget) => void;
  errors?: RBudget;
  months: MMonth[];
  loadingSubmit: boolean;
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
            <Button
              type="submit"
              block
            >
              Simpan
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormCopy;

