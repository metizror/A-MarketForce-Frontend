import { NextRequest, NextResponse } from "next/server";
import { loginController } from "../../../../controller/auth.controller";
import { LoginPayload } from "@/types/auth.types";
import { connectToDatabase } from "@/lib/db";

// Route segment config for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const response = await loginController(data as LoginPayload);
    return NextResponse.json(response, { status: response.status });
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: error.message || "Failed to login",
        customer: null,
        admin: null,
      },
      { status: 500 }
    );
  }
}
