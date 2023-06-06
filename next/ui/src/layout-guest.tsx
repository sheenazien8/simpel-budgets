import React from "react";
import ToasterCustom from "./toaster-custom";

interface ILayout {
  children: JSX.Element;
}
export const LayoutGuest = (props: ILayout) => (
  <div>
    {props.children} <ToasterCustom />
  </div>
);

