import { Contact } from "@/types/dashboard.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApiCall, privateApiPost, privateApiPut, privateApiDelete } from "@/lib/api";

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
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  // Cache tracking
  lastFetchParams: GetContactsParams | null;
  lastFetchTime: number | null;
}

const initialState: ContactsState = {
  contacts: [],
  pagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  lastFetchParams: null,
  lastFetchTime: null,
};

export const getContacts = createAsyncThunk<
  ContactsResponse,
  GetContactsParams,
  { rejectValue: { message: string } }
>('contacts/getContacts', async (params, { rejectWithValue }) => {
  try {
    // Helper function to encode revenue (no $ sign in values, so standard encoding is fine)
    const encodeRevenue = (revenue: string): string => {
      // Revenue values are now without $ sign (e.g., "10M-50M"), so standard encoding works
      return encodeURIComponent(revenue);
    };

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
      // Revenue values should preserve $ sign in URL (e.g., "$10M-$50M")
      queryParts.push(`revenue=${encodeRevenue(params.revenue)}`);
    }
    if (params.employeeSize) {
      // EmployeeSize values are already in format without spaces (e.g., "1-25")
      queryParts.push(`employeeSize=${encodeURIComponent(params.employeeSize)}`);
    }
    if (params.jobTitle) queryParts.push(`jobTitle=${encodeURIComponent(params.jobTitle)}`);
    if (params.jobLevel) queryParts.push(`jobLevel=${encodeURIComponent(params.jobLevel)}`);
    if (params.jobRole) queryParts.push(`jobRole=${encodeURIComponent(params.jobRole)}`);

    const queryString = queryParts.join('&');
    const endpoint = `/admin/contacts${queryString ? `?${queryString}` : ''}`;
    
    const response = await privateApiCall<ContactsResponse>(endpoint);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch contacts';
    return rejectWithValue({ message: errorMessage });
  }
});

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  jobLevel?: string;
  jobRole?: string;
  email?: string;
  phone?: string;
  directPhone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  industry?: string;
  subIndustry?: string;
  LinkedInUrl?: string;
  lastUpdateDate?: string;
  companyName?: string;
  employeeSize?: string;
  revenue?: string;
  amfNotes?: string;
}

export interface CreateContactResponse {
  success: boolean;
  message: string;
  contact?: Contact;
}

export const createContact = createAsyncThunk<
  CreateContactResponse,
  CreateContactPayload,
  { rejectValue: { message: string } }
>('contacts/createContact', async (payload, { rejectWithValue }) => {
  try {
    // Prepare the data payload matching the API structure
    // Values are sent as-is from dropdown (with dashes, no spaces)
    // Dropdown value format: "$1M-$5M", "1-25" -> API receives same format
    const apiPayload = {
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        jobTitle: payload.jobTitle || undefined,
        jobLevel: payload.jobLevel || undefined,
        jobRole: payload.jobRole || undefined,
        email: payload.email || undefined,
        phone: payload.phone || undefined,
        directPhone: payload.directPhone || undefined,
        address1: payload.address1 || undefined,
        address2: payload.address2 || undefined,
        city: payload.city || undefined,
        state: payload.state || undefined,
        zipCode: payload.zipCode || undefined,
        country: payload.country || undefined,
        website: payload.website || undefined,
        industry: payload.industry || undefined,
        subIndustry: payload.subIndustry || undefined,
        LinkedInUrl: payload.LinkedInUrl || undefined,
        lastUpdateDate: payload.lastUpdateDate || undefined,
        companyName: payload.companyName || undefined,
        employeeSize: payload.employeeSize || undefined,
        revenue: payload.revenue || undefined,
        amfNotes: payload.amfNotes || undefined,
      },
    };

    // Remove undefined fields
    Object.keys(apiPayload.data).forEach((key) => {
      if (apiPayload.data[key as keyof typeof apiPayload.data] === undefined) {
        delete apiPayload.data[key as keyof typeof apiPayload.data];
      }
    });

    const response = await privateApiPost<CreateContactResponse>('/admin/contacts', apiPayload);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create contact';
    return rejectWithValue({ message: errorMessage });
  }
});

export interface UpdateContactPayload {
  id: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  jobLevel?: string;
  jobRole?: string;
  email?: string;
  phone?: string;
  directPhone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  industry?: string;
  subIndustry?: string;
  LinkedInUrl?: string;
  lastUpdateDate?: string;
  companyName?: string;
  employeeSize?: string;
  revenue?: string;
  amfNotes?: string;
}

export interface UpdateContactResponse {
  success: boolean;
  message: string;
  contact?: Contact;
}

