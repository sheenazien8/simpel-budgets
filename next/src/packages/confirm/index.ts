import { useContext } from "react";
import { ConfirmContext } from "./core/context";

export const useConfirm = () => {
    const context = useContext(ConfirmContext);

    return {
        confirm: context?.confirmOption
    };
}
