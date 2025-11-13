import { Company } from "@/types/dashboard.types";
import mongoose from "mongoose";

const companiesSchema: mongoose.Schema<Company> = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },
    phone: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    country: {
      type: String,
    },
    website: {
      type: String,
    },
    revenue: {
      type: String,
    },
    employeeSize: {
      type: String,
    },
    industry: {
      type: String,
    },
    subIndustry: {
      type: String,
    },
    technology: {
      type: String,
    },
    companyLinkedInUrl: {
      type: String,
    },
    amfNotes: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      required: [true, "Uploader ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Companies =
  mongoose.models.Companies || mongoose.model("Companies", companiesSchema);
export default Companies;
