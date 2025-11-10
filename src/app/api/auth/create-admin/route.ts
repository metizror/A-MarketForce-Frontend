import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import adminAuthModel from "@/models/admin_auth.model";
import bcrypt from "bcrypt";
import { verifyAdminToken } from "../../../../services/jwt.service";

await connectToDatabase();

export async function POST(request: NextRequest) {
  const { valid, admin, decoded } = await verifyAdminToken(request);
  try {
    if (admin?.role == "superadmin") {
      const { name, email, password, role } = await request.json();

      if (!name || !email || !password || !role) {
        return NextResponse.json(
          { message: "Name, email, password, and role are required" },
          { status: 400 }
        );
      }

      if (!["admin", "superadmin"].includes(role)) {
        return NextResponse.json(
          { message: "Role must be 'admin' or 'superadmin'" },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { message: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingAdmin = await adminAuthModel.findOne({
        email: normalizedEmail,
      });

      if (existingAdmin) {
        return NextResponse.json({
          message: "Admin account already exists",
        });
      } else {
        const newAdmin = await adminAuthModel.create({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role,
        });

        return NextResponse.json(
          {
            message: "Admin account created successfully",
            admin: {
              email: newAdmin.email,
              name: newAdmin.name,
              role: newAdmin.role,
            },
          },
          { status: 201 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "You are not authorized to create an admin account" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      {
        message: "Failed to create/update admin account",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { valid, admin, decoded } = await verifyAdminToken(request);
  if (!valid || admin?.role !== "superadmin") {
    return NextResponse.json(
      { message: "Unauthorized: Invalid or missing JWT token" },
      { status: 401 }
    );
  }
  try {
    await connectToDatabase();
    const admins = await adminAuthModel.find().select("-password");
    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
