import { classNames } from "@/utils/helper";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";


interface IButton {
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "danger" | "success" | "warning" | "plain";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  block?: boolean;
  href?: string;
  locale?: string;
}

export const Button = (props: IButton) => {
  let size =
    props.size === "sm"
      ? "px-2 py-1 text-xs"
      : props.size === "lg"
      ? "px-4 py-2 text-lg"
      : "px-3 py-2 text-base";

  let block = props.block ? "w-full" : "";
  let color =
    props.color === "primary"
      ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
      : props.color === "secondary"
      ? "bg-gray-400 hover:bg-gray-700 focus:ring-gray-500"
      : props.color === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : props.color === "success"
      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      : props.color === "warning"
      ? "bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500"
      : props.color === "plain"
      ? "bg-transparent hover:bg-gray-100 focus:ring-gray-500"
      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";

  let classes = classNames(
          size,
    "flex justify-center rounded-md border border-transparent font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    props.className,
    color,
    block,
  );

  let disabled = props.loading ? true : props.disabled;
  const href = `/${props.locale}/${props.href?.indexOf('/') == 0 ? props.href.substring(1) : props.href}`

  return !props.href ? (
    <button
      className={classes}
      disabled={disabled}
      onClick={props.onClick}
      type={props.type}
    >
      {props.loading && (
        <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
      )}
      {props.children}
    </button>
  ) : (
    <Link href={href} className={classes} locale={props.locale}>
      {props.children}
    </Link>
  );
};
