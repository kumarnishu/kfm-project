import { DropDownDto } from "./DropDownDto"

export type EditSparePartMachinesDto = {
    machine_ids: string[],
    part_id: string
}

export type CreateOrEditSparePartDto = {
    name: string,
    partno: string,
    price: number,
    photo?: string
}

export type GetSparePartDto = {
    _id: string,
    name: string,
    partno: string,
    photo: string,
    price: number,
    compatible_machines: DropDownDto[],
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
}



