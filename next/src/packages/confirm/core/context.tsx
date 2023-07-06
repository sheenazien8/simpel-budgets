import { Context, createContext } from "react";
import confirmHandler, { IConfirm } from "./confirm";
import { Confirm } from "../components/confirm";

let ConfirmContext: Context<IConfirm>;

let {Provider} = (ConfirmContext = createContext<IConfirm>({} as IConfirm));

interface ICustomProvider {
    children: JSX.Element;
}

let ConfirmProvider = (props: ICustomProvider) => {
    let state = confirmHandler();

    return (
        <Provider value={state}>
            <Confirm />
            {props.children}
        </Provider>
    );
};

export { ConfirmContext, ConfirmProvider };
