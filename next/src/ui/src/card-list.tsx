import { classNames } from "@/utils/helper";
import React from "react";

interface CardList {
  title?: string | JSX.Element;
  details?: any[];
  bgColor?: string;
  icon?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLLIElement> | undefined;
  className?: string;
  key?: string | number;
}
export const CardList = (props: CardList): JSX.Element => {
  return (
    <li
      key={props.key}
      className={classNames(
        "col-span-1 flex rounded-md shadow-sm cursor-pointer h-fit break-words",
        props.className,
      )}
      onClick={props.onClick}
    >
      <div
        className={classNames(
          props.bgColor ?? "bg-pink-600",
          "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md",
        )}
      >
        {props.icon}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm break-words">
          <div className="font-medium text-gray-900 hover:text-gray-600 block break-words">
            {props.title}
          </div>
          {props.details?.map((detail, index) => (
            <div key={index} className="text-gray-500 break-words">
              {detail}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
};
