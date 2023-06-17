import React, { useEffect, useState } from "react";
import { Formik, useFormikContext } from "formik";
import { MAccount, MBudget, MMonth, RCashflow, ResponseGetMBudget } from "@/models";
import { useAccountAction, useBudgetAction, useMonthAction } from "@/actions";
import { classNames, encodeQuery } from "@/utils/helper";
import { Select, Text } from "@/ui";
import { useRouter } from "next/router";

interface IFormFilter {
  initialFilter?: RCashflow;
  dict: any;
}

const FormFilter = (props: IFormFilter) => {
  const { get: getBudget } = useBudgetAction();
  const { get: getMonth } = useMonthAction();
  const { get: getAccount } = useAccountAction();
  const [accountData, setAccounts] = useState<MAccount[]>();
  const [budgetData, setBudgets] = useState<ResponseGetMBudget>();
  const [monthData, setMonths] = useState<MMonth[]>();
  const [monthId, setMonthId] = useState<number>();
  const router = useRouter();
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

  const accounts = [{ value: "", label: props.dict.cashflow.input.selectAccount }].concat(
    (accountData ?? []).map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );

  const budgets = [{ value: "", label: props.dict.cashflow.input.selectBudget }].concat(
    (budgetData?.data ?? []).map((budget: MBudget) => ({
      value: String(budget.id),
      label: `${budget.plan}`,
    })),
  );

  const months = [{ value: "", label: props.dict.cashflow.input.selectMonth }].concat(
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

  const onFilter = async (values: RCashflow) => {
    values.budget_id = ![2, 3].includes(Number(values.type))
      ? values.budget_id
      : "";
    router.push(`/${router.query.lang}/cashflow?${encodeQuery(values)}`);
  };

  const onClearFilter = async () => {
    router.push(`/${router.query.lang}/cashflow`);
  };

  return (
    <Formik initialValues={props.initialFilter ?? {}} onSubmit={onFilter}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <FormObserver />
          <Text
            label={props.dict.cashflow.input.note}
            formik={formik}
            name={"notes"}
            value={formik.values?.notes}
          />
          <Select
            label={props.dict.cashflow.input.selectAccount}
            formik={formik}
            name={"account_id"}
            value={String(formik.values?.account_id ?? "")}
            options={accounts}
          />
          <Select
            label={props.dict.cashflow.input.type}
            formik={formik}
            name={"type"}
            value={String(formik.values?.type ?? "")}
            options={[
              { value: "", label: props.dict.cashflow.optionType.selectAll },
              { value: 1, label: props.dict.cashflow.optionType.expense },
              { value: 2, label: props.dict.cashflow.optionType.income },
              { value: 3, label: props.dict.cashflow.optionType.transfer },
            ]}
          />
          {formik.values.type == 3 && (
            <Select
              label={props.dict.cashflow.input.accountTarget}
              formik={formik}
              name={"account_target"}
              value={String(formik.values?.account_target ?? "")}
              options={accounts}
            />
          )}
          {formik.values.type == 1 && (
            <>
              <Select
                label={props.dict.cashflow.input.selectBudget}
                formik={formik}
                name={"budget_id"}
                value={String(formik.values?.budget_id ?? "")}
                options={budgets}
              />
            </>
          )}
          <Select
            label={props.dict.cashflow.input.selectMonth}
            formik={formik}
            name={"month_id"}
            value={String(formik.values?.month_id ?? "")}
            options={months}
          />
          <div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              {props.dict.cashflow.input.save}
            </button>
            <button
              type="button"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-sm"
              onClick={onClearFilter}
            >
              {props.dict.cashflow.filter.clearFilter}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormFilter;

