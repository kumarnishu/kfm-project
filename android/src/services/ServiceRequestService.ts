import { apiClient, multipartHeaders } from "./utils/axiosIterceptor";

export class ServiceRequestService {

    async CreateServiceRequest({ body }: { body: FormData }) {
        return await apiClient.post("requests", body, multipartHeaders);
    };
    async GetServiceRequest({ id }: { id: string }) {
        return await apiClient.get(`requests/${id}`);
    }
    async HandleServiceRequest({ id, body }: { id: string, body: FormData }) {
        return await apiClient.put(`requests/${id}`, body, multipartHeaders);
    };


    async GetAllServiceRequests() {
        return await apiClient.get(`requests`)
    }

}
