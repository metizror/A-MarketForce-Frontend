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
  const { contacts, pagination, isLoading, error } = useAppSelector((state) => state.contacts);
  const [companies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<GetContactsParams>({
    page: 1,
    limit: 25,
  });
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

  // Track previous filters to avoid duplicate API calls
  const prevFiltersRef = useRef<GetContactsParams | null>(null);
  const prevSearchRef = useRef<string>('');

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

    // Check if filters have actually changed
    const filtersChanged = JSON.stringify(fetchParams) !== JSON.stringify(prevFiltersRef.current);
    
    if (filtersChanged) {
      prevFiltersRef.current = fetchParams;
      prevSearchRef.current = debouncedSearchQuery;
      dispatch(getContacts(fetchParams));
    }
  }, [dispatch, filters, debouncedSearchQuery]);

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

