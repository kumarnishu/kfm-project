import { DropDownDto } from "./DropDownDto"

export type GetCustomerDto = {
    _id: string,
    name: string,
    address: string,
    email: string,
    mobile: string,
    users: number,
    owner:string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
}

export type CreateOrEditCustomerDto = {
    name: string,
    username?:string,
    address: string,
    email: string,
    mobile: string,
}

