"use client";

import { useState } from "react";
import { ApprovalRequests } from "@/components/ApprovalRequests";
import { useAppSelector } from "@/store/hooks";
import type { ApprovalRequest, ActivityLog } from "@/types/dashboard.types";

export default function ApproveRequestsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [approvalRequests, setApprovalRequests] = useState([] as ApprovalRequest[]);
  const [activityLogs, setActivityLogs] = useState([] as ActivityLog[]);

  const dashboardUser = user ? {
    name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
    role: user.role || '',
  } : { name: '', role: '' };

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

