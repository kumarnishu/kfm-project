import { ICustomer } from "./CustomerInterface"
import { IMachine } from "./MachineInterface"
import { IUser } from "./UserInterface"

export type IRegisteredProduct = {
    _id: string,
    sl_no: number,
    machine: IMachine,
    customer: ICustomer,
    warrantyUpto: Date,
    installationDate: Date,
    amcUpto: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

