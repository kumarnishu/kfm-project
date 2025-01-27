import mongoose from "mongoose"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { twillioClient } from "../app";
import { response } from "express";
import { IUser, IUserMethods } from "../interfaces/UserInterface";


const UserSchema = new mongoose.Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>, IUserMethods>({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  fcm_token: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    trim: true,
    required: true,
  },

  role: {
    type: String,
    default: 'customer',
  },

  dp: {
    _id: { type: String },
    filename: { type: String },
    public_url: { type: String },
    content_type: { type: String },
    size: { type: String },
    bucket: { type: String },
    created_at: Date
  },

  email_verified: {
    type: Boolean,
    default: false,
    required: true
  },

  mobile_verified: {
    type: Boolean,
    default: false,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false,
    required: true
  },
  last_login: {
    type: Date,
    default: new Date(),
    required: true,
  },
  otp: Number,
  otp_valid_upto: Date,
  created_at: {
    type: Date,
    default: new Date(),
    required: true,

  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_at: {
    type: Date,
    default: new Date(),
    required: true,

  },

  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  emailVerifyToken: {
    type: String,
    default: null
  },
  emailVerifyExpire: {
    type: Date,
    default: null
  },
})

// // authenticaion tokens
UserSchema.method(
  "resetOtp", function () {
    this.otp = undefined
    this.otp_valid_upto = undefined
  }
)
UserSchema.method(
  "sendOtp", async function (phone: string) {
    let otp = Math.floor(100000 + Math.random() * 900000)

    const data = await twillioClient.messages.create({
      body: `Yout Otp is ${otp} . Valid till 15 minutes from now \n ${process.env.appHash} \n\n Regards KFM INDIA`,
      from: process.env.twillioPhone,
      to: `+91${phone}`
    }).then(() => { return response }).catch((err) => console.log(err))
    if (data) {
      this.otp = otp;
      this.otp_valid_upto = new Date(new Date().setMinutes(new Date().getMinutes() + 15));
    }
  }
)
UserSchema.method(
  "getAccessToken", function () {
    return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_USER_SECRET || "kkskhsdhk", {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });
  }
)
// Compare Password
UserSchema.method("checkOtpValidity", function (otp: number) {
  console.log(otp, this.otp, new Date(this.otp_valid_upto).toLocaleString(), new Date().toLocaleString())
  return this.otp === Number(otp) && this.otp_valid_upto > new Date()
})


//generating email verification token
UserSchema.method("getEmailVerifyToken", function () {
  const emailToken = crypto.randomBytes(32).toString('hex');
  this.emailVerifyToken = emailToken
  this.emailVerifyExpire = new Date(Date.now() + 15 * 60 * 1000);
  return emailToken;
})
export const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>("User", UserSchema)