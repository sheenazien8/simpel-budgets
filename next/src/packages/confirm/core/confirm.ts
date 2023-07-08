import { useEffect, useState } from "react";

export interface IConfirmOptions {
  yes: () => void;
  no: () => void;
  style?: {
      yes?: string;
      no?: string;
  };
  title: string;
  description?: string;
  yesLabel?: string;
  noLabel?: string;
  icon?: JSX.Element;
}

export interface IConfirm {
  open: boolean;
  setOpen: (open: boolean) => void;
  confirmOption: ({}: IConfirmOptions) => void;
  clickedYes: () => void;
  clickedNo: () => void;
  option?: IConfirmOptions;
}

export default function useConfirmHandler(): IConfirm {
  const [open, setOpen] = useState(false);

  const [yes, setClickedYes] = useState(false);
  const [no, setClickedNo] = useState(false);
  const [option, setOption] = useState<IConfirmOptions>();

  let confirmOption = (props: IConfirmOptions) => {
    setOpen(true);
    setOption(props);
  };

  const clickedYes = () => {
    setClickedYes(true);
  };
  const clickedNo = () => {
    setClickedNo(true);
  };

  useEffect(() => {
    if (yes) {
      option?.yes();
      setClickedYes(false);
    }
    if (no) {
      option?.no();
      setClickedNo(false);
    }
  }, [yes, no]);

  useEffect(() => {
  }, []);

  return { open, setOpen, confirmOption, clickedYes, clickedNo, option };
}
