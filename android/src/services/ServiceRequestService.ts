import { CloseServiceRequestDto } from "../dto/ServiceRequestDto";
import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

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


// block user
export const CloseServiceRequest = async ({ id,body }: { id:string,body: CloseServiceRequestDto }) => {
    return await apiClient.post(`requests/${id}`, body);
}