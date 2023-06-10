import React, { createRef, useCallback, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { FormikProps } from "formik";
import { classNames } from "@/utils/helper";

interface IToggle<t = any> {
  label?: string | JSX.Element;
  formik: FormikProps<t>;
  name: string;
  errors?: string | undefined | number;
  value: any;
  checked: boolean;
}

export const Toggle = (props: IToggle) => {
  const [enabled, setEnabled] = useState(props.checked);
  const ref = createRef<HTMLInputElement>();
  const setCheckendEnabled = useCallback(() => {
    console.log(enabled, ref.current);
    setEnabled(!enabled);
    props.formik.setFieldValue(props.name, !enabled);
  }, [ref]);

  useEffect(() => {
    if (Number(props.checked) == 1) {
      ref.current?.focus();
      ref.current?.click();
    }
  }, [props.checked]);

  return (
    <>
      <Switch.Group as="div" className="flex items-center">
        <Switch
          checked={enabled}
          onChange={setCheckendEnabled}
          className={classNames(
            enabled ? "bg-indigo-600" : "bg-gray-200",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            )}
          />
        </Switch>
        <Switch.Label as="span" className="ml-3">
          <span className="text-sm font-medium text-gray-900">
            {props.label}
          </span>
        </Switch.Label>
      </Switch.Group>
    </>
  );
};
