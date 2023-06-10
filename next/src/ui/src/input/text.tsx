import { classNames } from "@/utils/helper";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FormikProps } from "formik";
import React from "react";

interface IText<t = any> {
  label: string | JSX.Element;
  formik: FormikProps<t>;
  errors?: string | undefined | number;
  name: string;
  value: any;
  type?: string;
  disabled?: boolean;
}

export const Text = (props: IText) => {
  return (
    <div>
      <label
        htmlFor={`${props.name}-id`}
        className={classNames(
          "block text-sm font-medium text-gray-700",
          props.type == "hidden" && "sr-only",
        )}
      >
        {props.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          disabled={props.disabled}
          type={props.type ?? "text"}
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
        />
        {props.errors && (
          <div
            className={classNames(
              "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
              props.type == "hidden" && "sr-only",
            )}
          >
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {props.errors && (
        <p
          className={classNames(
            "mt-2 text-sm text-red-600",
            props.type == "hidden" && "sr-only",
          )}
          id="email-error"
        >
          {props.errors}
        </p>
      )}
    </div>
  );
};

