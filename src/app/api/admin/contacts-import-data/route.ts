import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Contacts from "@/models/contacts.model";
import { requireAdminAuth } from "../../../../services/jwt.service";

await connectToDatabase();

export async function POST(request: NextRequest) {
  const { error, admin } = await requireAdminAuth(request);
  if (error) {
    return error;
  }

  try {
    const { data } = await request.json();

    // Validate that data is an array
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: "Invalid input: 'data' must be an array" },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { message: "Invalid input: 'data' array cannot be empty" },
        { status: 400 }
      );
    }

    // Check for duplicate emails in the incoming data
    const emails = data.map((item: any) => item.email).filter(Boolean);
    const duplicateEmails = emails.filter(
      (email: string, index: number) => emails.indexOf(email) !== index
    );

    if (duplicateEmails.length > 0) {
      return NextResponse.json(
        {
          message: "Duplicate emails found in import data",
          duplicateEmails: [...new Set(duplicateEmails)],
        },
        { status: 400 }
      );
    }

    // Check which emails already exist in the database
    const existingContacts = await Contacts.find({
      email: { $in: emails },
    }).select("email");

    const existingEmails = existingContacts.map(
      (contact: any) => contact.email
    );

    // If any emails exist in the database, return error with the list
    if (existingEmails.length > 0) {
      return NextResponse.json(
        {
          message: "Some contacts already exist in the database",
          existingEmails: existingEmails,
        },
        { status: 400 }
      );
    }

    // Prepare contacts for bulk insert with createdBy field
    const contactsToInsert = data.map((contact: any) => ({
      ...contact,
      createdBy: admin?.name,
    }));

    // Bulk insert all contacts
    const insertedContacts = await Contacts.insertMany(contactsToInsert, {
      ordered: true,
    });

    return NextResponse.json(
      {
        message: "Contacts imported successfully",
        imported: insertedContacts.length,
        total: data.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error importing contacts",
        error: error,
      },
      { status: 500 }
    );
  }
}
