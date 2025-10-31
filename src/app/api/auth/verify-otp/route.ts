import { verifyOtp } from "@/controller/auth.controller";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  await connectToDatabase();
  return await verifyOtp(req);
}
