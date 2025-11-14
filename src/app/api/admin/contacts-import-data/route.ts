import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Contacts from "@/models/contacts.model";
import Companies from "@/models/companies.model";
import { requireAdminAuth } from "../../../../services/jwt.service";
  

export async function POST(request: NextRequest) {
  await connectToDatabase();
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

    // Extract unique companies from import data
    const companyMap = new Map<string, any>();
    data.forEach((contact: any) => {
      if (contact.companyName && contact.companyName.trim()) {
        const companyName = contact.companyName.trim();
        if (!companyMap.has(companyName)) {
          // Create company object from contact data
          companyMap.set(companyName, {
            companyName: companyName,
            phone: contact.phone || undefined,
            address1: contact.address1 || undefined,
            address2: contact.address2 || undefined,
            city: contact.city || undefined,
            state: contact.state || undefined,
            zipCode: contact.zipCode || undefined,
            country: contact.country || undefined,
            website: contact.website || undefined,
            revenue: contact.revenue || undefined,
            employeeSize: contact.employeeSize || undefined,
            industry: contact.industry || undefined,
            subIndustry: contact.subIndustry || undefined,
            technology: contact.technology || undefined,
            companyLinkedInUrl: contact.companyLinkedIn || contact.companyLinkedInUrl || undefined,
            createdBy: admin?.name,
            uploaderId: admin?._id,
          });
        } else {
          // Merge data - prefer non-empty values
          const existing = companyMap.get(companyName);
          Object.keys(existing).forEach((key) => {
            if (key !== 'companyName' && key !== 'createdBy' && key !== 'uploaderId') {
              const contactValue = contact[key] || contact[key === 'companyLinkedInUrl' ? 'companyLinkedIn' : key];
              if (contactValue && !existing[key]) {
                existing[key] = contactValue;
              }
            }
          });
        }
      }
    });

    // Create or update companies
    let companiesCreated = 0;
    let companiesUpdated = 0;
    const uniqueCompanies = Array.from(companyMap.values());

    for (const companyData of uniqueCompanies) {
      // Check if company exists by companyName
      const existingCompany = await Companies.findOne({
        companyName: companyData.companyName,
      });

      if (existingCompany) {
        // Update existing company - merge data, prefer new non-empty values
        const updateData: any = {};
        Object.keys(companyData).forEach((key) => {
          if (key !== 'companyName' && key !== 'createdBy' && key !== 'uploaderId') {
            if (companyData[key] && companyData[key] !== existingCompany[key as keyof typeof existingCompany]) {
              updateData[key] = companyData[key];
            }
          }
        });
        
        if (Object.keys(updateData).length > 0) {
          await Companies.updateOne(
            { _id: existingCompany._id },
            { $set: updateData }
          );
          companiesUpdated++;
        }
      } else {
        // Create new company
        await Companies.create(companyData);
        companiesCreated++;
      }
    }

    // Prepare contacts for bulk insert with createdBy field
    const contactsToInsert = data.map((contact: any) => ({
      ...contact,
      createdBy: admin?.name,
      uploaderId: admin?._id,
    }));

    // Bulk insert all contacts
    const insertedContacts = await Contacts.insertMany(contactsToInsert, {
      ordered: true,
    });

    return NextResponse.json(
      {
        message: "Contacts and companies imported successfully",
        imported: insertedContacts.length,
        total: data.length,
        companiesCreated: companiesCreated,
        companiesUpdated: companiesUpdated,
        companiesTotal: companiesCreated + companiesUpdated,
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
