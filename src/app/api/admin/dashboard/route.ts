import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../services/jwt.service";
import { connectToDatabase } from "../../../../lib/db";
import AdminAuth from "../../../../models/admin_auth.model";
import { AdminObject } from "@/types/auth.types";
import Contacts from "../../../../models/contacts.model";
import Companies from "../../../../models/companies.model";
import Activity from "@/models/activity.model";

export async function GET(request: NextRequest) {
  try {
    const { error, admin } = await requireAdminAuth(request);
    if (error) {
      return error;
    }
    await connectToDatabase();
    const totalContacts = await Contacts.countDocuments();
    const totalCompanies = await Companies.countDocuments();
    const totalUsers = await AdminAuth.find({ role: "admin" }).countDocuments();
    const lastImportDate = await Contacts.findOne().sort({ createdAt: -1 });

    const activityLogs = await Activity.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json({
      totalContacts,
      totalCompanies,
      totalUsers,
      lastImportDate: lastImportDate?.createdAt,
      activityLogs,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
