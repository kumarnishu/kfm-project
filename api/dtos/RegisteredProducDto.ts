import { DropDownDto } from "./DropDownDto"

export type CreateOrEditRegisteredProductDto = {
    sl_no: number,
    machine: string,
    customer: string,
    warrantyUpto?: string,
    amcEndDate?: string,
    amcStartDate?: string
    installationDate?: string,
}


export type GetRegisteredProductDto = {
    _id: string,
    sl_no: number,
    machine: DropDownDto,
    machine_photo: string,
    customer: DropDownDto,
    warrantyUpto: string,
    installationDate: string,
    amcStartDate: string,
    amcEndDate: string
}



