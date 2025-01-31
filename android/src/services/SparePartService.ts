import { EditSparePartMachinesDto } from "../dtos/SparePartDto";
import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export class SparePartService {

    async GetAllSpareParts() {
        return await apiClient.get(`parts`)
    }

    async CreateOrEditSparePart({ id, body }: { id?: string, body: FormData }) {
        if (id)
            return await apiClient.put(`parts/${id}`, body, multipartHeaders);
        return await apiClient.post("parts", body, multipartHeaders);
    };

    async GetSparePartsForDropdown() {
        return await apiClient.get(`dropdown/parts`)
    }

    async EditSparePartsMachines({ body }: {
        body: EditSparePartMachinesDto
    }) {
        return await apiClient.patch(`parts/machines/edit`, body)
    }

}