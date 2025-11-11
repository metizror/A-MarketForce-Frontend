"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { ImportDataModule } from "@/components/ImportDataModule";
import { ActivityLogsPanel } from "@/components/ActivityLogsPanel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getContacts } from "@/store/slices/contacts.slice";
import { getCompanies } from "@/store/slices/companies.slice";
import { getApproveRequests } from "@/store/slices/approveRequests.slice";
import { getAdminUsers } from "@/store/slices/adminUsers.slice";
import { getActivityLogs } from "@/store/slices/activityLogs.slice";
import { privateApiCall } from "@/lib/api";
import type { Contact, Company } from "@/types/dashboard.types";

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
  const [adminUsersCount, setAdminUsersCount] = useState(0);
  const [lastImportDate, setLastImportDate] = useState<string | null>(null);
  
  // Loading states
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingImportDate, setIsLoadingImportDate] = useState(true);
  
  const { pagination: adminUsersPagination } = useAppSelector((state) => state.adminUsers);
  const { logs: activityLogs, isLoading: isLoadingActivityLogs } = useAppSelector((state) => state.activityLogs);

  const role = user?.role || null;

  // Fetch counts on component mount
  useEffect(() => {
    // Only fetch admin-only data if user is admin or superadmin
    if (role === "admin" || role === "superadmin") {
      // Fetch contacts count
      setIsLoadingContacts(true);
      dispatch(getContacts({ page: 1, limit: 1 })).then((result) => {
        if (getContacts.fulfilled.match(result)) {
          setContactsCount(result.payload.pagination.totalCount);
        }
        setIsLoadingContacts(false);
      }).catch(() => {
        setIsLoadingContacts(false);
      });

      // Fetch companies count
      setIsLoadingCompanies(true);
      dispatch(getCompanies({ page: 1, limit: 1 })).then((result) => {
        if (getCompanies.fulfilled.match(result)) {
          setCompaniesCount(result.payload.pagination.totalCount);
        }
        setIsLoadingCompanies(false);
      }).catch(() => {
        setIsLoadingCompanies(false);
      });

      // Fetch approve requests to get stats
      dispatch(getApproveRequests({ page: 1, limit: 25 }));

      // Fetch activity logs
      dispatch(getActivityLogs({ page: 1, limit: 5 }));
    } else {
      // For customers, set loading to false immediately
      setIsLoadingContacts(false);
      setIsLoadingCompanies(false);
    }

    // Fetch admin users count from getUser API (if superadmin)
    if (role === "superadmin") {
      setIsLoadingUsers(true);
      privateApiCall("/auth/create-admin?page=1&limit=25")
        .then((response: any) => {
          if (response && response.totalAdmins !== undefined) {
            setAdminUsersCount(response.totalAdmins);
          }
          setIsLoadingUsers(false);
        })
        .catch((error) => {
          console.error("Failed to fetch admin users count:", error);
          // Fallback to Redux if direct API call fails
          dispatch(getAdminUsers({ page: 1, limit: 25 })).then((result) => {
            if (getAdminUsers.fulfilled.match(result)) {
              setAdminUsersCount(result.payload.totalAdmins);
            }
            setIsLoadingUsers(false);
          }).catch(() => {
            setIsLoadingUsers(false);
          });
        });
    } else {
      setIsLoadingUsers(false);
    }
    
    // Fetch last import date (most recent contact's addedDate)
    if (role === "superadmin") {
      setIsLoadingImportDate(true);
      privateApiCall("/admin/contacts?page=1&limit=25&sortBy=addedDate&sortOrder=desc")
        .then((response: any) => {
          if (response && response.contacts && response.contacts.length > 0) {
            // Use addedDate or createdAt if available
            const contact = response.contacts[0];
            setLastImportDate(contact.createdAt || contact.addedDate || null);
          }
          setIsLoadingImportDate(false);
        })
        .catch((error) => {
          // If that endpoint doesn't work, try getting contacts and find the most recent
          dispatch(getContacts({ page: 1, limit: 100 })).then((result) => {
            if (getContacts.fulfilled.match(result) && result.payload.contacts && result.payload.contacts.length > 0) {
              // Find the most recent contact by addedDate
              const sortedContacts = [...result.payload.contacts].sort((a: Contact, b: Contact) => {
                const dateA = new Date(a.addedDate || a.updatedDate || 0).getTime();
                const dateB = new Date(b.addedDate || b.updatedDate || 0).getTime();
                return dateB - dateA;
              });
              if (sortedContacts[0]?.addedDate) {
                setLastImportDate(sortedContacts[0].addedDate);
              }
            }
            setIsLoadingImportDate(false);
          }).catch(() => {
            setIsLoadingImportDate(false);
          });
        });
    } else {
      setIsLoadingImportDate(false);
    }
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

  useEffect(() => {
    if (adminUsersPagination) {
      setAdminUsersCount(adminUsersPagination.totalCount);
    }
  }, [adminUsersPagination]);

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
          contacts: isLoadingContacts,
          companies: isLoadingCompanies,
          users: isLoadingUsers,
          importDate: isLoadingImportDate
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
          isLoading={isLoadingActivityLogs} 
          isFullScreen={false}
        />
      </div>
    </div>
  );
}

