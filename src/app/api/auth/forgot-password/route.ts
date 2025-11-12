import { NextRequest, NextResponse } from "next/server";
import customerAuthModel from "../../../../models/customer_auth.model";
import Otp from "../../../../models/otp.model";
import { sendMail } from "../../../../services/email.service";
import { connectToDatabase } from "../../../../lib/db";
import bcrypt from "bcrypt";
import adminAuthModel from "../../../../models/admin_auth.model";


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
  const { email, step, otp, newPassword, role } = body;

  let user: any;
  if (role === "customer") {
    user = await customerAuthModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }
  }
  if (role === "admin" || role === "superadmin") {
    user = await adminAuthModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }
  }
  if (step === "send-otp") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendMail({
      to: email,
      subject: "Forgot Password OTP Verification",
      text: `Your OTP is ${otp}`,
    });
    return NextResponse.json({ message: "OTP sent to email" }, { status: 200 });
  }
  if (step === "verify-otp") {
    if (!otp || !email) {
      return NextResponse.json(
        { message: "OTP and email are required" },
        { status: 400 }
      );
    }
    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    await Otp.deleteMany({ email });
    return NextResponse.json({ message: "OTP verified" }, { status: 200 });
  }
  if (step === "reset-password") {
    if (!newPassword || !email || !role) {
      return NextResponse.json(
        { message: "New password, email and role are required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (role === "customer") {
      await customerAuthModel.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
    }
    if (role === "admin" || role === "superadmin") {
      await adminAuthModel.updateOne({ email }, { password: hashedPassword });
    }
    await Otp.deleteMany({ email });
    return NextResponse.json({ message: "Password reset" }, { status: 200 });
  }
  return NextResponse.json({ message: "Invalid step" }, { status: 400 });
  } catch (error: any) {
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}
