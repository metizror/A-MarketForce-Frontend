import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import adminAuthModel from "@/models/admin_auth.model";
import bcrypt from "bcrypt";

await connectToDatabase();

/**
 * POST /api/auth/create-admin
 * Creates or updates an admin account with properly hashed password
 * 
 * Body: {
 *   name: string,
 *   email: string,
 *   password: string,
 *   role: "admin" | "superadmin"
 * }
 */
export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate input
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

    // Normalize email (lowercase, trimmed)
    const normalizedEmail = email.toLowerCase().trim();

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existingAdmin = await adminAuthModel.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      // Update existing admin with new password and role
      existingAdmin.name = name;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = role;
      await existingAdmin.save();

      return NextResponse.json({
        message: "Admin account updated successfully",
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role,
        },
      });
    } else {
      // Create new admin
      const newAdmin = await adminAuthModel.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
      });

      return NextResponse.json({
        message: "Admin account created successfully",
        admin: {
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
        },
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { message: "Failed to create/update admin account", error: error.message },
      { status: 500 }
    );
  }
}

