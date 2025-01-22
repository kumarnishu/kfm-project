import { CreateOrEditUserDto } from "../dto/UserDto"
import { apiClient } from "./utils/axiosIterceptor"

export const GetAllEngineers = async () => {
    return await apiClient.get(`engineers`)
}

export const GetAllEngineersDropdown = async () => {
    return await apiClient.get(`engineers/dropdown`)
}
export const CreateOrEditEngineer = async ({ id, body }: { id?: string,body: CreateOrEditUserDto }) => {
    if (id)
      return await apiClient.put(`engineers/${id}`, body)
    return await apiClient.post("engineers", body)
  };
