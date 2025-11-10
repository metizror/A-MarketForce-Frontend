import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import customerRegisterReducer from "./slices/customerRegister.slice";
import resetPasswordReducer from "./slices/resetPassword.slice";
import contactsReducer from "./slices/contacts.slice";
import companiesReducer from "./slices/companies.slice";
import approveRequestsReducer from "./slices/approveRequests.slice";
import adminUsersReducer from "./slices/adminUsers.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      customerRegister: customerRegisterReducer,
      resetPassword: resetPasswordReducer,
      contacts: contactsReducer,
      companies: companiesReducer,
      approveRequests: approveRequestsReducer,
      adminUsers: adminUsersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

