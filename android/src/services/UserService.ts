import { CreateOrEditCustomerDto } from "../dtos/CustomerDto";
import { apiClient } from "./utils/axiosIterceptor";

export class UserService {
  public async Signup({ body }: { body: CreateOrEditCustomerDto }) {
    return await apiClient.post("register", body)
  };

  public async SendOtp(
    body: {
      mobile: string
    }
  ) {
    return await apiClient.post("sendotp", body);
  };

  public async CheckOtpAndLogin(
    body: {
      mobile: string, otp: number
    }
  ) {
    return await apiClient.post("login", body);
  };

  public async DirectLogin(
    body: {
      mobile: string,
      fcm_token?:string
    }
  ) {
    return await apiClient.post("direct-login", body);
  };
  public async Logout() {
    return await apiClient.post("logout");
  };


  public async GetProfile() {
    return await apiClient.get("profile");
  };
}
