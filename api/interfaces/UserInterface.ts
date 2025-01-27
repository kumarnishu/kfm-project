import { ICustomer } from "./CustomerInterface"

export type Asset = {
  _id: string,
  filename: string,
  public_url: string,
  content_type: string,
  size: string,
  bucket: string,
  created_at: Date
} | undefined


export type IUser = {
  _id: string,
  username: string,
  mobile: string,
  email: string,
  dp: Asset,
  otp: number,
  otp_valid_upto: Date,
  customer: ICustomer,
  fcm_token:string
  role: string,//admin,engineer,customer_owner,customer_staff
  mobile_verified: boolean,
  is_active: boolean,
  last_login: Date,
  created_at: Date,
  updated_at: Date,
  created_by: IUser,
  updated_by: IUser,
  email_verified: boolean,
  emailVerifyToken: string | null,
  emailVerifyExpire: Date | null
}
export type IUserMethods = {
  getAccessToken: () => string,
  checkOtpValidity: (otp: number) => boolean,
  resetOtp: () => void,
  sendOtp: (phone: string) => any,
  getEmailVerifyToken: () => string
}