import { publicApiPost, setAuthToken, removeAuthToken } from "@/lib/api";
import { LoginPayload, LoginSuccessResponse, LoginFailResponse, VerifyOtpPayload, VerifyOtpResponse } from "@/types/auth.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveAuthState, clearAuthState } from "@/utils/authStorage";


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
  verifiedCustomer: any | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to wait for initialization from localStorage
  error: null,
  verifiedCustomer: null,
};

export const login = createAsyncThunk<
  LoginSuccessResponse,
  LoginPayload,
  { rejectValue: LoginFailResponse }
>("auth/login", async (data: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await publicApiPost<LoginSuccessResponse | LoginFailResponse>(
      "/auth/login",
      {
        role: data.role,
        email: data.email,
        password: data.password,
      }
    );

    if ("token" in response && response.token) {
      setAuthToken(response.token);
      return response as LoginSuccessResponse;
    }

    return rejectWithValue(response as LoginFailResponse);
  } catch (error: any) {
    const failResponse: LoginFailResponse = {
      status: error.response?.data?.status || error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to login",
      customer: null,
      admin: null,
    };
    return rejectWithValue(failResponse);
  }
});

export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse & { customer?: any },
  VerifyOtpPayload,
  { rejectValue: { message: string } }
>("auth/verifyOtp", async (data: VerifyOtpPayload, { rejectWithValue }) => {
  try {
    // Get email from sessionStorage if not provided in payload
    let email = data.email;
    if (!email && typeof window !== "undefined") {
      email = sessionStorage.getItem("registrationEmail") || "";
    }

    if (!email) {
      return rejectWithValue({ message: "Email not found. Please try registration again." });
    }

    const response = await publicApiPost<VerifyOtpResponse>(
      "/auth/verify-otp",
      {
        email,
        otp: data.otp,
      }
    );

    if (response.isEmailVerified) {
      // Get customer data from sessionStorage
      let customer = null;
      if (typeof window !== "undefined") {
        const storedCustomer = sessionStorage.getItem("registeredCustomer");
        if (storedCustomer) {
          try {
            customer = JSON.parse(storedCustomer);
          } catch (e) {
            console.error("Error parsing stored customer:", e);
          }
        }
      }

      return {
        ...response,
        customer,
      };
    }

    return rejectWithValue({ message: response.message || "Invalid OTP" });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to verify OTP";
    return rejectWithValue({ message: errorMessage });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      state.verifiedCustomer = null;
      // Remove all tokens and auth state from localStorage
      removeAuthToken();
      clearAuthState();
    },
    // Initialize auth from localStorage on page refresh
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("authState");
          if (stored) {
            const storedState = JSON.parse(stored);
            if (storedState.isAuthenticated && storedState.user && storedState.token) {
              state.user = storedState.user;
              state.token = storedState.token;
              state.isAuthenticated = storedState.isAuthenticated;
              console.log("Auth state restored from localStorage:", {
                email: storedState.user?.email,
                role: storedState.user?.role,
              });
            }
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
        } finally {
          // Always set isLoading to false after initialization attempt
          state.isLoading = false;
        }
      } else {
        // Server-side: no localStorage, mark as not loading
        state.isLoading = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearVerifiedCustomer: (state) => {
      state.verifiedCustomer = null;
    },
    resetAuthState: (state) => {
      // Reset to initial state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      state.verifiedCustomer = null;
      // Clear all sessionStorage related to registration
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("registrationEmail");
        sessionStorage.removeItem("registeredCustomer");
        sessionStorage.removeItem("canAccessOtpVerify");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading = false;
      state.token = payload.token;
      state.isAuthenticated = true;
      state.user = payload.customer
        ? {
            id: payload.customer._id,
            email: payload.customer.email,
            role: "customer",
            firstName: payload.customer.firstName,
            lastName: payload.customer.lastName,
            companyName: payload.customer.companyName,
            isActive: payload.customer.isActive,
            isEmailVerified: payload.customer.isEmailVerified,
          }
        : payload.admin
        ? {
            id: payload.admin._id,
            email: payload.admin.email,
            role: payload.admin.role,
            name: payload.admin.name,
          }
        : null;
      saveAuthState({ user: state.user, token: state.token, isAuthenticated: true });
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Login failed";
    });
    builder.addCase(verifyOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // Update customer with verified status
      if (action.payload.customer) {
        state.verifiedCustomer = {
          ...action.payload.customer,
          isEmailVerified: true, // Mark as verified after successful OTP verification
        };
      } else {
        state.verifiedCustomer = null;
      }
      // Clear sessionStorage after successful verification
      // This prevents user from accessing OTP verify page again
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("registrationEmail");
        sessionStorage.removeItem("registeredCustomer");
        sessionStorage.removeItem("canAccessOtpVerify");
      }
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "OTP verification failed";
      state.verifiedCustomer = null;
    });
  },
});

export const { logout, clearError, initializeAuth, clearVerifiedCustomer, resetAuthState } = authSlice.actions;

export default authSlice.reducer;