export const updateContact = createAsyncThunk<
  UpdateContactResponse,
  UpdateContactPayload,
  { rejectValue: { message: string } }
>('contacts/updateContact', async (payload, { rejectWithValue }) => {
  try {
    // Prepare the data payload matching the API structure
    // Values are sent as-is from dropdown (with dashes, no spaces)
    const apiPayload = {
      data: {
        id: payload.id,
        firstName: payload.firstName || undefined,
        lastName: payload.lastName || undefined,
        jobTitle: payload.jobTitle || undefined,
        jobLevel: payload.jobLevel || undefined,
        jobRole: payload.jobRole || undefined,
        email: payload.email || undefined,
        phone: payload.phone || undefined,
        directPhone: payload.directPhone || undefined,
        address1: payload.address1 || undefined,
        address2: payload.address2 || undefined,
        city: payload.city || undefined,
        state: payload.state || undefined,
        zipCode: payload.zipCode || undefined,
        country: payload.country || undefined,
        website: payload.website || undefined,
        industry: payload.industry || undefined,
        subIndustry: payload.subIndustry || undefined,
        LinkedInUrl: payload.LinkedInUrl || undefined,
        lastUpdateDate: payload.lastUpdateDate || undefined,
        companyName: payload.companyName || undefined,
        employeeSize: payload.employeeSize || undefined,
        revenue: payload.revenue || undefined,
        amfNotes: payload.amfNotes || undefined,
      },
    };

    // Remove undefined fields
    Object.keys(apiPayload.data).forEach((key) => {
      if (apiPayload.data[key as keyof typeof apiPayload.data] === undefined) {
        delete apiPayload.data[key as keyof typeof apiPayload.data];
      }
    });

    const response = await privateApiPut<UpdateContactResponse>('/admin/contacts', apiPayload);
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update contact';
    return rejectWithValue({ message: errorMessage });
  }
});

export interface DeleteContactsPayload {
  ids: string[];
}

export interface DeleteContactsResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}

export const deleteContacts = createAsyncThunk<
  DeleteContactsResponse,
  DeleteContactsPayload,
  { rejectValue: { message: string } }
>('contacts/deleteContacts', async (payload, { rejectWithValue }) => {
  try {
    // DELETE request with body containing ids array
    // The API expects { ids: [...] } in the request body
    const response = await privateApiDelete<DeleteContactsResponse>('/admin/contacts', {
      data: payload,
    });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete contacts';
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
      state.lastFetchParams = null;
      state.lastFetchTime = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    invalidateCache: (state) => {
      state.lastFetchParams = null;
      state.lastFetchTime = null;
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
      // Also map createdBy from API to the contact object
      state.contacts = action.payload.contacts.map((contact: any) => ({
        ...contact,
        id: contact._id || contact.id,
        createdBy: contact.createdBy || contact.addedBy || undefined,
      }));
      state.pagination = action.payload.pagination;
      // Update cache tracking
      state.lastFetchParams = action.meta.arg;
      state.lastFetchTime = Date.now();
      state.error = null;
    });
    builder.addCase(getContacts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Failed to fetch contacts';
      state.contacts = [];
      state.pagination = null;
    });
    builder.addCase(createContact.pending, (state) => {
      state.isCreating = true;
      state.error = null;
    });
    builder.addCase(createContact.fulfilled, (state) => {
      state.isCreating = false;
      state.error = null;
    });
    builder.addCase(createContact.rejected, (state, action) => {
      state.isCreating = false;
      state.error = action.payload?.message || 'Failed to create contact';
    });
    builder.addCase(updateContact.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(updateContact.fulfilled, (state) => {
      state.isUpdating = false;
      state.error = null;
    });
    builder.addCase(updateContact.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload?.message || 'Failed to update contact';
    });
    builder.addCase(deleteContacts.pending, (state) => {
      state.isDeleting = true;
      state.error = null;
    });
    builder.addCase(deleteContacts.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.error = null;
      // Remove deleted contacts from the state
      const deletedIds = action.meta.arg.ids;
      state.contacts = state.contacts.filter(contact => {
        const contactId = contact.id || (contact as any)._id;
        return !deletedIds.includes(contactId);
      });
      // Update pagination totalCount if available
      if (state.pagination && action.payload.deletedCount) {
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - action.payload.deletedCount);
      }
    });
    builder.addCase(deleteContacts.rejected, (state, action) => {
      state.isDeleting = false;
      state.error = action.payload?.message || 'Failed to delete contacts';
    });
  },
});

export const { clearContacts, clearError, invalidateCache } = contactsSlice.actions;
export default contactsSlice.reducer;