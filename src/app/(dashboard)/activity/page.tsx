"use client";

import { useEffect, useState, useMemo } from "react";
import { ActivityLogsPanel } from "@/components/ActivityLogsPanel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getActivityLogs } from "@/store/slices/activityLogs.slice";

// Helper function to check if params match
const paramsMatch = (params1: { page?: number; limit?: number } | null, params2: { page?: number; limit?: number }): boolean => {
  if (!params1) return false;
  return params1.page === params2.page && params1.limit === params2.limit;
};

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { logs, pagination, isLoading, error, lastFetchParams, lastFetchTime } = useAppSelector((state) => state.activityLogs);
  const { user } = useAppSelector((state) => state.auth);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(25);

  // Memoize current params to avoid unnecessary re-renders
  const currentParams = useMemo(() => ({ page: currentPage, limit: currentLimit }), [currentPage, currentLimit]);

  useEffect(() => {
    // Check if we need to fetch:
    // 1. No data exists (logs.length === 0)
    // 2. Params changed (page or limit)
    // 3. No cache exists (lastFetchParams is null)
    const shouldFetch = 
      logs.length === 0 || 
      !paramsMatch(lastFetchParams, currentParams) ||
      lastFetchParams === null;

    if (shouldFetch) {
      dispatch(getActivityLogs(currentParams));
    }
  }, [dispatch, currentPage, currentLimit, logs.length, lastFetchParams, currentParams]);

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

