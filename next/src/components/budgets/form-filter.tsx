import { useMonthAction } from "@/actions";
import { FBudget, MMonth } from "@/models";
import { Button, Select, Text } from "@/ui";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";

interface IFormFilter {
  onSubmit: (arg: FBudget) => void;
  initialFilter?: FBudget;
  onClear: () => void;
  loadingSubmit: boolean;
}

const FormFilter = (props: IFormFilter) => {
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

