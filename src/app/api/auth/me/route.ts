import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../services/jwt.service";
import AdminAuth from "../../../../models/admin_auth.model";
import { connectToDatabase } from "../../../../lib/db";
import { AdminObject } from "@/types/auth.types";
import bcrypt from "bcrypt";
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
    if (error) {
      return error;
    }

    const { data } = await request.json();
    if (!data) {
      return NextResponse.json(
        { message: "Data is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const adminAuth = await AdminAuth.findById(admin?._id).select("-password");
    if (!adminAuth) {
      return NextResponse.json(
        { message: "Admin auth not found" },
        { status: 404 }
      );
    }

    if (data.password !== adminAuth.password) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    if (data.password !== data.confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
