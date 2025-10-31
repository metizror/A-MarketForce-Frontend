// Types for Customer Register & Login

export interface RegisterCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: "admin" | "superadmin" | "customer";
}

export interface SendOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface SendOtpResponse {
  message: string;
  otp: string; // for dev/testing only, remove in production
}

export interface VerifyOtpResponse {
  message: string;
  isEmailVerified: boolean;
}

export interface CustomerObject {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  password: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface RegisterCustomerSuccessResponse {
  status: number;
  message: string;
  customer: CustomerObject;
}

export interface RegisterCustomerFailResponse {
  status: number;
  message: string;
  customer: null;
}

export interface AdminObject {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface LoginSuccessResponse {
  status: number;
  message: string;
  token: string;
  customer?: CustomerObject;
  admin?: AdminObject;
}

export interface LoginFailResponse {
  status: number;
  message: string;
  customer: null;
  admin: null;
}
