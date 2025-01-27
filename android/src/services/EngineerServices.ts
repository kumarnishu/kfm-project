import { CreateOrEditUserDto } from "../dtos/UserDto"
import { apiClient } from "./utils/axiosIterceptor"

export class EngineerServices {
  public async GetAllEngineers() {
    return await apiClient.get(`engineers`)
  }

  public async GetAllEngineersDropdown() {
    return await apiClient.get(`engineers/dropdown`)
  }
  public async CreateOrEditEngineer({ id, body }: { id?: string, body: CreateOrEditUserDto }) {
    if (id)
      return await apiClient.put(`engineers/${id}`, body)
    return await apiClient.post("engineers", body)
  };
}