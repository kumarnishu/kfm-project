import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export class MachineService {
    async CreateOrEditMachine({ id, body }: { id?: string, body: FormData }) {
        console.log(id, body)
        if (id)
            return await apiClient.put(`machines/${id}`, body, multipartHeaders);
        return await apiClient.post(`machines`, body, multipartHeaders);
    };


    async GetAllMachines() {
        return await apiClient.get(`machines`)
    }

    async GetAllMachinesDropdown() {
        return await apiClient.get(`dropdown/machines`)
    }

}