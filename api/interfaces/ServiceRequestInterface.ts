import { IRegisteredProduct } from "./RegisteredProductInterface"
import { IUser, Asset } from "./UserInterface"

export type IServiceRequest = {
    _id: string,
    request_id: string,
    product: IRegisteredProduct,
    paymentMode: string,
    paymentDate: Date,
    payable_amount: number,
    paid_amount: number,
    isApproved: boolean,
    approvedBy: IUser,
    assigned_engineer: IUser,
    closed_by: IUser,
    closed_on: Date,
    happy_code: string,
    approved_on: Date,
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
    product:IRegisteredProduct
    request:IServiceRequest
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export interface ISolution {
    _id: string
    solution: string,
    product:IRegisteredProduct
    request:IServiceRequest
    videos: Asset[]
    photos: Asset[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
