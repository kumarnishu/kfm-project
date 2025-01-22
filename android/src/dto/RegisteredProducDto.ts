import { DropDownDto } from "./DropDownDto"

export type CreateOrEditRegisteredProductDto = {
    sl_no: string,
    machine: string,
    customer: string,
    warrantyUpto?: string,
    isInstalled: boolean,
    installationDate?: string,
}


export type GetRegisteredProductDto = {
    _id: string,
    sl_no: string,
    machine: DropDownDto,
    machine_photo:string,
    customer: DropDownDto,
    is_active: boolean,
    warrantyUpto: string,
    isInstalled: boolean,
    installationDate: string,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto,
}



