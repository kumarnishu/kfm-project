import { CreateOrEditCustomerDto } from "../dto/CustomerDto";
import { CreateOrEditUserDto } from "../dto/UserDto";
import { apiClient } from "./utils/axiosIterceptor";

export const CreateOrEditCustomer = async ({ id, body }: { id?: string, body: CreateOrEditCustomerDto }) => {
  if (id)
    return await apiClient.put(`customers/${id}`, body)
  return await apiClient.post("customers", body)
};

export const GetAllCustomersStaffForAdmin = async ({ id }: { id: string }) => {
  return await apiClient.get(`customers/${id}`)
}
export const GetAllCustomers = async () => {
  return await apiClient.get(`customers`)
}

export const GetAllCustomersForDropDown = async () => {
  return await apiClient.get(`customers/dropdown`)
}

export const GetAllStaffs = async () => {
  return await apiClient.get(`staff`)
}
export const CreateOrEditStaff = async ({ id, body }: { id?: string, body: CreateOrEditUserDto }) => {
  if (id)
    return await apiClient.put(`staff/${id}`, body)
  return await apiClient.post("staff", body)
};

export const GetAllStaffsForDropDown = async () => {
  return await apiClient.get(`staff/dropdown`)
}