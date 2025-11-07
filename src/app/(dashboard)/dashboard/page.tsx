"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { ImportDataModule } from "@/components/ImportDataModule";
import { ActivityLogsPanel } from "@/components/ActivityLogsPanel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getContacts } from "@/store/slices/contacts.slice";
import { getCompanies } from "@/store/slices/companies.slice";
import { getApproveRequests } from "@/store/slices/approveRequests.slice";
import { privateApiCall } from "@/lib/api";
import type { Contact, Company, ActivityLog } from "@/types/dashboard.types";

interface UsersResponse {
  users: any[];
  pagination: {
    totalCount: number;
  };
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { pagination: contactsPagination } = useAppSelector((state) => state.contacts);
  const { pagination: companiesPagination } = useAppSelector((state) => state.companies);
  const { stats: approveRequestsStats } = useAppSelector((state) => state.approveRequests);
  
  const [contactsCount, setContactsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [activityLogs] = useState([] as ActivityLog[]);

  const role = user?.role || null;

  // Fetch counts on component mount
  useEffect(() => {
    // Fetch contacts count
    dispatch(getContacts({ page: 1, limit: 1 })).then((result) => {
      if (getContacts.fulfilled.match(result)) {
        setContactsCount(result.payload.pagination.totalCount);
      }
    });

    // Fetch companies count
    dispatch(getCompanies({ page: 1, limit: 1 })).then((result) => {
      if (getCompanies.fulfilled.match(result)) {
        setCompaniesCount(result.payload.pagination.totalCount);
      }
    });

    // Fetch users count (if superadmin)
    // Note: Users API endpoint may not exist, so we handle it gracefully
    if (role === "superadmin") {
      // Try to fetch users count, but handle gracefully if endpoint doesn't exist
      privateApiCall<UsersResponse>("/admin/users?page=1&limit=1")
        .then((response) => {
          if (response && response.pagination) {
            setUsersCount(response.pagination.totalCount);
          }
        })
        .catch((error) => {
          // Silently fail - users count will remain 0
          console.log("Users API endpoint not available, using default count");
        });
    }

    // Fetch approve requests to get stats
    dispatch(getApproveRequests({ page: 1, limit: 1 }));
  }, [dispatch, role]);

  // Update counts from Redux state if available
  useEffect(() => {
    if (contactsPagination) {
      setContactsCount(contactsPagination.totalCount);
    }
  }, [contactsPagination]);

  useEffect(() => {
    if (companiesPagination) {
      setCompaniesCount(companiesPagination.totalCount);
    }
  }, [companiesPagination]);

  // Create mock arrays with correct length for DashboardStats component
  // The component uses .length, so we create arrays with the count length
  const contacts = Array(contactsCount).fill(null) as Contact[];
  const companies = Array(companiesCount).fill(null) as Company[];
  const users = Array(usersCount).fill(null) as any[];

  return (
    <div className="space-y-6">
      <DashboardStats 
        contacts={contacts}
        companies={companies}
        users={users}
        role={role === "superadmin" ? "superadmin" : "admin"}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {role === "superadmin" && (
          <ImportDataModule 
            onImportComplete={(newContacts, newCompanies) => {
              // Handle import complete - can be connected to state management later
              console.log("Import complete", { newContacts, newCompanies });
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
        <ActivityLogsPanel logs={activityLogs.slice(0, 5)} />
      </div>
    </div>
  );
}

