"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

/**
 * Custom hook to get user role from Redux state
 * Role is saved from login API response and persists after page refresh
 * 
 * @returns {string|null} User role: "admin" | "superadmin" | "customer" | null
 */
export function useRoleBasedDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated (after loading)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Get user role from Redux state (saved from login API)
  const role = user?.role || null;

  return role;
}

