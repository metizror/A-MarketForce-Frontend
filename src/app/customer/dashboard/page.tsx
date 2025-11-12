"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerDashboard from "@/components/CustomerDashboard";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, token } = useAppSelector((state) => state.auth);

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user || !token) {
        router.push("/");
        return;
      }
      if (user.role !== "customer") {
        // If not a customer, redirect to appropriate dashboard
        if (user.role === "admin" || user.role === "superadmin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, token, router]);

  const handleLogout = () => {
    // Clear all storage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    // Dispatch logout action
    dispatch(logout());
    // Navigate to root login page
    router.push("/");
  };

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

  // Redirect if not authenticated or not customer
  if (!isAuthenticated || !user || !token || user.role !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <CustomerDashboard onLogout={handleLogout} />;
}




