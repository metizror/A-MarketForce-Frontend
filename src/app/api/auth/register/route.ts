import { registerCustomer } from "@/controller/auth.controller";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: Request) {
    await connectToDatabase();
    return await registerCustomer(request);
}
