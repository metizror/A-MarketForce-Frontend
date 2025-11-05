import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../services/jwt.service";
import CustomerAuth from "../../../../models/customer_auth.model";

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

    const pendingRequests = await CustomerAuth.find({
      isActive: false,
    }).countDocuments();
    const approvedRequests = await CustomerAuth.find({
      isActive: true,
    }).countDocuments();
    const rejectedRequests = await CustomerAuth.find({
      rejectionReason: { $exists: true },
    }).countDocuments();
    return NextResponse.json(
      { pendingRequests, approvedRequests, rejectedRequests },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
