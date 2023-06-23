import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { classNames } from "@/utils/helper";
import { FormikProps } from "formik";

export interface ICustomSelectOption {
  label: string | JSX.Element;
  value: string | number;
}

interface ICustomSelect<t = any> {
  options: ICustomSelectOption[];
  label?: string | JSX.Element;
  formik?: FormikProps<t>;
  errors?: string;
  name: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading?: boolean;
}

export const CustomSelect = (props: ICustomSelect) => {
  const [selected, setSelected] = useState<ICustomSelectOption>();

  useEffect(() => {
    props.formik?.setFieldValue(props.name, props.value);
    if (props.options.length > 0 && props.value != undefined) {
      setSelected(props.options?.find((e) => e.value == props.value));
    }
  }, [props.value, props.options]);

  return (
    <>
      <Listbox
        value={selected}
        onChange={(e) => {
          props.formik?.setFieldValue(props.name, e.value);
          setSelected(e);
        }}
      >
        {({ open }) => (
          <>
            <Listbox.Label
              className="block text-sm font-medium text-gray-900"
              as="label"
            >
              {props.label}
            </Listbox.Label>
            <div className="relative !mt-0.5">
              <Listbox.Button
                className={classNames(
                  props.errors ? "focus:ring-red-600 ring-red-300" : "focus:ring-indigo-600 ring-gray-300",
                  "relative z-0 w-full cursor-pointer rounded-md bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm sm:leading-6",
                )}
              >
                <span className="block truncate">{selected?.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {props.errors ? (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {props.options.map((option: ICustomSelectOption) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate",
                            )}
                          >
                            {option.label}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {props.errors && (
        <p className="text-sm text-red-600 !mt-1" id="email-error">
          {props.errors}
        </p>
      )}
    </>
  );
};
