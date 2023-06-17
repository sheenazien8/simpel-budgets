import {
  useAccountAction,
  useBudgetAction,
  useCashflowAction,
  useMonthAction,
} from "@/actions";
import {
  MAccount,
  MBudget,
  MCashflow,
  MMonth,
  RCashflow,
  ResponseGetMBudget,
} from "@/models";
import { Button, Price, Select, Text } from "@/ui";
import { toastProgress } from "@/utils/helper";
import { Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface IFormData {
  initialValues?: MCashflow | RCashflow;
  id?: number | undefined;
  dict: any;
  locale: any;
}

const FormData = (props: IFormData) => {
  const router = useRouter();
  const [showFilterBudget, setShowFilterBudget] = useState(false);
  const type = (props.initialValues as unknown as RCashflow)?.type;
  let defaultType = 1;
  if (type != undefined) {
      defaultType = type == 0 || type == 1 ? 1 : type == 2 ? 2 : 3;
  }
  const { create, update, destroy } = useCashflowAction();
  const [errors, setErrors] = useState<RCashflow>();
  const { get: getBudget } = useBudgetAction();
  const { get: getMonth } = useMonthAction();
  const { get: getAccount } = useAccountAction();
  const [accountData, setAccounts] = useState<MAccount[]>();
  const [budgetData, setBudgets] = useState<ResponseGetMBudget>();
  const [monthData, setMonths] = useState<MMonth[]>();
  const [monthId, setMonthId] = useState<number>();

  let initialValues: MCashflow | RCashflow = {
    ...props.initialValues,
    type: defaultType,
  };
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

  const onDelete = async () => {
    if (props.id != undefined) {
      toastProgress(destroy(props?.id), `Menghapus anggaran`, () => {
        router.push(`/${router.query?.lang}/cashflow`);
      });
    }
  };

  const onSubmit = async (values: RCashflow) => {
    values.budget_id = ![2, 3].includes(Number(values.type))
      ? values.budget_id
      : undefined;
    let progess: any;
    if (props.id == undefined) {
      progess = create(values, setErrors);
    } else {
      progess = update(props.id, values, setErrors);
    }
    toastProgress(
      progess,
      `${
        !props?.id
          ? props.dict.cashflow.message.createSuccess
          : props.dict.cashflow.message.updateSuccess
      }`,
      () => {
        router.replace(`/${router.query?.lang}/cashflow`);
      },
    );
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <FormObserver />
          <Select
            label={props.dict.cashflow.input.type}
            formik={formik}
            name={"type"}
            errors={String(errors?.type ?? "")}
            value={String(formik.values?.type ?? "")}
            options={[
              { value: 1, label: props.dict.cashflow.optionType.expense },
              { value: 2, label: props.dict.cashflow.optionType.income },
              { value: 3, label: props.dict.cashflow.optionType.transfer },
            ]}
          />
          <Price
            label={props.dict.cashflow.input.nominal}
            formik={formik}
            name={"nominal"}
            errors={errors?.nominal}
            value={formik.values?.nominal}
          />

          <Select
            label={props.dict.cashflow.input.account}
            formik={formik}
            name={"account_id"}
            errors={String(errors?.account_id ?? "")}
            value={String(formik.values?.account_id ?? "")}
            options={accounts}
          />
          {formik.values.type == 3 && (
            <Select
              label={props.dict.cashflow.input.accountTarget}
              formik={formik}
              name={"account_target"}
              errors={String(errors?.account_target ?? "")}
              value={String(formik.values?.account_target ?? "")}
              options={accounts}
            />
          )}
          {formik.values.type == 1 && (
            <>
              <Select
                label={
                  <p>
                    {props.dict.cashflow.input.budget}
                    <span
                      className="cursor-pointer text-indigo-800"
                      onClick={() => setShowFilterBudget(!showFilterBudget)}
                    >
                      {props.dict.cashflow.input.budgetFilter}
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
                errors={String(errors?.budget_id ?? "")}
                value={String(formik.values?.budget_id ?? "")}
                options={budgets}
              />
            </>
          )}
          <Text
            label={props.dict.cashflow.input.date}
            formik={formik}
            name={"date"}
            type={"date"}
            errors={errors?.date}
            value={formik.values?.date}
          />
          <Text
            label={props.dict.cashflow.input.note}
            formik={formik}
            name={"notes"}
            errors={errors?.notes}
            value={formik.values?.notes}
          />
          <div className="grid grid-cols-1 gap-y-2">
            <Button type="submit" block>
              {props.dict.cashflow.input.save}
            </Button>
            {(props.initialValues as MCashflow)?.id && (
              <Button type="button" block color="danger" onClick={onDelete}>
                {props.dict.cashflow.input.delete}
              </Button>
            )}
            <Button
              type="button"
              block
              color="secondary"
              onClick={() => router.back()}
              locale={props.locale}
            >
              {props.dict.cashflow.input.cancel}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;
