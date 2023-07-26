import React, { useEffect, useState } from "react";
import { Formik, useFormikContext } from "formik";
import {
  MAccount,
  MBudget,
  MMonth,
  RCashflow,
  ResponseGetMBudget,
} from "@/models";
import { useAccountAction, useBudgetAction, useMonthAction } from "@/actions";
import { encodeQuery } from "@/utils/helper";
import { Button, Select, Text } from "@/ui";
import { useRouter } from "next/router";
import { XMarkIcon } from "@heroicons/react/24/solid";

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

  const accounts = [
    { value: "", label: props.dict.cashflow.input.selectAccount },
  ].concat(
    (accountData ?? []).map((account) => ({
      value: String(account.id),
      label: `${account.name}`,
    })),
  );

  const budgets = [
    { value: "", label: props.dict.cashflow.input.selectBudget },
  ].concat(
    (budgetData?.data ?? []).map((budget: MBudget) => ({
      value: String(budget.id),
      label: `${budget.plan}`,
    })),
  );

  const months = [
    { value: "", label: props.dict.cashflow.input.selectMonth },
  ].concat(
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
          <div className="flex justify-between gap-x-2">
            <Button type="submit" block>
              {props.dict.common.search}
            </Button>
            <Button color="secondary" type="button" onClick={onClearFilter} className="flex items-center">
              <XMarkIcon className="h-5 w-5 text-white" />
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormFilter;
