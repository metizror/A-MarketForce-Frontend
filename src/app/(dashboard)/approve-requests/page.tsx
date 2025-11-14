"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ApprovalRequests } from "@/components/ApprovalRequests";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getApproveRequests } from "@/store/slices/approveRequests.slice";
import type { ApprovalRequest, ActivityLog } from "@/types/dashboard.types";

export default function ApproveRequestsPage() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [approvalRequests, setApprovalRequests] = useState([] as ApprovalRequest[]);
  const [activityLogs, setActivityLogs] = useState([] as ActivityLog[]);
  const previousPathname = useRef(null as string | null);

  const dashboardUser = user ? {
    name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
    role: user.role || '',
  } : { name: '', role: '' };

  // Fetch approve requests when navigating to this page
  useEffect(() => {
    // Check if we navigated to this page (pathname changed to /approve-requests)
    const isNavigationToPage = previousPathname.current !== pathname && pathname === '/approve-requests';
    
    if (isNavigationToPage) {
      // Refresh approve requests on navigation
      dispatch(getApproveRequests({ page: 1, limit: 25 }));
      previousPathname.current = pathname;
    }
  }, [dispatch, pathname]);

  return (
    <ApprovalRequests
      approvalRequests={approvalRequests}
      setApprovalRequests={setApprovalRequests}
      currentUser={dashboardUser}
      onApprove={(request) => {
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          action: 'Customer Approved',
          details: `Approved customer registration for ${request.firstName} ${request.lastName} (${request.businessEmail})`,
          user: dashboardUser.name,
          role: dashboardUser.role,
          timestamp: new Date().toISOString()
        };
        setActivityLogs([newLog, ...activityLogs]);
      }}
    />
  );
}

