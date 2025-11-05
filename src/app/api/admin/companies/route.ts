import { NextRequest, NextResponse } from "next/server";
import Companies from "../../../../models/companies.model";
import { connectToDatabase } from "../../../../lib/db";
import { requireAdminAuth } from "../../../../services/jwt.service";

await connectToDatabase();

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.error) return auth.error;
 
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const companyName = searchParams.get("companyName") || "";
    const industry = searchParams.get("industry") || "";
    const country = searchParams.get("country") || "";
    const state = searchParams.get("state") || "";
    const revenue = searchParams.get("revenue") || "";
    const employeeSize = searchParams.get("employeeSize") || "";
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(Math.max(1, limit), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const query: any = {};

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { industry: { $regex: industry, $options: "i" } },
        { country: { $regex: country, $options: "i" } },
        { state: { $regex: state, $options: "i" } },
      ];
    }

    if (companyName) {
      query.companyName = { $regex: companyName, $options: "i" };
    }
    if (revenue) {
      query.revenue = { $regex: revenue, $options: "i" };
    }
    if (employeeSize) {
      query.employeeSize = { $regex: employeeSize, $options: "i" };
    }
    const [companies, totalCount] = await Promise.all([
      Companies.find(query)
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 }),
      Companies.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / limitNumber);
    return NextResponse.json(
      {
        companies,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount,
          limit: limitNumber,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching companies", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { data } = body;
    const company = await Companies.create(data);
    return NextResponse.json(
      { message: "Company created successfully", company: company },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating company", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { data } = body;
    const company = await Companies.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    return NextResponse.json(
      { message: "Company updated successfully", company: company },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating company", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const { ids } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid input: 'ids' must be a non-empty array" },
        { status: 400 }
      );
    }
    const companies = await Companies.deleteMany({ _id: { $in: ids } });
    return NextResponse.json(
      { message: "Companies deleted successfully", companies: companies },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting companies", error: error.message },
      { status: 500 }
    );
  }
}
