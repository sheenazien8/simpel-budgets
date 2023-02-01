import React from "react";
import { Formik } from "formik";
import { MAccount, MBudget, RCashflow } from "../../models";
import { classNames } from "../../utils/helper";

interface IFormFilter {
  onSubmit: (arg: RCashflow) => void;
  initialFilter?: RCashflow;
  onClear: () => void;
  accounts: MAccount[];
  budgets: MBudget[];
}

const FormFilter = (props: IFormFilter) => {
  return (
    <Formik initialValues={props.initialFilter ?? {}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form className="space-y-4" onSubmit={formik.handleSubmit} autoComplete="off">
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
                {props.accounts?.map(
                  (option) =>
                    option != undefined && (
                      <option value={option.id}>{option.name}</option>
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
                  {props.accounts?.map(
                    (option) =>
                      option != undefined && (
                        <option value={option.id}>{option.name}</option>
                      ),
                  )}
                </select>
              </div>
            </div>
          )}

          {formik.values.type == 1 && (
            <div>
              <label
                htmlFor="budget_id"
                className="block text-sm font-medium text-gray-700"
              >
                Pilih Budget
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <select
                  name="budget_id"
                  id="budget_id"
                  onChange={formik.handleChange}
                  value={formik.values.budget_id}
                  className={classNames(
                    "block w-full rounded-md border-gray-300",
                  )}
                  aria-invalid="true"
                >
                  <option value="">Pilih Semua</option>
                  {props.budgets?.map(
                    (option) =>
                      option != undefined && (
                        <option value={option.id}>{option.plan}</option>
                      ),
                  )}
                </select>
              </div>
            </div>
          )}
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
