import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../services/jwt.service";
import AdminAuth from "../../../../models/admin_auth.model";
import { connectToDatabase } from "../../../../lib/db";
import { AdminObject } from "@/types/auth.types";
import bcrypt from "bcryptjs";
export async function GET(request: NextRequest) {
  try {
    const { error, admin } = await requireAdminAuth(request);
    if (error) {
      return error;
    }

    await connectToDatabase();
    const adminAuth = await AdminAuth.findById(admin?._id).select("-password");

    if (!adminAuth) {
      return NextResponse.json(
        { message: "Admin auth not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ admin: adminAuth as AdminObject });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, admin } = await requireAdminAuth(request);
    console.log("admin", admin);
    if (error) {
      return error;
    }

    const { data } = await request.json();
    console.log("data", data);
    if (!data) {
      return NextResponse.json(
        { message: "Data is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const adminAuth = await AdminAuth.findById(admin?._id);
    if (!adminAuth) {
      return NextResponse.json(
        { message: "Admin auth not found" },
        { status: 404 }
      );
    }

    if (!adminAuth.password) {
      return NextResponse.json(
        { message: "Password not found for this account" },
        { status: 400 }
      );
    }

    let currentPassword = await bcrypt.compare(data.password, adminAuth.password);
    if (!currentPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await AdminAuth.findByIdAndUpdate(
      admin?._id,
      { ...data, password: hashedPassword },
      { new: true }
    );
    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
