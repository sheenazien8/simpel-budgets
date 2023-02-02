import React, { createRef, useCallback, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "../../utils/helper";
import { FormikProps } from "formik";

interface IToggle<t = any> {
  label?: string | JSX.Element;
  formik: FormikProps<t>;
  name: string;
  errors?: string | undefined | number;
  value: any;
}

const Toggle = (props: IToggle) => {
  const [enabled, setEnabled] = useState(props.value);
  const ref = createRef<HTMLInputElement>();
  const setCheckendEnabled = useCallback(() => {
    ref.current?.focus();
    ref.current?.click();
    setEnabled(!enabled);
  }, [ref]);

  useEffect(() => {
    if (props.value == 1) {
      ref.current?.focus();
      ref.current?.click();
    }
  }, [props.value]);

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
      <input
        type="checkbox"
        className="hidden"
        onChange={props.formik.handleChange}
        name={props.name}
        value={props.name}
        ref={ref}
      />
    </>
  );
};

export default Toggle;
