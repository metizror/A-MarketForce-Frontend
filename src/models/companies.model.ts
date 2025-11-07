import mongoose from "mongoose";

const companiesSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v.length > 0;
        },
        message: "Company name is required",
      },
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
  },
  {
    timestamps: true,
  }
);

const Companies =
  mongoose.models.Companies || mongoose.model("Companies", companiesSchema);
export default Companies;
