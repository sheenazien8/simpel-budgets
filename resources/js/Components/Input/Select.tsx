import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FormikProps } from "formik";
import React from "react";
import { classNames } from "../../utils/helper";

interface IOption {
  label: string | JSX.Element;
  value: string | number;
}
interface ISelect<t = any> {
  options: IOption[];
  label: string | JSX.Element;
  formik: FormikProps<t>;
  errors?: string;
  name: string;
  value: any;
}
const Select = (props: ISelect) => {
  return (
    <div>
      <label
        htmlFor={`${props.name}-id`}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <select
          name={props.name}
          id={`${props.name}-id`}
          onChange={props.formik.handleChange}
          value={props.value}
          className={classNames(
            props.errors
              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              : "",
            "block w-full rounded-md border-gray-300",
          )}
          aria-invalid="true"
        >
          {props.options.map((option: IOption) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        {props.errors && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {props.errors && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {props.errors}
        </p>
      )}
    </div>
  );
};

export default Select;
