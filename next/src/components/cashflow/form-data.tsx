import { useAccountAction, useBudgetAction, useMonthAction } from "@/actions";
import { MAccount, MBudget, MCashflow, MMonth, RCashflow, ResponseGetMBudget } from "@/models";
import { Button, Price, Select, Text } from "@/ui";
import { Formik, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";

interface IFormData {
  onSubmit: (args: RCashflow) => void;
  errors?: RCashflow;
  onDelete: () => void;
  initialValues?: MCashflow | RCashflow;
}

const FormData = (props: IFormData) => {
  const [showFilterBudget, setShowFilterBudget] = useState(false);
  const type = (props.initialValues as unknown as RCashflow)?.type;
  const defaultType = type == "" || type == 1 ? 1 : type == 2 ? 2 : 3;

  let initialValues: MCashflow | RCashflow = {
    ...props.initialValues,
    type: defaultType,
  };

  const { get: getBudget } = useBudgetAction();
  const { get: getMonth } = useMonthAction();
  const { get: getAccount } = useAccountAction();
  const [accountData, setAccounts] = useState<MAccount[]>();
  const [budgetData, setBudgets] = useState<ResponseGetMBudget>();
  const [monthData, setMonths] = useState<MMonth[]>();
  const [monthId, setMonthId] = useState<number>();
  const load = async () => {
    const budgets = await getBudget({
        month_id: monthId ?? "",
    });
    setBudgets(budgets.data.data);
    const months = await getMonth();
    setMonths(months.data.data);
    const accounts = await getAccount();
    setAccounts(accounts.data.data?.data);
  };

  const accounts = [{ value: "", label: "Pilih Akun" }].concat(
    (accountData ?? []).map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );

  const budgets = [{ value: "", label: "Pilih Anggaran" }].concat(
    (budgetData?.data ?? []).map((budget: MBudget) => ({
      value: String(budget.id),
      label: `${budget.plan}`,
    })),
  );

  const months = [{ value: "", label: "Pilih Bulan" }].concat(
    (monthData ?? []).map((month) => ({
      value: String(month.id),
      label: `${month.name} - ${month.year}`,
    })),
  );

  useEffect(() => {
    load();
  }, [monthId]);

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      setMonthId((values as RCashflow)?.month_id as unknown as number);
    }, [(values as RCashflow).month_id]);

    return null;
  };


  return (
    <Formik initialValues={initialValues} onSubmit={props.onSubmit}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <FormObserver />
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
            <>
              <Select
                label={
                  <p>
                    Anggaran{" "}
                    <span
                      className="cursor-pointer text-indigo-800"
                      onClick={() => setShowFilterBudget(!showFilterBudget)}
                    >
                      Filter anggaran
                    </span>
                    {showFilterBudget && (
                      <Select
                        label=""
                        formik={formik}
                        name={"month_id"}
                        options={months}
                        value={formik.values.month}
                      />
                    )}
                  </p>
                }
                formik={formik}
                name={"budget_id"}
                errors={String(props.errors?.budget_id ?? "")}
                value={String(formik.values?.budget_id ?? "")}
                options={budgets}
              />
            </>
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
          <div className="grid grid-cols-1 gap-y-2">
            <Button type="submit" block>
              Simpan
            </Button>
            {(props.initialValues as MCashflow)?.id && (
              <Button
                type="button"
                block
                color="danger"
                onClick={props.onDelete}
              >
                Hapus
              </Button>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;

