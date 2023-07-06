import { useBudgetAction, useMonthAction } from "@/actions";
import { MMonth, RBudget } from "@/models";
import { Button, Select } from "@/ui";
import { toastProgress } from "@/utils/helper";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface IFormCopy {
  dict: any;
  checkedsId: number[];
  onSucess: () => void;
}

const FormCopy = (props: IFormCopy) => {
  const router = useRouter();
  const { get: getMonth } = useMonthAction();
  const { copy } = useBudgetAction();
  const [monthData, setMonths] = useState<MMonth[]>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [errors, setErrors] = useState<RBudget>();
  const months = [{ value: "", label: "Pilih Bulan" }].concat(
    (monthData ?? []).map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );

  const onCopy = async (values: RBudget) => {
    setLoadingSubmit(true);
    toastProgress(
      copy({ ...values, ids: props.checkedsId }, setErrors),
      "Menyalin anggaran",
      () => {
        props.onSucess();
      },
      () => setLoadingSubmit(false),
    );
  };

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
    <Formik initialValues={{}} onSubmit={onCopy}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <Select
            label="Nama Bulan"
            formik={formik}
            name={"month_id"}
            errors={String(errors?.month_id ?? "")}
            value={String(formik.values?.month_id ?? "")}
            options={months}
          />
          <div>
            <Button loading={loadingSubmit} type="submit" block>
              Simpan
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormCopy;
