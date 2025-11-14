import customerAuthModel from "../models/customer_auth.model";
import adminAuthModel from "../models/admin_auth.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type {
  LoginPayload,
  LoginSuccessResponse,
  LoginFailResponse,
} from "../types/auth.types";
import jwt from "jsonwebtoken";
import Otp from "../models/otp.model";
import { sendMail } from "../services/email.service";

// sendOtp now saves OTP to DB with 5-min expiry
export const sendOtp = async (req: Request) => {
  try {
    const { email } = (await req.json()) as { email: string };
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email }); // Invalidate old OTP(s)
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    // TODO: Integrate production email provider here
    console.log(`Send OTP ${otp} to ${email}`);
    return NextResponse.json({ message: "OTP sent to email", otp });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to send OTP", error: error.message },
      { status: 500 }
    );
  }
};

export const verifyOtp = async (req: Request) => {
  try {
    const { email, otp } = (await req.json()) as { email: string; otp: string };
    const otpDoc = await Otp.findOne({ email, otp });
    if (otpDoc) {
      await customerAuthModel.updateOne(
        { email },
        { $set: { isEmailVerified: true } }
      );
      await Otp.deleteMany({ email }); // Remove OTP(s)
      return NextResponse.json({
        message: "OTP verified",
        isEmailVerified: true,
      });
    } else {
      return NextResponse.json(
        { message: "Invalid or expired OTP", isEmailVerified: false },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to verify OTP", error: error.message },
      { status: 500 }
    );
  }
};

export const registerCustomer = async (req: Request) => {
  try {
    const { firstName, lastName, email, companyName, password } =
      await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminAuthModel.findOne({ email });
    const customer = await customerAuthModel.findOne({ email });
    if (admin || customer) {
      return NextResponse.json({ message: "customer already exists with this email" }, { status: 400 });
    }

    // Auto-trigger OTP send after registration (simulate for now)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email }); // Invalidate old OTP(s)
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    // TODO: Replace with email send utility

    await sendMail({
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    const newCustomer = await customerAuthModel.create({
      firstName,
      lastName,
      email,
      companyName,
      password: hashedPassword,
      isEmailVerified: false,
    });

    return NextResponse.json(
      {
        message:
          "Customer registered, OTP sent to email. Please verify your email.",
        customer: newCustomer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to register customer:", error);
    return NextResponse.json(
      { message: "Failed to register customer", error: error.message },
      { status: 500 }
    );
  }
};

export const loginController = async (
  data: LoginPayload
): Promise<LoginSuccessResponse | LoginFailResponse> => {
  try {
    const { email, password } = data;
    const [customer, admin] = await Promise.all([
      customerAuthModel.findOne({ email }),
      adminAuthModel.findOne({ email }),
    ]);

    if (!customer && !admin) {
      return {
        status: 400,
        message: "Invalid email or password",
        customer: null,
        admin: null,
      } as LoginFailResponse;
    }

    if (customer) {
      const isPasswordValid = await bcrypt.compare(password, customer.password);
      if (isPasswordValid) {
        const token: string = jwt.sign(
          { id: customer._id.toString() },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        return {
          status: 200,
          message: "Login successfully",
          token: token,
          customer: customer,
        } as LoginSuccessResponse;
      }
    }

    if (admin) {
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (isPasswordValid) {
        const token: string = jwt.sign(
          { id: admin._id.toString() },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        return {
          status: 200,
          message: "Login successfully",
          token: token,
          admin: admin,
        } as LoginSuccessResponse;
      }
    }

    return {
      status: 400,
      message: "Invalid email or password",
      customer: null,
      admin: null,
    } as LoginFailResponse;
  } catch (error: any) {
    console.error("Login controller error:", error);
    return {
      status: 500,
      message: error.message || "Failed to login",
      customer: null,
      admin: null,
    } as LoginFailResponse;
  }
};
