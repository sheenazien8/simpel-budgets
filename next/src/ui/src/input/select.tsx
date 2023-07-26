import { classNames } from "@/utils/helper";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FormikProps } from "formik";
import React from "react";

export interface IOption {
  label: string | JSX.Element;
  value: string | number;
}
interface ISelect<t = any> {
  options: IOption[];
  label?: string | JSX.Element;
  formik?: FormikProps<t>;
  errors?: string;
  name: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading?: boolean;
  block?: boolean;
}
export const Select = (props: ISelect) => {
  return (
    <div className={classNames(props.block ? "w-full" : "")}>
      {props.label && (
        <label
          htmlFor={`${props.name}-id`}
          className="block text-sm font-medium text-gray-700"
        >
          {props.label}
        </label>
      )}
      <div className="mt-1 rounded-md shadow-sm">
        <select
          name={props.name}
          id={`${props.name}-id`}
          onChange={props.formik?.handleChange ?? props.onChange ?? (() => {})}
          value={props.value}
          className={classNames(
            props.errors
              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              : "",
            "block w-full rounded-md border-gray-300",
          )}
          aria-invalid="true"
        >
          {props.options.map((option: IOption, index) => (
            <option key={index} value={option.value}>{option.label}</option>
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
