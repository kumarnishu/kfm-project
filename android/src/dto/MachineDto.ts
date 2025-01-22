import { DropDownDto } from "./DropDownDto"

export type CreateOrEditMachineDto = {
    name: string,
    model: string,
    photo:string
}

export type GetMachineDto = {
    _id: string,
    name: string,
    model: string,
    photo: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
}



