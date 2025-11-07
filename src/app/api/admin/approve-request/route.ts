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

    // Get all requests and sort them properly:
    // 1. Pending requests first (isActive: false AND no rejectionReason) - sorted by createdAt desc
    // 2. Then status-changed requests (approved/rejected) - sorted by updatedAt desc (latest changes first)
    
    // First, get all pending requests (isActive: false and no rejectionReason)
    const pendingRequestsList = await CustomerAuth.find({
      isActive: false,
      rejectionReason: { $exists: false }
    }).sort({ createdAt: -1 });

    // Then, get all status-changed requests (isActive: true OR has rejectionReason)
    // Sort by updatedAt descending to show latest changes first
    const statusChangedRequests = await CustomerAuth.find({
      $or: [
        { isActive: true },
        { rejectionReason: { $exists: true } }
      ]
    }).sort({ updatedAt: -1 });

    // Combine: pending first, then status-changed
    const allRequests = [...pendingRequestsList, ...statusChangedRequests];

    // Apply pagination after combining
    const paginatedRequests = allRequests.slice(skip, skip + limit);
    const totalCount = allRequests.length;
    const totalPages = Math.ceil(totalCount / limit);
    return NextResponse.json(
      {
        allRequests: paginatedRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
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
