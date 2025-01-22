import { ICustomer } from "./CustomerInterface"
import { IMachine } from "./MachineInterface"
import { IUser } from "./UserInterface"

export type IRegisteredProduct = {
    _id: string,
    sl_no: string,
    machine: IMachine,
    is_active: boolean,
    customer: ICustomer,
    warrantyUpto: Date,
    isInstalled: boolean,
    installationDate: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

