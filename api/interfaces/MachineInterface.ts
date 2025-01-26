import { Asset, IUser } from "./UserInterface"

export type IMachine = {
    _id: string,
    name: string,
    model: string,
    photo: Asset,
    service_charge:number,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
