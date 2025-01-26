import { IUser } from "./UserInterface"

export type ICustomer = {
    _id: string,
    name: string,
    address: string,
    email: string,
    mobile: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
