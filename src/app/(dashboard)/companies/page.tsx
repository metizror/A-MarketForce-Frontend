"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CompaniesTable } from "@/components/CompaniesTable";
import { CompanyFilterPanel } from "@/components/CompanyFilterPanel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getCompanies, type GetCompaniesParams } from "@/store/slices/companies.slice";
import type { User, Company } from "@/types/dashboard.types";

export default function CompaniesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
  } as GetCompaniesParams);
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
        setFilters((prev: GetCompaniesParams) => ({ ...prev, page: 1 }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const { companies, pagination, isLoading, error, lastFetchParams } = useAppSelector((state) => state.companies);

  // Helper function to check if params match
  const paramsMatch = (params1: GetCompaniesParams | null, params2: GetCompaniesParams): boolean => {
    if (!params1) return false;
    const keys = new Set([...Object.keys(params1), ...Object.keys(params2)]);
    for (const key of keys) {
      if (params1[key as keyof GetCompaniesParams] !== params2[key as keyof GetCompaniesParams]) {
        return false;
      }
    }
    return true;
  };

  // Fetch companies when filters or debounced search change
  useEffect(() => {
    // Clean empty values before API call
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        // Keep page and limit, remove empty strings
        if (typeof value === 'number') return true;
        return value !== '' && value !== null && value !== undefined;
      })
    ) as GetCompaniesParams;
    
    const fetchParams: GetCompaniesParams = {
      ...cleanedFilters,
      search: debouncedSearchQuery || undefined,
    };

    // Check if we need to fetch:
    // 1. No data exists (companies.length === 0)
    // 2. Params changed (filters or search)
    // 3. No cache exists (lastFetchParams is null)
    const shouldFetch = 
      companies.length === 0 || 
      !paramsMatch(lastFetchParams, fetchParams) ||
      lastFetchParams === null;
    
    if (shouldFetch) {
      dispatch(getCompanies(fetchParams));
    }
  }, [dispatch, filters, debouncedSearchQuery, companies.length, lastFetchParams]);

  // Handle page change
  const handlePageChange = (page: number) => {
    // Only update if page actually changed
    if (filters.page !== page) {
      setFilters((prev: GetCompaniesParams) => ({ ...prev, page }));
    }
  };

  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setFilters((prev: GetCompaniesParams) => ({ ...prev, limit, page: 1 }));
  };

  // Handle search change (immediate update for input, debounced for API)
  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    // Don't reset page here, let debounced search handle it
  };

  // Handle filter change from FilterPanel (called when Apply Filters is clicked)
  const handleFilterChange = (newFilters: Partial<GetCompaniesParams>) => {
    // If all filter values are undefined, it means Clear All was clicked
    const hasOnlyDefaults = Object.keys(newFilters).every(key => {
      const value = newFilters[key as keyof GetCompaniesParams];
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
      setFilters((prev: GetCompaniesParams) => {
        const updated = { ...prev, ...newFilters, page: 1 };
        // Remove undefined values
        Object.keys(updated).forEach(key => {
          if (updated[key as keyof GetCompaniesParams] === undefined) {
            delete updated[key as keyof GetCompaniesParams];
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
        <CompanyFilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden h-full p-6`}>
        <CompaniesTable 
          companies={companies}
          user={dashboardUser} 
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
          onViewCompany={(company: Company) => {
            // Navigate to company detail page
            // Handle both _id and id fields for compatibility
            const companyId = company.id || (company as any)._id;
            if (companyId) {
              router.push(`/companies/${companyId}`);
            } else {
              console.error('Company ID is missing:', company);
            }
          }}
        />
      </div>
    </div>
  );
}

