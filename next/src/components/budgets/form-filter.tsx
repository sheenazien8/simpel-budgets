import { useMonthAction } from "@/actions";
import { FBudget, MMonth } from "@/models";
import { Button, Select, Text } from "@/ui";
import { encodeQuery } from "@/utils/helper";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface IFormFilter {
  initialFilter?: FBudget;
  dict: any;
}

const FormFilter = (props: IFormFilter) => {
  const { get: getMonth } = useMonthAction();
  const [monthData, setMonths] = useState<MMonth[]>();
  const router = useRouter();
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

  const onFilter = async (values: FBudget) => {
    router.push(`/${router.query.lang}/budgets?${encodeQuery(values)}`);
  };

  const onClearFilter = async () => {
    router.push(`/${router.query.lang}/budgets`);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Formik initialValues={props.initialFilter ?? {}} onSubmit={onFilter}>
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
          <div className="flex gap-x-2">
            <Button block type="submit">
              Simpan
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={onClearFilter}
              className="flex items-center"
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormFilter;

