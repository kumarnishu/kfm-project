import { CreateOrEditCustomerDto } from "../dtos/CustomerDto";
import { CreateOrEditUserDto } from "../dtos/UserDto";
import { apiClient } from "./utils/axiosIterceptor";

export class CustomerService {
  public async CreateOrEditCustomer({ id, body }: { id?: string, body: CreateOrEditCustomerDto }) {
    if (id)
      return await apiClient.put(`customers/${id}`, body)
    return await apiClient.post("customers", body)
  };

  public async GetAllCustomersStaffForAdmin({ id }: { id: string }) {
    return await apiClient.get(`customers/${id}`)
  }
  public async GetAllCustomers() {
    return await apiClient.get(`customers`)
  }

  public async GetAllCustomersForDropDown() {
    return await apiClient.get(`customers/dropdown`)
  }

  public async GetAllStaffs() {
    return await apiClient.get(`staff`)
  }
  public async CreateOrEditStaff({ id, body }: { id?: string, body: CreateOrEditUserDto }) {
    if (id)
      return await apiClient.put(`staff/${id}`, body)
    return await apiClient.post("staff", body)
  };

  public async GetAllStaffsForDropDown() {
    return await apiClient.get(`staff/dropdown`)
  }
}
