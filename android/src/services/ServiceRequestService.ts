import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export class ServiceRequestService{
    
}
export const CreateServiceRequest = async ({ body }: { body: FormData }) => {
    return await apiClient.post("requests", body, multipartHeaders);
};
export const GetServiceRequest = async ({id }: { id:string }) => {
    return await apiClient.get(`requests/${id}`);
}
export const HandleServiceRequest = async ({ id,body }: { id:string,body: FormData }) => {
    return await apiClient.put(`requests/${id}`, body, multipartHeaders);
};


export const GetAllServiceRequests = async () => {
    return await apiClient.get(`requests`)
}


