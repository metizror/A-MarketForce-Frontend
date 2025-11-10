import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApiCall, privateApiPost } from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
}

export interface AdminUsersResponse {
  admins: Array<{
    _id: string;
    name: string;
    email: string;
    role: "admin" | "superadmin";
  }>;
  totalAdmins: number;
  totalPages: number;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
}

export interface CreateAdminUserResponse {
  message: string;
  admin: {
    email: string;
    name: string;
    role: string;
  };
}

interface AdminUsersState {
  users: AdminUser[];
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
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  pagination: null,
  isLoading: false,
  isCreating: false,
  error: null,
};

// Get admin users
export const getAdminUsers = createAsyncThunk<
  AdminUsersResponse,
  GetAdminUsersParams,
  { rejectValue: { message: string } }
>('adminUsers/getAdminUsers', async (params, { rejectWithValue }) => {
  try {
    const page = params.page || 1;
    const limit = params.limit || 25;
    
    const response = await privateApiCall<AdminUsersResponse>(
      `/auth/create-admin?page=${page}&limit=${limit}`
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch admin users';
    return rejectWithValue({ message: errorMessage });
  }
});

// Create admin user
export const createAdminUser = createAsyncThunk<
  CreateAdminUserResponse,
  CreateAdminUserPayload,
  { rejectValue: { message: string } }
>('adminUsers/createAdminUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await privateApiPost<CreateAdminUserResponse>(
      '/auth/create-admin',
      payload
    );
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create admin user';
    return rejectWithValue({ message: errorMessage });
  }
});

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get admin users
    builder
      .addCase(getAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Map the API response to match our AdminUser interface
        state.users = action.payload.admins.map((admin) => ({
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }));
        // Calculate pagination from API response
        const page = action.meta.arg.page || 1;
        const limit = action.meta.arg.limit || 25;
        state.pagination = {
          currentPage: page,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalAdmins,
          limit: limit,
          hasNextPage: page < action.payload.totalPages,
          hasPreviousPage: page > 1,
        };
        state.error = null;
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch admin users';
        state.users = [];
        state.pagination = null;
      });

    // Create admin user
    builder
      .addCase(createAdminUser.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createAdminUser.fulfilled, (state) => {
        state.isCreating = false;
        state.error = null;
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Failed to create admin user';
      });
  },
});

export const { clearError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;

