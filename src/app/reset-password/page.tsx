"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useResetPassword } from "@/hooks/useResetPassword";
import { initializeFromStorage, setRole } from "@/store/slices/resetPassword.slice";
import SendOtpStep from "@/components/reset-password/SendOtpStep";
import VerifyOtpStep from "@/components/reset-password/VerifyOtpStep";
import ResetPasswordStep from "@/components/reset-password/ResetPasswordStep";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { step, role } = useResetPassword();

  useEffect(() => {
    // Initialize from sessionStorage on mount only once
    dispatch(initializeFromStorage());

    // Get role from sessionStorage if not already in Redux state
    if (!role && typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("resetPasswordRole");
      if (storedRole && (storedRole === "superadmin" || storedRole === "admin" || storedRole === "customer")) {
        dispatch(setRole(storedRole));
      } else {
        // If no role found, redirect to login
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Determine which step to show based on Redux state
  const renderStep = () => {
    switch (step) {
      case "send-otp":
        return <SendOtpStep />;
      case "verify-otp":
        return <VerifyOtpStep />;
      case "reset-password":
        return <ResetPasswordStep />;
      default:
        return <SendOtpStep />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-md">{renderStep()}</div>
    </div>
  );
}

