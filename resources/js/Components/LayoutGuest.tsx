import React from "react";
import ToasterCustom from "./ToasterCustom";

interface ILayout {
  children: JSX.Element;
}
const LayoutGuest = (props: ILayout) => (
  <div>
    {props.children} <ToasterCustom />
  </div>
);

export default LayoutGuest;
