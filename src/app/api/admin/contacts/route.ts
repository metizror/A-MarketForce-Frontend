import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Contacts from "@/models/contacts.model";

await connectToDatabase();

export async function GET(request: NextRequest) {
  try {
    const contacts = await Contacts.find();
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    let alreadyExists = await Contacts.findOne({ email: data.email });
    if (alreadyExists) {
      return NextResponse.json(
        { message: "Contact already exists" },
        { status: 400 }
      );
    }

    const contact = await Contacts.create(data);
    return NextResponse.json(
      { message: "Contact created successfully", contact: contact },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating contact", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid input: 'ids' must be a non-empty array" },
        { status: 400 }
      );
    }

    await Contacts.deleteMany({ _id: { $in: ids } });

    return NextResponse.json(
      {
        message: "Contacts deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting contacts:", error);
    return NextResponse.json(
      { message: "Error deleting contacts", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, data } = body;
    const contact = await Contacts.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(
      { message: "Contact updated successfully", contact: contact },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating contact", error: error.message },
      { status: 500 }
    );
  }
}
