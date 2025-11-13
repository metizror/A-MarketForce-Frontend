import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApiPost } from "@/lib/api";

export interface ContactImportData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  jobLevel: string;
  jobRole: string;
  email: string;
  phone: string;
  directPhone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  industry: string;
  subIndustry: string;
  contactLinkedIn: string;
  companyName: string;
  employeeSize: string;
  revenue: string;
}

export interface ImportContactsPayload {
  data: ContactImportData[];
}

export interface ImportContactsResponse {
  message: string;
  success?: number;
  failed?: number;
  errors?: Array<{
    row: number;
    email: string;
    error: string;
  }>;
}

interface ContactsImportState {
  isImporting: boolean;
  importResult: ImportContactsResponse | null;
  error: string | null;
}

const initialState: ContactsImportState = {
  isImporting: false,
  importResult: null,
  error: null,
};

// Import contacts from Excel/data
export const importContacts = createAsyncThunk<
  ImportContactsResponse,
  ImportContactsPayload,
  { rejectValue: { message: string } }
>('contactsImport/importContacts', async (payload, { rejectWithValue }) => {
  try {
    const response = await privateApiPost<ImportContactsResponse>(
      '/admin/contacts-import-data',
      payload
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to import contacts';
    return rejectWithValue({ message: errorMessage });
  }
});

const contactsImportSlice = createSlice({
  name: 'contactsImport',
  initialState,
  reducers: {
    clearImportResult: (state) => {
      state.importResult = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Import contacts
    builder
      .addCase(importContacts.pending, (state) => {
        state.isImporting = true;
        state.error = null;
        state.importResult = null;
      })
      .addCase(importContacts.fulfilled, (state, action) => {
        state.isImporting = false;
        state.importResult = action.payload;
        state.error = null;
      })
      .addCase(importContacts.rejected, (state, action) => {
        state.isImporting = false;
        state.error = action.payload?.message || 'Failed to import contacts';
        state.importResult = null;
      });
  },
});

export const { clearImportResult, clearError } = contactsImportSlice.actions;
export default contactsImportSlice.reducer;

