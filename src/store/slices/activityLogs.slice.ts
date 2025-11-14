import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApiCall } from "@/lib/api";
import type { ActivityLog } from "@/types/dashboard.types";

export interface GetActivityLogsParams {
  page?: number;
  limit?: number;
}

export interface ActivityLogsResponse {
  activities: Array<{
    _id: string;
    action: string;
    details: string;
    user: string;
    role: string;
    createdAt: string;
    timestamp?: string;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalActivities: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ActivityLogsState {
  logs: ActivityLog[];
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
  // Cache tracking
  lastFetchParams: GetActivityLogsParams | null;
  lastFetchTime: number | null;
}

const initialState: ActivityLogsState = {
  logs: [],
  pagination: null,
  isLoading: false,
  error: null,
  lastFetchParams: null,
  lastFetchTime: null,
};

// Get activity logs
export const getActivityLogs = createAsyncThunk<
  ActivityLogsResponse,
  GetActivityLogsParams,
  { rejectValue: { message: string } }
>('activityLogs/getActivityLogs', async (params, { rejectWithValue }) => {
  try {
    const page = params.page || 1;
    const limit = params.limit || 25;
    
    const response = await privateApiCall<ActivityLogsResponse>(
      `/admin/activity-logs?page=${page}&limit=${limit}`
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch activity logs';
    return rejectWithValue({ message: errorMessage });
  }
});

const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    invalidateCache: (state) => {
      state.lastFetchParams = null;
      state.lastFetchTime = null;
    },
  },
  extraReducers: (builder) => {
    // Get activity logs
    builder
      .addCase(getActivityLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        // Map the API response to match our ActivityLog interface
        state.logs = action.payload.activities.map((activity) => ({
          id: activity._id.toString(),
          action: activity.action,
          details: activity.details,
          user: activity.user,
          role: activity.role,
          timestamp: activity.timestamp || activity.createdAt,
        }));
        // Set pagination from API response
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalCount: action.payload.pagination.totalActivities,
          limit: action.payload.pagination.limit,
          hasNextPage: action.payload.pagination.hasNextPage,
          hasPreviousPage: action.payload.pagination.hasPreviousPage,
        };
        // Update cache tracking
        state.lastFetchParams = action.meta.arg;
        state.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch activity logs';
        state.logs = [];
        state.pagination = null;
      });
  },
});

export const { clearError, invalidateCache } = activityLogsSlice.actions;
export default activityLogsSlice.reducer;

