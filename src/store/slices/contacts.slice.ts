import { Contact } from "@/types/dashboard.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApiCall } from "@/lib/api";

export interface GetContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  companyName?: string;
  industry?: string;
  subIndustry?: string;
  country?: string;
  state?: string;
  revenue?: string;
  employeeSize?: string;
  jobTitle?: string;
  jobLevel?: string;
  jobRole?: string;
  technology?: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ContactsState {
  contacts: Contact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const getContacts = createAsyncThunk<
  ContactsResponse,
  GetContactsParams,
  { rejectValue: { message: string } }
>('contacts/getContacts', async (params, { rejectWithValue }) => {
  try {
    // Build query string manually to avoid URL encoding issues with special characters
    const queryParts: string[] = [];
    
    if (params.page) queryParts.push(`page=${params.page.toString()}`);
    if (params.limit) queryParts.push(`limit=${params.limit.toString()}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.companyName) queryParts.push(`companyName=${encodeURIComponent(params.companyName)}`);
    if (params.industry) queryParts.push(`industry=${encodeURIComponent(params.industry)}`);
    if (params.subIndustry) queryParts.push(`subIndustry=${encodeURIComponent(params.subIndustry)}`);
    if (params.country) queryParts.push(`country=${encodeURIComponent(params.country)}`);
    if (params.state) queryParts.push(`state=${encodeURIComponent(params.state)}`);
    if (params.revenue) {
      // Revenue values are already in format without spaces (e.g., "50M-100M")
      queryParts.push(`revenue=${encodeURIComponent(params.revenue)}`);
    }
    if (params.employeeSize) {
      // EmployeeSize values are already in format without spaces (e.g., "1-25")
      queryParts.push(`employeeSize=${encodeURIComponent(params.employeeSize)}`);
    }
    if (params.jobTitle) queryParts.push(`jobTitle=${encodeURIComponent(params.jobTitle)}`);
    if (params.jobLevel) queryParts.push(`jobLevel=${encodeURIComponent(params.jobLevel)}`);
    if (params.jobRole) queryParts.push(`jobRole=${encodeURIComponent(params.jobRole)}`);
    if (params.technology) queryParts.push(`technology=${encodeURIComponent(params.technology)}`);

    const queryString = queryParts.join('&');
    const endpoint = `/admin/contacts${queryString ? `?${queryString}` : ''}`;
    
    const response = await privateApiCall<ContactsResponse>(endpoint);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch contacts';
    return rejectWithValue({ message: errorMessage });
  }
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearContacts: (state) => {
      state.contacts = [];
      state.pagination = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      // Map contacts to ensure they have 'id' field (convert _id to id)
      state.contacts = action.payload.contacts.map((contact: any) => ({
        ...contact,
        id: contact._id || contact.id,
      }));
      state.pagination = action.payload.pagination;
      state.error = null;
    });
    builder.addCase(getContacts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Failed to fetch contacts';
      state.contacts = [];
      state.pagination = null;
    });
  },
});

export const { clearContacts, clearError } = contactsSlice.actions;
export default contactsSlice.reducer;