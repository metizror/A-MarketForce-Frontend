import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobLevel: {
      type: String,
    },
    jobRole: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    directPhone: {
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
    industry: {
      type: String,
    },
    subIndustry: {
      type: String,
    },
    LinkedInUrl: {
      type: String,
    },
    lastUpdateDate: {
      type: Date,
    },
    companyName: {
      type: String,
      required: true,
    },
    employeeSize: {
      type: String,
      required: true,
    },
    revenue: {
      type: String,
      required: true,
    },
    amfNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Contacts = mongoose.models.Contacts ||
  mongoose.model("Contacts", contactsSchema);
export default Contacts;
