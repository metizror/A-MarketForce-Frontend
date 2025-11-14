"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { ImportDataModule } from "@/components/ImportDataModule";
import { ActivityLogsPanel } from "@/components/ActivityLogsPanel";
import { useAppSelector } from "@/store/hooks";
import { privateApiCall } from "@/lib/api";
import type { Contact, Company, ActivityLog } from "@/types/dashboard.types";

interface DashboardData {
  totalContacts: number;
  totalCompanies: number;
  totalUsers?: number; // Optional, not returned by admin-dashboard
  lastImportDate: string | null;
  activityLogs: ActivityLog[];
}

interface AdminDashboardData {
  addedContacts: number;
  addedCompanies: number;
  lastImportContact: {
    createdAt?: string;
  } | null;
  activityLogs: any[];
}

interface DashboardCache {
  contactsCount: number;
  companiesCount: number;
  adminUsersCount: number;
  lastImportDate: string | null;
  activityLogs: ActivityLog[];
  timestamp: number;
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  
  const [contactsCount, setContactsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [adminUsersCount, setAdminUsersCount] = useState(0);
  const [lastImportDate, setLastImportDate] = useState(null as string | null);
  const [activityLogs, setActivityLogs] = useState([] as ActivityLog[]);
  
  // Single loading state for all dashboard data
  const [isLoading, setIsLoading] = useState(true);

  const role = user?.role || null;
  const hasFetchedDashboard = useRef(false);
  const isFetching = useRef(false);
  const dashboardDataCache = useRef(null as DashboardCache | null);

  // Cache duration: 5 minutes (300000 ms)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Fetch all dashboard data from single API endpoint (only once)
  useEffect(() => {
    // Early return if no role
    if (!role || (role !== "admin" && role !== "superadmin")) {
      setIsLoading(false);
      return;
    }

    // Check if cached data exists and is still valid
    const now = Date.now();
    const cacheValid = dashboardDataCache.current && 
                      (now - dashboardDataCache.current.timestamp) < CACHE_DURATION;

    // Use cached data if valid and already fetched
    if (cacheValid && hasFetchedDashboard.current) {
      setContactsCount(dashboardDataCache.current.contactsCount);
      setCompaniesCount(dashboardDataCache.current.companiesCount);
      setAdminUsersCount(dashboardDataCache.current.adminUsersCount);
      setLastImportDate(dashboardDataCache.current.lastImportDate);
      setActivityLogs(dashboardDataCache.current.activityLogs);
      setIsLoading(false);
      return;
    }

    // Prevent duplicate calls if already fetching or already fetched with valid cache
    if (isFetching.current) {
      // If already fetching, don't start another call but ensure loading state is set
      if (!isLoading) {
        setIsLoading(true);
      }
      return;
    }
    
    if (hasFetchedDashboard.current && cacheValid) {
      return;
    }

    // Mark as fetching immediately to prevent duplicate calls
    isFetching.current = true;
    setIsLoading(true);
    
    // Use different endpoints based on role
    const apiEndpoint = role === "admin" ? "/admin/admin-dashboard" : "/admin/dashboard";
    
    if (role === "admin") {
      // Call admin-dashboard API and map response
      privateApiCall<AdminDashboardData>(apiEndpoint)
          .then((response) => {
            const data = {
              contactsCount: response.addedContacts || 0,
              companiesCount: response.addedCompanies || 0,
              adminUsersCount: 0,
              lastImportDate: response.lastImportContact?.createdAt 
                ? new Date(response.lastImportContact.createdAt).toISOString()
                : null,
              activityLogs: (response.activityLogs || []).map((log: any) => ({
                id: log._id?.toString() || log.id,
                action: log.action,
                description: log.details || log.description || log.action,
                details: log.details || log.description || log.action,
                userId: log.userId?.toString() || log.userId,
                userName: log.user || log.userName || "Unknown",
                user: log.user || log.userName || "Unknown",
                createdBy: log.user || log.userName || "Unknown",
                timestamp: log.createdAt || log.timestamp,
                createdAt: log.createdAt,
                updatedAt: log.updatedAt,
              })),
              timestamp: now,
            };
            
            // Update all state and cache
            dashboardDataCache.current = data;
            setContactsCount(data.contactsCount);
            setCompaniesCount(data.companiesCount);
            setAdminUsersCount(data.adminUsersCount);
            setLastImportDate(data.lastImportDate);
            setActivityLogs(data.activityLogs);
            setIsLoading(false);
            isFetching.current = false;
            hasFetchedDashboard.current = true; // Mark as fetched only after successful API call
          })
          .catch((error) => {
            console.error("Failed to fetch admin dashboard data:", error);
            setIsLoading(false);
            isFetching.current = false;
            hasFetchedDashboard.current = false; // Keep as false on error to allow retry
            dashboardDataCache.current = null; // Clear cache on error
          });
    } else {
      // Call superadmin dashboard API
      privateApiCall<DashboardData>(apiEndpoint)
        .then((response) => {
          const data = {
            contactsCount: response.totalContacts || 0,
            companiesCount: response.totalCompanies || 0,
            adminUsersCount: response.totalUsers || 0,
            lastImportDate: response.lastImportDate || null,
            activityLogs: response.activityLogs || [],
            timestamp: now,
          };
          
          // Update all state and cache
          dashboardDataCache.current = data;
          setContactsCount(data.contactsCount);
          setCompaniesCount(data.companiesCount);
          setAdminUsersCount(data.adminUsersCount);
          setLastImportDate(data.lastImportDate);
          setActivityLogs(data.activityLogs);
          setIsLoading(false);
          isFetching.current = false;
          hasFetchedDashboard.current = true; // Mark as fetched only after successful API call
        })
        .catch((error) => {
          console.error("Failed to fetch dashboard data:", error);
          setIsLoading(false);
          isFetching.current = false;
          hasFetchedDashboard.current = false; // Keep as false on error to allow retry
          dashboardDataCache.current = null; // Clear cache on error
        });
    }
  }, [role]);

  // Create mock arrays with correct length for DashboardStats component
  // The component uses .length, so we create arrays with the count length
  const contacts = Array(contactsCount).fill(null) as Contact[];
  const companies = Array(companiesCount).fill(null) as Company[];
  const users = Array(adminUsersCount).fill(null) as any[];

  return (
    <div className="space-y-6">
      <DashboardStats 
        contacts={contacts}
        companies={companies}
        users={users}
        role={role === "superadmin" ? "superadmin" : "admin"}
        adminUsersCount={adminUsersCount}
        lastImportDate={lastImportDate}
        isLoading={{
          contacts: isLoading,
          companies: isLoading,
          users: isLoading,
          importDate: isLoading
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {role === "superadmin" && (
          <ImportDataModule 
            onImportComplete={(newContacts, newCompanies) => {
              // Handle import complete - can be connected to state management later
              console.log("Import complete", { newContacts, newCompanies });
              // Invalidate cache and refetch
              hasFetchedDashboard.current = false;
              dashboardDataCache.current = null;
              // Refresh dashboard data after import
              privateApiCall<DashboardData>("/admin/dashboard")
                .then((response) => {
                  const now = Date.now();
                  const data = {
                    contactsCount: response.totalContacts || 0,
                    companiesCount: response.totalCompanies || 0,
                    adminUsersCount: response.totalUsers || 0,
                    lastImportDate: response.lastImportDate || null,
                    activityLogs: response.activityLogs || [],
                    timestamp: now,
                  };
                  dashboardDataCache.current = data;
                  setContactsCount(data.contactsCount);
                  setCompaniesCount(data.companiesCount);
                  setAdminUsersCount(data.adminUsersCount);
                  setLastImportDate(data.lastImportDate);
                  setActivityLogs(data.activityLogs);
                })
                .catch((error) => {
                  console.error("Failed to refresh dashboard data:", error);
                });
            }}
          />
        )}
        {role !== "superadmin" && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a 
                href="/contacts"
                className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Manage Contacts
              </a>
              <a 
                href="/companies"
                className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Manage Companies
              </a>
            </div>
          </div>
        )}
        <ActivityLogsPanel 
          logs={activityLogs} 
          pagination={null}
          isLoading={isLoading} 
          isFullScreen={false}
        />
      </div>
    </div>
  );
}

