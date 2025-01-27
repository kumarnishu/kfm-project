import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export class MachineService{
    
}
export const CreateOrEditMachine = async ({ id, body }: { id?: string, body: FormData }) => {
    console.log(id, body)
    if (id)
        return await apiClient.put(`machines/${id}`, body, multipartHeaders);
    return await apiClient.post(`machines`, body, multipartHeaders);
};


export const GetAllMachines = async () => {
    return await apiClient.get(`machines`)
}

export const GetAllMachinesDropdown = async () => {
    return await apiClient.get(`dropdown/machines`)
}

