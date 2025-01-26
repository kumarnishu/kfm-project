import { ICustomer } from "./CustomerInterface"
import { IMachine } from "./MachineInterface"
import { IRegisteredProduct } from "./RegisteredProductInterface"
import { ISparePart } from "./SparePartInterface"
import { IUser, Asset } from "./UserInterface"

export type IServiceRequest = {
    _id: string,
    request_id: string,
    product: IRegisteredProduct,
    customer: ICustomer,
    problem: IProblem,
    machine:IMachine
    solution: ISolution
    assigned_engineer: IUser,
    cash_payment: number,
    upi_payment: number,
    paymentmode: string,//cash,upi or cash+upi
    payable_amount: number,
    discount_amount: number,
    paid_amount: number,
    paymentDate:Date,
    happy_code: string,
    closed_by: IUser,
    closed_on: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export interface IProblem {
    _id: string
    problem: string,
    videos: Asset[]
    photos: Asset[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export interface ISolution {
    _id: string
    solution: string,
    videos: Asset[]
    photos: Asset[]
    parts: ISparePart[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
