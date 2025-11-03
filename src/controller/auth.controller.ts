import customerAuthModel from "../models/customer_auth.model";
import adminAuthModel from "../models/admin_auth.model";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import type {
  LoginPayload,
  LoginSuccessResponse,
  LoginFailResponse,
} from "../types/auth.types";
import jwt from "jsonwebtoken";
import Otp from "../models/otp.model";
import { sendMail } from "@/services/email.service";

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
    const customer = await customerAuthModel.findOne({ email });
    if (customer) {
      return NextResponse.json(
        { message: "Customer already exists with this email" },
        { status: 400 }
      );
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
    const { email, password, role } = data;

    // Validate role
    if (!role || !["admin", "superadmin", "customer"].includes(role)) {
      return {
        status: 400,
        message:
          "Invalid role specified. Role must be 'admin', 'superadmin', or 'customer'",
        customer: null,
        admin: null,
      } as LoginFailResponse;
    }

    // Admin or Superadmin login
    if (role === "admin" || role === "superadmin") {
      // First find admin by email (role might be null/undefined in DB)
      // Email is stored in lowercase in the model, so convert to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      const admin = await adminAuthModel.findOne({ email: normalizedEmail });

      if (!admin) {
        console.log(`Admin not found for email: ${email}`);
        return {
          status: 404,
          message: "Account not found with this email",
          customer: null,
          admin: null,
        } as LoginFailResponse;
      }

      console.log(
        `Admin found: ${admin.email}, role: ${admin.role}, requested role: ${role}`
      );

      // Check if admin has a role assigned and if it matches the requested role
      // If role is null/undefined in DB, we can update it to match the login request
      if (admin.role && admin.role !== role) {
        console.log(
          `Role mismatch: admin role is ${admin.role}, but ${role} was requested`
        );
        return {
          status: 403,
          message: `Access denied. This account is registered as ${admin.role}, not ${role}`,
          customer: null,
          admin: null,
        } as LoginFailResponse;
      }

      // If role is not set in DB, update it to match the login role
      if (!admin.role) {
        console.log(`Updating admin role from null to ${role}`);
        admin.role = role as "admin" | "superadmin";
        await admin.save();
      }

      // Verify password
      console.log("Verifying password...");
      console.log(`Comparing password for admin: ${admin.email}`);

      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      const isHashed = admin.password && admin.password.startsWith("$2");

      if (!isHashed) {
        console.log(
          "WARNING: Admin password is not hashed! Stored password:",
          admin.password
        );
        // If password is stored as plain text, compare directly (should only happen during development)
        if (admin.password === password) {
          // Re-hash the password for security
          console.log("Re-hashing plain text password...");
          admin.password = await bcrypt.hash(password, 10);
          await admin.save();
          console.log("Password has been re-hashed and saved");
        } else {
          console.log("Plain text password mismatch");
          return {
            status: 401,
            message:
              "Invalid credentials. Please check your email and password.",
            customer: null,
            admin: null,
          } as LoginFailResponse;
        }
      } else {
        // Password is hashed, use bcrypt.compare
        const isPasswordCorrect = await bcrypt.compare(
          password,
          admin.password
        );
        if (!isPasswordCorrect) {
          console.log("Password mismatch - bcrypt comparison failed");
          return {
            status: 401,
            message:
              "Invalid credentials. Please check your email and password.",
            customer: null,
            admin: null,
          } as LoginFailResponse;
        }
      }

      console.log("Password verified successfully");

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin._id, role: admin.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

      // Prepare admin object for response
      const adminObject = {
        _id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role as "admin" | "superadmin",
        createdAt: admin.createdAt?.toString(),
        updatedAt: admin.updatedAt?.toString(),
      };

      return {
        status: 200,
        message: "Logged in successfully",
        token,
        admin: adminObject,
      } as LoginSuccessResponse;
    }

    // Customer login
    if (role === "customer") {
      const customer = await customerAuthModel.findOne({ email });
      if (!customer) {
        return {
          status: 404,
          message: "Account not found",
          customer: null,
          admin: null,
        } as LoginFailResponse;
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        customer.password
      );
      if (!isPasswordCorrect) {
        return {
          status: 401,
          message: "Invalid credentials",
          customer: null,
          admin: null,
        } as LoginFailResponse;
      }
      if (!customer.isActive) {
        return {
          status: 403,
          message: "You are not activated, please wait for approval",
          customer: null,
          admin: null,
        } as LoginFailResponse;
      }
      const token = jwt.sign(
        { customerId: customer._id, role: "customer" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );
      const customerObject = {
        _id: customer._id.toString(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        companyName: customer.companyName,
        isActive: customer.isActive,
        isEmailVerified: customer.isEmailVerified,
        createdAt: customer.createdAt?.toString(),
        updatedAt: customer.updatedAt?.toString(),
      };
      return {
        status: 200,
        message: "Logged in successfully",
        token,
        customer: customerObject,
      } as LoginSuccessResponse;
    }

    // Invalid role
    return {
      status: 400,
      message: "Invalid role specified",
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
