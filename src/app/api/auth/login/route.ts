import { NextResponse } from "next/server";
import { loginController } from "../../../../controller/auth.controller";
import { LoginPayload } from "@/types/auth.types";
import { connectToDatabase } from "@/lib/db";

await connectToDatabase();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await loginController(data as LoginPayload);
    if (response.customer || response.admin) {
      return NextResponse.json(response, { status: response.status });
    } else {
      return NextResponse.json(
        { message: response.message },
        { status: response.status }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to login" }, { status: 500 });
  }
}