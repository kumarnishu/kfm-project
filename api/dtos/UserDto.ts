import { DropDownDto } from "./DropDownDto"

export type GetUserDto = {
    _id: string,
    username:string,
    mobile: string,
    email: string,
    dp: string,
    is_active:boolean,
    customer: DropDownDto,
    role: string,//admin,engineer,owner,staff
    mobile_verified: boolean,
    email_verified: boolean,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
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
