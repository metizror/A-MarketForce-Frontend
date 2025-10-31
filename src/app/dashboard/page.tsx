"use client";

import { useRoleBasedDashboard } from "@/hooks/useRoleBasedDashboard";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import CustomerDashboard from "@/components/CustomerDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { useState } from "react";
import type { User, Contact, Company, ActivityLog, ApprovalRequest } from "@/types/dashboard.types";

const DashboardPage = () => {
  const role = useRoleBasedDashboard(); // Get role from hook
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // State for dashboard data (can be replaced with API calls later)
  const [contacts, setContacts] = useState([] as Contact[]);
  const [companies, setCompanies] = useState([] as Company[]);
  const [users, setUsers] = useState([] as User[]);
  const [activityLogs, setActivityLogs] = useState([] as ActivityLog[]);
  const [approvalRequests, setApprovalRequests] = useState([] as ApprovalRequest[]);

  // Handle logout - Clear all localStorage data and navigate to root
  const handleLogout = () => {
    // Dispatch logout action which clears Redux state and localStorage
    dispatch(logout());
    // Navigate to root page after logout
    router.push("/");
  };

  // Convert Redux user to User type for dashboard components
  const dashboardUser: User | null = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
        role: user.role || null,
      }
    : null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show nothing if no role (will redirect in hook)
  if (!role || !dashboardUser) {
    return null;
  }

  // Render dashboard based on role
  if (role === "customer") {
    return <CustomerDashboard onLogout={handleLogout} />;
  }

  if (role === "admin" && dashboardUser) {
    return (
      <AdminDashboard
        user={dashboardUser}
        contacts={contacts}
        companies={companies}
        activityLogs={activityLogs}
        approvalRequests={approvalRequests}
        setContacts={setContacts}
        setCompanies={setCompanies}
        setActivityLogs={setActivityLogs}
        setApprovalRequests={setApprovalRequests}
        onLogout={handleLogout}
      />
    );
  }

  if (role === "superadmin" && dashboardUser) {
    return (
      <SuperAdminDashboard
        user={dashboardUser}
        contacts={contacts}
        companies={companies}
        users={users}
        activityLogs={activityLogs}
        approvalRequests={approvalRequests}
        setContacts={setContacts}
        setCompanies={setCompanies}
        setUsers={setUsers}
        setActivityLogs={setActivityLogs}
        setApprovalRequests={setApprovalRequests}
        onLogout={handleLogout}
      />
    );
  }

  return null;
};

export default DashboardPage;   