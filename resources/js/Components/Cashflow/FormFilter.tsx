import React, { useEffect, useState } from "react";
import { Formik, useFormikContext } from "formik";
import {
  MAccount,
  MBudget,
  MMonth,
  RCashflow,
  ResponseGetMBudget,
} from "../../models";
import { classNames } from "../../utils/helper";
import { useAccountAction, useBudgetAction, useMonthAction } from "../../actions";
import Select from "../Input/Select";

interface IFormFilter {
  onSubmit: (arg: RCashflow) => void;
  initialFilter?: RCashflow;
  onClear: () => void;
}

const FormFilter = (props: IFormFilter) => {
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
    <Formik initialValues={props.initialFilter ?? {}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <FormObserver />
          <div>
            <label
              htmlFor="plan"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                name="plan"
                id="plan"
                onChange={formik.handleChange}
                value={formik.values.notes}
                className={classNames(
                  "block w-full rounded-md border-gray-300",
                )}
                aria-invalid="true"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="account_id"
              className="block text-sm font-medium text-gray-700"
            >
              Pilih Akun
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <select
                name="account_id"
                id="account_id"
                onChange={formik.handleChange}
                value={formik.values.account_id}
                className={classNames(
                  "block w-full rounded-md border-gray-300",
                )}
                aria-invalid="true"
              >
                <option value="">Pilih Semua</option>
                {accounts?.map(
                  (option) =>
                    option != undefined && (
                      <option value={option.value}>{option.label}</option>
                    ),
                )}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="account_id"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <select
                name="type"
                id="type"
                className={classNames(
                  "block w-full rounded-md border-gray-300",
                )}
                onChange={formik.handleChange}
                value={formik.values.type}
                aria-invalid="true"
              >
                <option value="">Pilih Semua</option>
                <option value="1">Pengeluaran</option>
                <option value="2">Pemasukan</option>
                <option value="3">Transfer</option>
              </select>
            </div>
          </div>
          {formik.values.type == 3 && (
            <div>
              <label
                htmlFor="account_target"
                className="block text-sm font-medium text-gray-700"
              >
                Pilih Akun Target
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <select
                  name="account_target"
                  id="account_target"
                  onChange={formik.handleChange}
                  value={formik.values.account_target}
                  className={classNames(
                    "block w-full rounded-md border-gray-300",
                  )}
                  aria-invalid="true"
                >
                  <option value="">Pilih Semua</option>
                  {accounts?.map(
                    (option) =>
                      option != undefined && (
                        <option value={option.value}>{option.label}</option>
                      ),
                  )}
                </select>
              </div>
            </div>
          )}
          {formik.values.type == 1 && (
            <>
              <Select
                label="Anggaran"
                formik={formik}
                name={"budget_id"}
                value={String(formik.values?.budget_id ?? "")}
                options={budgets}
              />
            </>
          )}
          <div>
            <label
              htmlFor="month_id"
              className="block text-sm font-medium text-gray-700"
            >
              Bulan
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <select
                name="month_id"
                id="month_id"
                className={classNames(
                  "block w-full rounded-md border-gray-300",
                )}
                onChange={formik.handleChange}
                value={formik.values.month_id}
                aria-invalid="true"
              >
                <option value="">Pilih Semua</option>
                {months?.map(
                  (option) =>
                    option != undefined && (
                      <option value={option.value}>{option.label}</option>
                    ),
                )}
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Simpan
            </button>
            <button
              type="button"
              className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-sm"
              onClick={props.onClear}
            >
              Clear Filter
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormFilter;
