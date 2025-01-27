import { EditSparePartMachinesDto } from "../dtos/SparePartDto";
import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export class SparePartService{
    
}
export const GetAllSpareParts = async () => {
    return await apiClient.get(`parts`)
}

export const CreateOrEditSparePart = async ({ id, body }: { id?: string, body: FormData }) => {
    if (id)
        return await apiClient.put(`parts/${id}`, body,multipartHeaders);
    return await apiClient.post("parts", body,multipartHeaders);
};

export const GetSparePartsForDropdown = async () => {
    return await apiClient.get(`dropdown/parts`)
}

export const EditSparePartsMachines = async ({ body }: {
    body: EditSparePartMachinesDto
}) => {
    return await apiClient.patch(`parts/machines/edit`, body)
}

