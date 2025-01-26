import { DropDownDto } from "./DropDownDto"

export type GetUserDto = {
    _id: string,
    username:string,
    mobile: string,
    email: string,
    dp: string,
    customer: DropDownDto,
    role: string,//admin,engineer,owner,staff
}
export type CreateOrEditUserDto = {
    customer:string,
    username:string,
    mobile: string,
    email?: string
}

export type LoginDto = {
    mobile: string,
}

export type SendOrVerifyEmailDto = {
    email: string
}
