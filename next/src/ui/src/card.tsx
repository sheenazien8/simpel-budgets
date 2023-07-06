interface ICards {
  children: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}
export const Card = (props: ICards) => {
  return (
    <div className="border border-gray-200 h-fit px-2 rounded-md cursor-pointer" onClick={props.onClick}>
      {props.children}
    </div>
  );
};
