"use client";

import { useEffect, useState } from "react";
import { ActivityLogsPanel } from "@/components/ActivityLogsPanel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getActivityLogs } from "@/store/slices/activityLogs.slice";

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { logs, pagination, isLoading, error } = useAppSelector((state) => state.activityLogs);
  const { user } = useAppSelector((state) => state.auth);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(25);

  useEffect(() => {
    dispatch(getActivityLogs({ page: currentPage, limit: currentLimit }));
  }, [dispatch, currentPage, currentLimit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  return (
    <div className="h-full w-full">
      <ActivityLogsPanel 
        logs={logs} 
        pagination={pagination}
        isLoading={isLoading} 
        error={error}
        userRole={user?.role || null}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isFullScreen={true}
      />
    </div>
  );
}

