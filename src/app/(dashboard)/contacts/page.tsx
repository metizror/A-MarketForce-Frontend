"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ContactsTable } from "@/components/ContactsTable";
import { FilterPanel } from "@/components/FilterPanel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getContacts, type GetContactsParams } from "@/store/slices/contacts.slice";
import type { Company, User, Contact } from "@/types/dashboard.types";

export default function ContactsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [companies] = useState([] as Company[]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
  } as GetContactsParams);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const dashboardUser: User | null = user ? {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
    role: user.role || null,
  } : null;

  // Debounce search query with 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset page to 1 when search changes
      if (searchQuery !== debouncedSearchQuery) {
        setFilters((prev: GetContactsParams) => ({ ...prev, page: 1 }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const { contacts, pagination, isLoading, error, lastFetchParams } = useAppSelector((state) => state.contacts);

  // Helper function to check if params match
  const paramsMatch = (params1: GetContactsParams | null, params2: GetContactsParams): boolean => {
    if (!params1) return false;
    const keys = new Set([...Object.keys(params1), ...Object.keys(params2)]);
    for (const key of keys) {
      if (params1[key as keyof GetContactsParams] !== params2[key as keyof GetContactsParams]) {
        return false;
      }
    }
    return true;
  };

  // Fetch contacts when filters or debounced search change
  // Note: Filters are only applied when "Apply Filters" is clicked, but pagination/search work immediately
  useEffect(() => {
    // Clean empty values before API call
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        // Keep page and limit, remove empty strings
        if (typeof value === 'number') return true;
        return value !== '' && value !== null && value !== undefined;
      })
    ) as GetContactsParams;
    
    const fetchParams: GetContactsParams = {
      ...cleanedFilters,
      search: debouncedSearchQuery || undefined,
    };

    // Check if we need to fetch:
    // 1. No data exists AND we've never fetched before (contacts.length === 0 && lastFetchParams === null)
    // 2. OR params changed (filters or search changed)
    // This prevents infinite loops when all contacts are deleted
    // Note: We check contacts.length inside the effect but don't include it in deps to prevent loops
    const shouldFetch = 
      (contacts.length === 0 && lastFetchParams === null) || 
      !paramsMatch(lastFetchParams, fetchParams);
    
    if (shouldFetch) {
      dispatch(getContacts(fetchParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filters, debouncedSearchQuery, lastFetchParams]);

  // Handle page change
  const handlePageChange = (page: number) => {
    // Only update if page actually changed
    if (filters.page !== page) {
      setFilters((prev: GetContactsParams) => ({ ...prev, page }));
    }
  };

  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setFilters((prev: GetContactsParams) => ({ ...prev, limit, page: 1 }));
  };

  // Handle search change (immediate update for input, debounced for API)
  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    // Don't reset page here, let debounced search handle it
  };

  // Handle filter change from FilterPanel (called when Apply Filters is clicked)
  const handleFilterChange = (newFilters: Partial<GetContactsParams>) => {
    // If all filter values are undefined, it means Clear All was clicked
    const hasOnlyDefaults = Object.keys(newFilters).every(key => {
      const value = newFilters[key as keyof GetContactsParams];
      return key === 'page' || key === 'limit' || value === undefined || value === null || value === '';
    });
    
    if (hasOnlyDefaults && Object.keys(newFilters).length > 2) {
      // Clear All was clicked - reset to default state
      setFilters({
        page: 1,
        limit: 25,
      });
    } else {
      // Apply filters - merge with existing filters
      setFilters((prev: GetContactsParams) => {
        const updated = { ...prev, ...newFilters, page: 1 };
        // Remove undefined values
        Object.keys(updated).forEach(key => {
          if (updated[key as keyof GetContactsParams] === undefined) {
            delete updated[key as keyof GetContactsParams];
          }
        });
        return updated;
      });
    }
  };

  if (!dashboardUser) return null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {showFilters && (
        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden h-full p-6`}>
        <ContactsTable 
          contacts={contacts}
          user={dashboardUser} 
          companies={companies} 
          filters={filters}
          searchQuery={searchQuery}
          pagination={pagination}
          isLoading={isLoading}
          error={error}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onViewContact={(contact: Contact) => {
            // Navigate to contact detail page
            // Handle both _id and id fields for compatibility
            const contactId = contact.id || (contact as any)._id;
            if (contactId) {
              router.push(`/contacts/${contactId}`);
            } else {
              console.error('Contact ID is missing:', contact);
            }
          }}
        />
      </div>
    </div>
  );
}

