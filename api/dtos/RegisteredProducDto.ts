import { DropDownDto } from "./DropDownDto"

export type CreateOrEditRegisteredProductDto = {
    sl_no: number,
    machine: string,
    customer: string,
    warrantyUpto?: string,
    amcUpto?: string,
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
    amcUpto: string
}



