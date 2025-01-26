import { GetCustomerDto } from "./CustomerDto"
import { DropDownDto } from "./DropDownDto"
import { GetMachineDto } from "./MachineDto"
import { GetSparePartDto } from "./SparePartDto"
import { GetUserDto } from "./UserDto"

export type GetProblemDto = {
    _id: string,
    problem: string,
    videos: string | any[],
    photos: string | any[]
}

export type GetSolutionDto = {
    _id: string,
    solution: string,
    parts: GetSparePartDto[]
    videos: string | any[],
    photos: string | any[]
}

export type CreateServiceRequestSolutionDto = {
    request: string,
    solution: string,
    parts: string[],
    videos?: string[],
    photos?: string[]
}

export type CreateServiceRequestPaymentDto = {
    cash_payment: number,
    upi_payment: number,
    paymentmode: string,//cash,upi or cash+upi
    payable_amount: number,
    discount_amount: number,
    paid_amount: number
}
export type CreateServiceRequestDto = {
    product: string
    problem: string,
    videos?: string[],
    photos?: string[]
}

export type GetServiceRequestDto = {
    _id: string,
    request_id: string,
    customer: string,
    contactno: string,
    machine: string
    machine_model: string
    problem: string,
    assigned_engineer: GetUserDto,
    closed_by: DropDownDto,
    closed_on: string,
    created_at: string,
    created_by: DropDownDto
}


export type GetServiceRequestDetailedDto = {
    _id: string,
    request_id: string,
    product_serialno: number,
    customer: GetCustomerDto,
    machine: GetMachineDto,
    problem: GetProblemDto,
    solution?: GetSolutionDto,
    assigned_engineer: GetUserDto,
    closed_by: DropDownDto,
    closed_on: string,
    created_at: string,
    created_by: DropDownDto
}
