import { classNames } from "@/utils/helper";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";

interface ITabItem {
  name: string;
  id: string | number;
  bgColor?: string;
  color?: string;
}

export interface ITab<t = any> {
  value: string | number;
  tabs: ITabItem[];
  name: string;
  formik?: FormikProps<t>;
  onClick?: (value: string | number) => void;
}

export const Tab = (props: ITab) => {
  const [borderColor, setBorderColor] = useState("border-gray-300");

  useEffect(() => {
    setBorderColor(
      props.tabs.find((tab) => tab.id == props.value)?.bgColor ??
        "border-gray-300",
    );
  }, [props.value]);

  return (
    <div
      className={`border ${borderColor
        .replace("bg", "border")
        .replace("500", "300")} rounded-md p-1 transition transition-ease`}
    >
      <nav className="flex space-x-4 justify-between overflow-x-scroll" aria-label="Tabs">
        {props.tabs.map((tab) => (
          <button
            type="button"
            onClick={() => {
              if (props.onClick) props.onClick(tab.id);
              if (props.formik) {
                props.formik?.setFieldValue(props.name, tab.id);
              }
              setBorderColor(tab.bgColor ?? "border-gray-300");
            }}
            key={tab.name}
            className={classNames(
              tab.id == props.value
                ? `${tab.bgColor ?? "bg-indigo-100"} ${
                    tab.color ?? "text-indigo-700"
                  }`
                : `text-gray-500 hover:text-gray-700`,
              "rounded-md px-3 py-3 text-sm font-medium w-full text-center",
            )}
            aria-current={tab.id == props.value ? "page" : undefined}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};
