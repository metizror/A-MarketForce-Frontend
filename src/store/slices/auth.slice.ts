import { publicApiPost, setAuthToken, removeAuthToken } from "@/lib/api";
import { LoginPayload, LoginSuccessResponse, LoginFailResponse } from "@/types/auth.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface AuthState {
  user: {
    id: string;
    email: string;
    role: "admin" | "superadmin" | "customer" | null;
    name?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<
  LoginSuccessResponse,
  LoginPayload,
  { rejectValue: LoginFailResponse }
>("auth/login", async (data: LoginPayload, { rejectWithValue }) => {
  try {
    // Call API using publicApiPost function
    const response = await publicApiPost<LoginSuccessResponse | LoginFailResponse>(
      "/auth/login",
      {
        role: data.role,
        email: data.email,
        password: data.password,
      }
    );

    // Check if login was successful
    if ("token" in response && response.token) {
      const successResponse = response as LoginSuccessResponse;
      
      // Store token in localStorage
      setAuthToken(successResponse.token);
      
      return successResponse;
    } else {
      // Login failed
      const failResponse = response as LoginFailResponse;
      return rejectWithValue(failResponse);
    }
  } catch (error: any) {
    // Handle API errors
    let errorMessage = "Failed to login";
    let statusCode = 500;

    if (error.response) {
      // Server responded with error status
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.message || "Failed to login";
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection.";
    } else {
      // Error setting up request
      errorMessage = error.message || "Failed to login";
    }

    const failResponse: LoginFailResponse = {
      status: statusCode,
      message: errorMessage,
      customer: null,
      admin: null,
    };
    return rejectWithValue(failResponse);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers: {
  //   setCredentials: (
  //     state,
  //     action: PayloadAction<{
  //       user: AuthState["user"];
  //       token: string;
  //     }>
  //   ) => {
  //     state.user = action.payload.user;
  //     state.token = action.payload.token;
  //     state.isAuthenticated = true;
  //     state.error = null;
  //   },
  //   setLoading: (state, action: PayloadAction<boolean>) => {
  //     state.isLoading = action.payload;
  //   },
  //   setError: (state, action: PayloadAction<string | null>) => {
  //     state.error = action.payload;
  //     state.isLoading = false;
  //   },
  //   updateUser: (state, action: PayloadAction<Partial<AuthState["user"]>>) => {
  //     if (state.user) {
  //       state.user = { ...state.user, ...action.payload };
  //     }
  //   },
  //   logout: (state) => {
  //     state.user = null;
  //     state.token = null;
  //     state.isAuthenticated = false;
  //     state.error = null;
  //     state.isLoading = false;
  //   },
  //   clearError: (state) => {
  //     state.error = null;
  //   },
  // },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      // Remove token from localStorage
      removeAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login pending state
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    // Handle login success
    builder.addCase(login.fulfilled, (state, action) => {
      const response = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = response.token;
      
      // Set user data based on role (customer or admin)
      if (response.customer) {
        state.user = {
          id: response.customer._id,
          email: response.customer.email,
          role: "customer",
          firstName: response.customer.firstName,
          lastName: response.customer.lastName,
          companyName: response.customer.companyName,
          isActive: response.customer.isActive,
          isEmailVerified: response.customer.isEmailVerified,
        };
      } else if (response.admin) {
        state.user = {
          id: response.admin._id,
          email: response.admin.email,
          role: response.admin.role,
          name: response.admin.name,
        };
      }
      
      state.error = null;
    });

    // Handle login failure
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload?.message || "Login failed";
    });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;

