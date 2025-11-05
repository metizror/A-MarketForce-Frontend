"use client";

import { useState } from "react";
import { CompaniesTable } from "@/components/CompaniesTable";
import { useAppSelector } from "@/store/hooks";
import type { Company, User } from "@/types/dashboard.types";

export default function CompaniesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [companies, setCompanies] = useState([] as Company[]);
  const [filters] = useState({});

  const dashboardUser: User | null = user ? {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
    role: user.role || null,
  } : null;

  if (!dashboardUser) return null;

  return (
    <CompaniesTable 
      companies={companies} 
      setCompanies={setCompanies} 
      user={dashboardUser} 
      filters={filters} 
    />
  );
}

