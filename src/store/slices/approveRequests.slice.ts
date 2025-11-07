import { ApprovalRequest } from "@/types/dashboard.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApiCall, privateApiPost } from "@/lib/api";

export interface GetApproveRequestsParams {
  page?: number;
  limit?: number;
}

export interface ApproveRequestsResponse {
  allRequests: any[];
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApproveRequestPayload {
  customerId: string;
  flag: boolean;
  rejectionReason?: string;
}

export interface ApproveRequestResponse {
  success?: boolean;
  message: string;
}

interface ApproveRequestsState {
  requests: ApprovalRequest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  stats: {
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  };
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  error: string | null;
}

const initialState: ApproveRequestsState = {
  requests: [],
  pagination: null,
  stats: {
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  },
  isLoading: false,
  isApproving: false,
  isRejecting: false,
  error: null,
};

// Helper function to safely convert date to ISO string
const toISOString = (date: any): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  if (date instanceof Date) return date.toISOString();
  // If it's an object with toISOString method (like Mongoose Date)
  if (typeof date.toISOString === 'function') return date.toISOString();
  return undefined;
};

// Helper function to map CustomerAuth to ApprovalRequest
const mapToApprovalRequest = (customer: any): ApprovalRequest => {
  return {
    id: customer._id?.toString() || customer.id,
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    businessEmail: customer.email || '',
    companyName: customer.companyName || '',
    status: customer.isActive ? 'approved' : (customer.rejectionReason ? 'rejected' : 'pending'),
    createdAt: toISOString(customer.createdAt) || new Date().toISOString(),
    reviewedBy: customer.reviewedBy,
    reviewedAt: toISOString(customer.updatedAt),
    notes: customer.rejectionReason,
  };
};

// Get all approve requests with pagination
export const getApproveRequests = createAsyncThunk<
  ApproveRequestsResponse,
  GetApproveRequestsParams,
  { rejectValue: { message: string } }
>('approveRequests/getApproveRequests', async (params, { rejectWithValue }) => {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    
    // Use GET with query parameters
    const response = await privateApiCall<ApproveRequestsResponse>(
      `/admin/approve-request?page=${page}&limit=${limit}`
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch approve requests';
    return rejectWithValue({ message: errorMessage });
  }
});

// Approve a request
export const approveRequest = createAsyncThunk<
  ApproveRequestResponse,
  { customerId: string },
  { rejectValue: { message: string } }
>('approveRequests/approveRequest', async (payload, { rejectWithValue }) => {
  try {
    // Validate customerId
    const customerId = String(payload.customerId || '').trim();
    if (!customerId || customerId === '' || customerId === 'undefined' || customerId === 'null') {
      return rejectWithValue({ message: 'Customer ID is required and must be valid' });
    }

    const requestBody: ApproveRequestPayload = {
      customerId: customerId,
      flag: true,
    };

    const response = await privateApiPost<ApproveRequestResponse>(
      '/admin/approve-request',
      requestBody
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to approve request';
    return rejectWithValue({ message: errorMessage });
  }
});

// Reject a request
export const rejectRequest = createAsyncThunk<
  ApproveRequestResponse,
  { customerId: string; rejectionReason: string },
  { rejectValue: { message: string } }
>('approveRequests/rejectRequest', async (payload, { rejectWithValue }) => {
  try {
    // Validate customerId
    const customerId = String(payload.customerId || '').trim();
    if (!customerId || customerId === '' || customerId === 'undefined' || customerId === 'null') {
      return rejectWithValue({ message: 'Customer ID is required and must be valid' });
    }

    if (!payload.rejectionReason || payload.rejectionReason.trim() === '') {
      return rejectWithValue({ message: 'Rejection reason is required' });
    }

    const requestBody: ApproveRequestPayload = {
      customerId: customerId,
      flag: false,
      rejectionReason: payload.rejectionReason.trim(),
    };

    const response = await privateApiPost<ApproveRequestResponse>(
      '/admin/approve-request',
      requestBody
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to reject request';
    return rejectWithValue({ message: errorMessage });
  }
});

const approveRequestsSlice = createSlice({
  name: 'approveRequests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get approve requests
    builder
      .addCase(getApproveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getApproveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        // Map the API response to ApprovalRequest format
        state.requests = (action.payload.allRequests || []).map(mapToApprovalRequest);
        state.pagination = action.payload.pagination;
        state.stats = {
          pendingRequests: action.payload.pendingRequests || 0,
          approvedRequests: action.payload.approvedRequests || 0,
          rejectedRequests: action.payload.rejectedRequests || 0,
        };
        state.error = null;
      })
      .addCase(getApproveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch approve requests';
      });

    // Approve request
    builder
      .addCase(approveRequest.pending, (state) => {
        state.isApproving = true;
        state.error = null;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.isApproving = false;
        // Update the request status in the list
        const customerId = action.meta.arg.customerId;
        const requestIndex = state.requests.findIndex(
          (req) => req.id === customerId || (req as any).customerId === customerId
        );
        if (requestIndex !== -1) {
          state.requests[requestIndex] = {
            ...state.requests[requestIndex],
            status: 'approved',
            reviewedAt: new Date().toISOString(),
          };
        }
        // Update stats
        state.stats.pendingRequests = Math.max(0, state.stats.pendingRequests - 1);
        state.stats.approvedRequests += 1;
        state.error = null;
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.isApproving = false;
        state.error = action.payload?.message || 'Failed to approve request';
      });

    // Reject request
    builder
      .addCase(rejectRequest.pending, (state) => {
        state.isRejecting = true;
        state.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.isRejecting = false;
        // Update the request status in the list
        const customerId = action.meta.arg.customerId;
        const requestIndex = state.requests.findIndex(
          (req) => req.id === customerId || (req as any).customerId === customerId
        );
        if (requestIndex !== -1) {
          state.requests[requestIndex] = {
            ...state.requests[requestIndex],
            status: 'rejected',
            reviewedAt: new Date().toISOString(),
            notes: action.meta.arg.rejectionReason,
          };
        }
        // Update stats
        state.stats.pendingRequests = Math.max(0, state.stats.pendingRequests - 1);
        state.stats.rejectedRequests += 1;
        state.error = null;
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.isRejecting = false;
        state.error = action.payload?.message || 'Failed to reject request';
      });
  },
});

export const { clearError } = approveRequestsSlice.actions;
export default approveRequestsSlice.reducer;

