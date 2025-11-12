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
  totalUsers: number;
  lastImportDate: string | null;
  activityLogs: ActivityLog[];
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

  // Fetch all dashboard data from single API endpoint (only once)
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetchedDashboard.current) {
      return;
    }

    if (role === "admin" || role === "superadmin") {
      setIsLoading(true);
      hasFetchedDashboard.current = true;
      
      // Fetch all dashboard data from single endpoint
      privateApiCall<DashboardData>("/admin/dashboard")
        .then((response) => {
          setContactsCount(response.totalContacts || 0);
          setCompaniesCount(response.totalCompanies || 0);
          setAdminUsersCount(response.totalUsers || 0);
          setLastImportDate(response.lastImportDate || null);
          setActivityLogs(response.activityLogs || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch dashboard data:", error);
          setIsLoading(false);
          hasFetchedDashboard.current = false; // Reset on error to allow retry
        });
    } else {
      // For customers, set loading to false immediately
      setIsLoading(false);
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
              // Update last import date to current date
              setLastImportDate(new Date().toISOString());
              // Refresh dashboard data after import
              privateApiCall<DashboardData>("/admin/dashboard")
                .then((response) => {
                  setContactsCount(response.totalContacts || 0);
                  setCompaniesCount(response.totalCompanies || 0);
                  setLastImportDate(response.lastImportDate || null);
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

