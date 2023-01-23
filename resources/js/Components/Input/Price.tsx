import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FormikProps } from "formik";
import React from "react";
import { classNames } from "../../utils/helper";

interface IPrice<t = any> {
  label: string | JSX.Element;
  formik: FormikProps<t>;
  errors?: string | undefined | number;
  name: string;
  value: any;
}
const Price = (props: IPrice) => {
  return (
    <div>
      <label
        htmlFor={`${props.name}-id`}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">Rp.</span>
        </div>
        <input
          type="number"
          name={props.name}
          id={`${props.name}-id`}
          className={classNames(
            props.errors
              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              : "",
            "block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          )}
          onChange={props.formik.handleChange}
          value={props.value}
          placeholder="0.00"
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {props.errors ? (
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            ) : (
              "IDR"
            )}
          </span>
        </div>
      </div>
      {props.errors && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {props.errors}
        </p>
      )}
    </div>
  );
};

export default Price;
