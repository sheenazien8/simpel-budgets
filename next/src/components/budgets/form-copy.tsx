import { useMonthAction } from "@/actions";
import { MMonth, RBudget } from "@/models";
import { Button, Select } from "@/ui";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";

interface IFormCopy {
  onSubmit: (args: RBudget) => void;
  errors?: RBudget;
  loadingSubmit: boolean;
}

const FormCopy = (props: IFormCopy) => {
  const { get: getMonth } = useMonthAction();
  const [monthData, setMonths] = useState<MMonth[]>();
  const months = [{ value: "", label: "Pilih Bulan" }].concat(
    (monthData ?? []).map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );

  const load = async () => {
    const months = await getMonth({
      name: "",
      year: "",
      status: Boolean(Number(1)),
    });
    setMonths(months.data.data);
  };

  useEffect(() => {
    load();
  }, []);

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


