import { CreateOrEditRegisteredProductDto } from "../dto/RegisteredProducDto";
import { apiClient } from "./utils/axiosIterceptor";

export const CreateOrEditRegisteredProduct = async ({ id, body }: { id?: string, body: CreateOrEditRegisteredProductDto }) => {
    if (id)
        return await apiClient.put(`products/${id}`, body);
    return await apiClient.post("products", body);
};

export const GetAllRegisteredProducts = async () => {
    return await apiClient.get(`products`)
}
