import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../services/jwt.service";
import CustomerAuth from "../../../../models/customer_auth.model";
import { connectToDatabase } from "../../../../lib/db";
await connectToDatabase();

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (auth.error) return auth.error;
    const { customerId, flag, rejectionReason } = await request.json();

    if (flag === true) {
      const customer = await CustomerAuth.findById(customerId);
      if (!customer)
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 }
        );
      customer.isActive = true;
      customer.reviewedBy = auth.admin?.name;
      await customer.save();
    } else if (flag === false) {
      console.log(rejectionReason);
      const customer = await CustomerAuth.findById(customerId);
      console.log(customer);
      if (!customer)
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 }
        );
      customer.isActive = false;
      customer.rejectionReason = rejectionReason;
      customer.reviewedBy = auth.admin?.name;
      await customer.save();
    }
    return NextResponse.json(
      { message: "Customer request updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const pendingRequests = await CustomerAuth.find({
      isActive: false,
    }).countDocuments();
    const approvedRequests = await CustomerAuth.find({
      isActive: true,
    }).countDocuments();
    const rejectedRequests = await CustomerAuth.find({
      rejectionReason: { $exists: true },
    }).countDocuments();

    const allRequests = await CustomerAuth.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

    const totalPages = Math.ceil(allRequests.length / limit);
    return NextResponse.json(
      {
        allRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: pendingRequests + approvedRequests + rejectedRequests,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
