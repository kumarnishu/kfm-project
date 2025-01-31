import { CreateOrEditRegisteredProductDto } from "../dtos/RegisteredProducDto";
import { apiClient } from "./utils/axiosIterceptor";

export class RegisteredProductService {
    async CreateOrEditRegisteredProduct({ id, body }: { id?: string, body: CreateOrEditRegisteredProductDto }) {
        if (id)
            return await apiClient.put(`products/${id}`, body);
        return await apiClient.post("products", body);
    };

    async GetAllRegisteredProducts() {
        return await apiClient.get(`products`)
    }
}