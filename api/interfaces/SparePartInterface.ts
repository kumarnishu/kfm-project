import { IMachine } from "./MachineInterface"
import { Asset, IUser } from "./UserInterface"

export type ISparePart = {
    _id: string,
    name: string,
    partno: string,
    photo: Asset,
    compatible_machines: IMachine[]
    price: number,
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}