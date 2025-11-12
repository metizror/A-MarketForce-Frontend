import { NextRequest, NextResponse } from "next/server";

// Route segment config for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Test GET endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: true,
      message: "API route is working!",
      method: "GET",
      timestamp: new Date().toISOString(),
      url: request.url,
    },
    { status: 200 }
  );
}

