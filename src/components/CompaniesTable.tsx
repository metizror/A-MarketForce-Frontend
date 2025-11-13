import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { Plus, Edit, Trash2, Download, Search, Eye, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown, MoreVertical, Building2, Filter } from 'lucide-react';
import { Company, User } from '@/types/dashboard.types';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCompany, updateCompany, deleteCompanies, getCompanies, type GetCompaniesParams } from '@/store/slices/companies.slice';

interface CompaniesTableProps {
  companies: Company[];
  user: User;
  filters?: any;
  searchQuery?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  isLoading?: boolean;
  error?: string | null;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: any) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onViewCompany?: (company: Company) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

type SortField = keyof Company;
type SortDirection = 'asc' | 'desc';

// Helper function to get avatar color based on company name
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Helper function to get initials
const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

// Industry and Sub-Industry mapping (same as ContactsTable)
const industrySubIndustryMap: Record<string, string[]> = {
  "Agriculture, Forestry and Fishing": [
    "Commercial Fishing",
    "Crop and Animal Production",
    "Forestry and Logging"
  ],
  "Aerospace and Defense": [
    "Aircraft Engine and Parts Manufacturing",
    "Aircraft Manufacturing",
    "Guided Missile and Space Vehicle Manufacturing",
    "Space Research and Technology",
    "Weapons and Ammunition Manufacturing"
  ],
  "Automotive, Transportation and Logistics": [
    "Air Transportation Services",
    "Airlines",
    "Mass Transit and Ground Passenger Transportation",
    "Miscellaneous Transportation Equipment Manufacturing",
    "Miscellaneous Transportation Services",
    "Motor Vehicle and Parts Dealers",
    "Motor Vehicle Manufacturing",
    "Motor Vehicle Parts Manufacturing",
    "Motor Vehicle Rental",
    "Motor Vehicle Repair and Maintenance",
    "Motor Vehicle Wholesale",
    "Pipeline Transportation",
    "Postal, Shipping and Messengers",
    "Railroad Transport",
    "Railroad Transportation Services",
    "Road Transportation Services",
    "Ship and Boat Building",
    "Shipping and Water Transport",
    "Shipping and Water Transportation Services",
    "Storage and Warehousing",
    "Train and Railroad Equipment Manufacturing",
    "Transportation Equipment Wholesale",
    "Trucking"
  ],
  "Banking and Finance": [
    "Banking",
    "Commodities",
    "Exchanges",
    "Holding Companies",
    "Investment Banking",
    "Investment Services",
    "Mortgage and Credit",
    "Securities"
  ],
  "Business, Consulting and Professional Services": [
    "Administrative Services",
    "Advertising Services",
    "Associations and Organizations",
    "Building and Dwelling Services",
    "Business Support Services",
    "Commercial Real Estate Leasing",
    "Consulting Services",
    "Employment Services",
    "Facilities Management",
    "Market Research and Opinion Polling",
    "Miscellaneous Professional Services",
    "Photographic Services",
    "Research and Development Services",
    "Accounting and Tax Preparation",
    "Architecture and Engineering",
    "Investigation and Security Services",
    "Legal Services",
    "Specialized Design Services",
    "Marketing Services",
    "Industrial Machinery Repair and Maintenance",
    "Miscellaneous Repair and Maintenance",
    "Computer and Office Machine Repair and Maintenance"
  ],
  "Chemicals": [
    "Agricultural Chemical Manufacturing",
    "Basic Chemical Manufacturing",
    "Chemical Wholesale",
    "Miscellaneous Chemical Manufacturing",
    "Paint, Coating, and Adhesive Manufacturing",
    "Synthetic Chemical Manufacturing"
  ],
  "Construction and Building Materials": [
    "Cement and Concrete Product Manufacturing",
    "Civil Engineering",
    "Construction and Hardware Materials Wholesale",
    "Construction Machinery Manufacturing",
    "Residential and Commercial Building Construction",
    "Specialty Construction Trade Contractors"
  ],
  "Consumer Services": [
    "Consumer Goods Rental",
    "Death Care Services",
    "Fitness and Recreation Centers",
    "Laundry Services",
    "Miscellaneous Personal Services",
    "Personal Care Services",
    "Photofinishing",
    "Residential Real Estate Leasing"
  ],
  "Education": [
    "Child Day Care Services",
    "Colleges and Universities",
    "Miscellaneous Educational Services",
    "Primary and Secondary Education",
    "Professional and Management Training"
  ],
  "Electronics": [
    "Appliance Repair and Maintenance",
    "Audio and Video Equipment Manufacturing",
    "Consumer Electronics Repair and Maintenance",
    "Electrical Equipment and Appliances Manufacturing",
    "Electromedical and Control Instruments Manufacturing",
    "Electronic Equipment Repair and Maintenance",
    "Electronics and Appliances Stores",
    "Electronics Wholesale",
    "Magnetic and Optical Media Manufacturing",
    "Semiconductor and Other Electronic Component Manufacturing"
  ],
  "Entertainment, Travel and Leisure": [
    "Airlines",
    "Fitness and Recreation Centers",
    "Gambling and Casinos",
    "Golf Courses and Country Clubs",
    "Hotels and Accommodation",
    "Miscellaneous Amusement and Recreation",
    "Museums and Historical Sites",
    "Performing Arts",
    "Promoters and Agents",
    "Restaurants and Bars",
    "Spectator Sports",
    "Sporting Goods and Recreation Stores",
    "Travel and Reservation Services"
  ],
  "Food and Beverage": [
    "Alcoholic Beverage Wholesale",
    "Beer, Wine, and Liquor Stores",
    "Beverage Manufacturing",
    "Commercial Fishing",
    "Crop and Animal Production",
    "Food Manufacturing",
    "Grocery Stores",
    "Grocery Wholesale",
    "Restaurants and Bars"
  ],
  "Healthcare, Biotechnology and Pharmaceuticals": [
    "Ambulatory Services",
    "Dentists",
    "Diagnostic Laboratories",
    "Fitness and Recreation Centers",
    "Health and Personal Care Wholesale",
    "Home Health Care Services",
    "Hospitals",
    "Medical Equipment and Supplies",
    "Nursing and Residential Care",
    "Outpatient Care",
    "Pharmaceutical Manufacturing",
    "Pharmacies and Personal Care Stores",
    "Physicians and Health Practitioners",
    "Social and Rehabilitation Services"
  ],
  "High Tech": [
    "Communications Equipment Manufacturing",
    "Computer and Peripheral Equipment Manufacturing",
    "Computer Programming",
    "Computer System Design Services",
    "Data Processing",
    "Electrical Equipment and Appliances Manufacturing",
    "Electromedical and Control Instruments Manufacturing",
    "Software",
    "Internet and Web Services",
    "Managed Service Providers (MSPs)"
  ],
  "Insurance": [
    "Insurance Agents",
    "Insurance Services",
    "Life and Health Insurance",
    "Pensions and Funds",
    "Property and Casualty Insurance"
  ],
  "Manufacturing": [
    "Agricultural Chemical Manufacturing",
    "Aircraft Engine and Parts Manufacturing",
    "Aircraft Manufacturing",
    "Audio and Video Equipment Manufacturing",
    "Basic Chemical Manufacturing",
    "Beverage Manufacturing",
    "Cement and Concrete Product Manufacturing",
    "Clothing and Apparel Manufacturing",
    "Communications Equipment Manufacturing",
    "Computer and Peripheral Equipment Manufacturing",
    "Construction Machinery Manufacturing",
    "Electrical Equipment and Appliances Manufacturing",
    "Electromedical and Control Instruments Manufacturing",
    "Food Manufacturing",
    "Furniture Manufacturing",
    "Guided Missile and Space Vehicle Manufacturing",
    "Machinery and Equipment Manufacturing",
    "Magnetic and Optical Media Manufacturing",
    "Metal Products Manufacturing",
    "Miscellaneous Chemical Manufacturing",
    "Miscellaneous Manufacturing",
    "Miscellaneous Transportation Equipment Manufacturing",
    "Motor Vehicle Manufacturing",
    "Motor Vehicle Parts Manufacturing",
    "NonMetallic Mineral Product Manufacturing",
    "Paint, Coating, and Adhesive Manufacturing",
    "Paper Product Manufacturing",
    "Petroleum Product Manufacturing",
    "Pharmaceutical Manufacturing",
    "Rubber and Plastic Product Manufacturing",
    "Semiconductor and Other Electronic Component Manufacturing",
    "Ship and Boat Building",
    "Synthetic Chemical Manufacturing",
    "Textile Manufacturing",
    "Tobacco Production",
    "Train and Railroad Equipment Manufacturing",
    "Weapons and Ammunition Manufacturing",
    "Wood Product Manufacturing"
  ],
  "Mining, Quarrying and Drilling": [
    "Coal Mining",
    "Metals Mining",
    "NonMetallic Minerals Mining",
    "Petroleum and Natural Gas Extraction",
    "Support Activities for Mining"
  ],
  "Non-Profit": [
    "Non-profit Organisations"
  ],
  "Government Administration": [
    "Administration of Public Programs",
    "Courts, Justice and Public Safety",
    "Executive and Legislature",
    "National Security and International Affairs",
    "Space Research and Technology",
    "Local Authorities (Cities, Counties, States)"
  ],
  "Real Estate": [
    "Commercial Real Estate Leasing",
    "Property Managers",
    "Real Estate Agents and Brokers",
    "Real Estate Services",
    "Residential Real Estate Leasing"
  ],
  "Rental and Leasing": [
    "Commercial and Industrial Rental",
    "Commercial Real Estate Leasing",
    "Consumer Goods Rental",
    "Miscellaneous Rental",
    "Motor Vehicle Rental",
    "Residential Real Estate Leasing"
  ],
  "Retail": [
    "Beer, Wine, and Liquor Stores",
    "Clothing and Apparel Stores",
    "Department Stores",
    "Electronics and Appliances Stores",
    "Gasoline Stations and Fuel Dealers",
    "Grocery Stores",
    "Home and Garden Retail",
    "Home Furnishings Retail",
    "Miscellaneous Store Retailers",
    "Motor Vehicle and Parts Dealers",
    "Nonstore Retail",
    "Pharmacies and Personal Care Stores",
    "Sporting Goods and Recreation Stores",
    "Convenience Store",
    "eCommerce"
  ],
  "Telecommunications and Publishing": [
    "Broadcasting and Media",
    "Cable and Other Program Distribution",
    "Communication Equipment Repair and Maintenance",
    "Communications Equipment Manufacturing",
    "Internet and Web Services",
    "Miscellaneous Information Services",
    "Miscellaneous Telecommunication Services",
    "Movies",
    "Publishing",
    "Telecommunications Resellers",
    "Wired Telecommunications Carriers",
    "Wireless Telecommunications Carriers",
    "Music",
    "Printing"
  ],
  "Utilities and Energy": [
    "Electricity Generation and Distribution",
    "Natural Gas Distribution",
    "Waste Management",
    "Water and Sewage Services",
    "Renweable Energy Services",
    "Petroleum and Natural Gas Extraction"
  ],
  "Wholesale": [
    "Alcoholic Beverage Wholesale",
    "Chemical Wholesale",
    "Clothing and Apparel Wholesale",
    "Computer, Office Equipment and Software Merchant Wholesalers",
    "Construction and Hardware Materials Wholesale",
    "Electronics Wholesale",
    "Grocery Wholesale",
    "Health and Personal Care Wholesale",
    "Home Furnishings Wholesale",
    "Machinery Wholesale",
    "Metals and Minerals Wholesale",
    "Miscellaneous Wholesale",
    "Motor Vehicle Wholesale",
    "Paper Wholesale",
    "Petroleum Wholesale",
    "Professional and Commercial Equipment Wholesale",
    "Transportation Equipment Wholesale"
  ]
};

const industries = Object.keys(industrySubIndustryMap).map(industry => ({
  label: industry,
  value: industry,
}));

// Helper function to format revenue with $ sign
const formatRevenue = (revenue: string | undefined | null): string => {
  if (!revenue || revenue === '-') return '-';
  
  // If already has $ sign, return as is
  if (revenue.includes('$')) return revenue;
  
  // Map revenue values to formatted strings
  const revenueMap: { [key: string]: string } = {
    'Lessthan1M': 'Less than $1M',
    '1Mto5M': '$1M-$5M',
    '5Mto10M': '$5M-$10M',
    '10Mto50M': '$10M-$50M',
    '50Mto100M': '$50M-$100M',
    '100Mto250M': '$100M-$250M',
    '250Mto500M': '$250M-$500M',
    '500Mto1B': '$500M-$1B',
    'Morethan1B': 'More than $1B',
  };
  
  // Check if it's a known format
  if (revenueMap[revenue]) {
    return revenueMap[revenue];
  }
  
  // If it's in format like "1Mto5M" or "1M-5M", add $ signs
  const rangeMatch = revenue.match(/^(\d+(?:\.\d+)?[MB]?)to(\d+(?:\.\d+)?[MB]?)$/i) || revenue.match(/^(\d+(?:\.\d+)?[MB]?)-(\d+(?:\.\d+)?[MB]?)$/i);
  if (rangeMatch) {
    return `$${rangeMatch[1]}-$${rangeMatch[2]}`;
  }
  
  // If it starts with a number and M/B, add $ sign
  const singleMatch = revenue.match(/^(\d+(?:\.\d+)?)([MB])$/i);
  if (singleMatch) {
    return `$${singleMatch[1]}${singleMatch[2]}`;
  }
  
  // Default: return as is
  return revenue;
};

export function CompaniesTable({ 
  companies, 
  user, 
  filters = {}, 
  searchQuery = '',
  pagination = null,
  isLoading = false,
  error = null,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onLimitChange,
  onViewCompany,
  showFilters = false,
  onToggleFilters
}: CompaniesTableProps) {
  const dispatch = useAppDispatch();
  const { isCreating, isUpdating, isDeleting } = useAppSelector((state) => state.companies);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null as Company | null);
  const [selectedCompanies, setSelectedCompanies] = useState([] as string[]);
  const [sortField, setSortField] = useState('companyName' as SortField);
  const [sortDirection, setSortDirection] = useState('asc' as SortDirection);
  
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    revenue: '',
    employeeSize: '',
    industry: '',
    technology: '',
    companyLinkedInUrl: '',
    amfNotes: '',
    lastUpdateDate: new Date().toISOString().split('T')[0]
  });

  // Use pagination from API or default values
  const currentPage = pagination?.currentPage || 1;
  const rowsPerPage = pagination?.limit || 25;
  const totalPages = pagination?.totalPages || 1;
  const totalCount = pagination?.totalCount || 0;
  
  // Use companies directly from API (already filtered and paginated server-side)
  const displayedCompanies = companies;
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.limit : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Handle page navigation
  const handlePageNavigation = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Handle limit change
  const handleRowsPerPageChange = (value: string) => {
    const limit = parseInt(value, 10);
    if (onLimitChange) {
      onLimitChange(limit);
    }
  };

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    if (!phone || phone.trim() === '') return true; // Optional field
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    // Phone should have 10-15 digits (allowing international formats)
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const validateWebsite = (website: string): boolean => {
    if (!website || website.trim() === '') return true; // Optional field
    try {
      // Add protocol if missing
      let urlToValidate = website.trim();
      if (!urlToValidate.match(/^https?:\/\//i)) {
        urlToValidate = 'https://' + urlToValidate;
      }
      const url = new URL(urlToValidate);
      // Check if it's http or https
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.companyName) {
      toast.error('Please enter company name');
      return;
    }

    // Validate phone number
    if (newCompany.phone && !validatePhone(newCompany.phone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }

    // Validate website
    if (newCompany.website && !validateWebsite(newCompany.website)) {
      toast.error('Please enter a valid website URL (e.g., https://example.com)');
      return;
    }

    try {
      // Prepare payload for API
      const payload = {
        companyName: newCompany.companyName,
        phone: newCompany.phone || undefined,
        address1: newCompany.address1 || undefined,
        address2: newCompany.address2 || undefined,
        city: newCompany.city || undefined,
        state: newCompany.state || undefined,
        zipCode: newCompany.zipCode || undefined,
        country: newCompany.country || undefined,
        website: newCompany.website || undefined,
        revenue: newCompany.revenue || undefined,
        employeeSize: newCompany.employeeSize || undefined,
        industry: newCompany.industry || undefined,
        technology: newCompany.technology || undefined,
        companyLinkedInUrl: newCompany.companyLinkedInUrl || undefined,
        amfNotes: newCompany.amfNotes || undefined,
        lastUpdateDate: newCompany.lastUpdateDate || undefined,
      };

      // Dispatch createCompany action
      await dispatch(createCompany(payload)).unwrap();
      
      // Close dialog
      setIsAddDialogOpen(false);
      
      // Reset form
      resetForm();
      
      // Show success message
      toast.success('Company added successfully');
      
      // Reset to page 1 and refetch
      if (onPageChange) {
        onPageChange(1);
      }
      
      // Refetch companies
      const fetchParams: GetCompaniesParams = {
        ...filters,
        page: 1,
        search: searchQuery || undefined,
      };
      
      const cleanedFilters = Object.fromEntries(
        Object.entries(fetchParams).filter(([_, value]) => {
          if (typeof value === 'number') return true;
          return value !== '' && value !== null && value !== undefined;
        })
      ) as GetCompaniesParams;
      
      await dispatch(getCompanies(cleanedFilters));
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to add company');
    }
  };

  const resetForm = () => {
    setNewCompany({
      companyName: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      website: '',
      revenue: '',
      employeeSize: '',
      industry: '',
      technology: '',
      companyLinkedInUrl: '',
      amfNotes: '',
      lastUpdateDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    const companyData = company as any;
    setNewCompany({
      companyName: company.companyName,
      phone: company.phone || '',
      address1: company.address1,
      address2: company.address2,
      city: company.city,
      state: company.state,
      zipCode: company.zipCode,
      country: company.country,
      website: company.website,
      revenue: company.revenue,
      employeeSize: company.employeeSize,
      industry: company.industry,
      technology: company.technology,
      companyLinkedInUrl: company.companyLinkedInUrl || '',
      amfNotes: company.amfNotes,
      lastUpdateDate: company.lastUpdateDate || companyData.createdAt || new Date().toISOString().split('T')[0]
    });
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany) return;

    // Validate phone number
    if (newCompany.phone && !validatePhone(newCompany.phone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }

    // Validate website
    if (newCompany.website && !validateWebsite(newCompany.website)) {
      toast.error('Please enter a valid website URL (e.g., https://example.com)');
      return;
    }

    try {
      // Get company ID
      const companyId = editingCompany.id || (editingCompany as any)._id;
      if (!companyId) {
        toast.error('Company ID is missing');
        return;
      }

      // Prepare payload for API
      const payload = {
        id: companyId,
        companyName: newCompany.companyName || undefined,
        phone: newCompany.phone || undefined,
        address1: newCompany.address1 || undefined,
        address2: newCompany.address2 || undefined,
        city: newCompany.city || undefined,
        state: newCompany.state || undefined,
        zipCode: newCompany.zipCode || undefined,
        country: newCompany.country || undefined,
        website: newCompany.website || undefined,
        revenue: newCompany.revenue || undefined,
        employeeSize: newCompany.employeeSize || undefined,
        industry: newCompany.industry || undefined,
        technology: newCompany.technology || undefined,
        companyLinkedInUrl: newCompany.companyLinkedInUrl || undefined,
        amfNotes: newCompany.amfNotes || undefined,
        lastUpdateDate: newCompany.lastUpdateDate || undefined,
      };

      // Dispatch updateCompany action
      await dispatch(updateCompany(payload)).unwrap();

      // Close dialog
      setEditingCompany(null);
      resetForm();
      toast.success('Company updated successfully');

      // Refetch companies
      const fetchParams: GetCompaniesParams = {
        ...filters,
        page: pagination?.currentPage || 1,
        search: searchQuery || undefined,
      };
      
      const cleanedFilters = Object.fromEntries(
        Object.entries(fetchParams).filter(([_, value]) => {
          if (typeof value === 'number') return true;
          return value !== '' && value !== null && value !== undefined;
        })
      ) as GetCompaniesParams;
      
      await dispatch(getCompanies(cleanedFilters));

    } catch (error: any) {
      toast.error(error.message || 'Failed to update company');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!companyId) {
      toast.error('Company ID is missing');
      return;
    }

    try {
      // Dispatch deleteCompanies action with single ID
      await dispatch(deleteCompanies({ ids: [companyId] })).unwrap();

      toast.success('Company deleted successfully');

      // Clear selection if this company was selected
      setSelectedCompanies(selectedCompanies.filter((selectedId: string) => selectedId !== companyId));

      // Refetch companies
      const fetchParams: GetCompaniesParams = {
        ...filters,
        page: pagination?.currentPage || 1,
        search: searchQuery || undefined,
      };
      
      const cleanedFilters = Object.fromEntries(
        Object.entries(fetchParams).filter(([_, value]) => {
          if (typeof value === 'number') return true;
          return value !== '' && value !== null && value !== undefined;
        })
      ) as GetCompaniesParams;
      
      await dispatch(getCompanies(cleanedFilters));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete company');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCompanies.length === 0) {
      toast.error('Please select companies to delete');
      return;
    }

    // Store count before clearing
    const countToDelete = selectedCompanies.length;
    const idsToDelete = [...selectedCompanies];

    try {
      // Dispatch deleteCompanies action
      await dispatch(deleteCompanies({ ids: idsToDelete })).unwrap();

      // Clear selection
      setSelectedCompanies([]);
      toast.success(`${countToDelete} companies deleted successfully`);

      // Refetch companies
      const fetchParams: GetCompaniesParams = {
        ...filters,
        page: pagination?.currentPage || 1,
        search: searchQuery || undefined,
      };
      
      const cleanedFilters = Object.fromEntries(
        Object.entries(fetchParams).filter(([_, value]) => {
          if (typeof value === 'number') return true;
          return value !== '' && value !== null && value !== undefined;
        })
      ) as GetCompaniesParams;
      
      await dispatch(getCompanies(cleanedFilters));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete companies');
    }
  };

  // Helper function to escape CSV values
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportSingle = (company: Company) => {
    const companyData = company as any;
    const csvHeader = 'Company ID,Company Name,Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Revenue,Employee Size,Industry,Sub-Industry,Technology,Company LinkedIn URL,aMF Notes,Created By,Added Date,Last Update Date,Updated Date';
    const csvRow = [
      escapeCSV(company.id || companyData._id || ''),
      escapeCSV(company.companyName || ''),
      escapeCSV(company.phone || ''),
      escapeCSV(company.address1 || ''),
      escapeCSV(company.address2 || ''),
      escapeCSV(company.city || ''),
      escapeCSV(company.state || ''),
      escapeCSV(company.zipCode || ''),
      escapeCSV(company.country || ''),
      escapeCSV(company.website || ''),
      escapeCSV(company.revenue || ''),
      escapeCSV(company.employeeSize || ''),
      escapeCSV(company.industry || ''),
      escapeCSV(companyData.subIndustry || ''),
      escapeCSV(company.technology || ''),
      escapeCSV(company.companyLinkedInUrl || ''),
      escapeCSV(company.amfNotes || ''),
      escapeCSV(companyData.createdBy || company.addedBy || ''),
      escapeCSV(company.addedDate || companyData.createdAt || ''),
      escapeCSV(company.lastUpdateDate || ''),
      escapeCSV(company.updatedDate || companyData.updatedAt || '')
    ].join(',');
    
    const csvContent = [csvHeader, csvRow].join('\n');
    downloadCSV(csvContent, `company-${company.companyName.replace(/\s+/g, '-').toLowerCase()}.csv`);
  };

  const handleExportBulk = () => {
    if (selectedCompanies.length > 0) {
      const companiesToExport = companies.filter(company => selectedCompanies.includes(company.id));
      exportCompaniesToCSV(companiesToExport, `companies-export-${companiesToExport.length}.csv`);
      toast.success(`${companiesToExport.length} companies exported successfully`);
      return;
    }
    // If no selection, show confirmation dialog for "Export All"
    // TODO: Implement export all with confirmation dialog similar to ContactsTable
    toast.info('Please select companies to export or implement "Export All" functionality');
  };

  const exportCompaniesToCSV = (companiesToExport: Company[], filename: string) => {
    const csvHeader = 'Company ID,Company Name,Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Revenue,Employee Size,Industry,Sub-Industry,Technology,Company LinkedIn URL,aMF Notes,Created By,Added Date,Last Update Date,Updated Date';
    const csvRows = companiesToExport.map(company => {
      const companyData = company as any;
      return [
        escapeCSV(company.id || companyData._id || ''),
        escapeCSV(company.companyName || ''),
        escapeCSV(company.phone || ''),
        escapeCSV(company.address1 || ''),
        escapeCSV(company.address2 || ''),
        escapeCSV(company.city || ''),
        escapeCSV(company.state || ''),
        escapeCSV(company.zipCode || ''),
        escapeCSV(company.country || ''),
        escapeCSV(company.website || ''),
        escapeCSV(company.revenue || ''),
        escapeCSV(company.employeeSize || ''),
        escapeCSV(company.industry || ''),
        escapeCSV(companyData.subIndustry || ''),
        escapeCSV(company.technology || ''),
        escapeCSV(company.companyLinkedInUrl || ''),
        escapeCSV(company.amfNotes || ''),
        escapeCSV(companyData.createdBy || company.addedBy || ''),
        escapeCSV(company.addedDate || companyData.createdAt || ''),
        escapeCSV(company.lastUpdateDate || ''),
        escapeCSV(company.updatedDate || companyData.updatedAt || '')
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    downloadCSV(csvContent, filename);
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderFormFields = (isEdit = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={isEdit ? "edit-companyName" : "companyName"}>Company Name *</Label>
        <Input
          id={isEdit ? "edit-companyName" : "companyName"}
          value={newCompany.companyName}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, companyName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-phone" : "phone"}>Phone</Label>
        <Input
          id={isEdit ? "edit-phone" : "phone"}
          type="tel"
          value={newCompany.phone}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
          className={newCompany.phone && !validatePhone(newCompany.phone) ? 'border-red-500' : ''}
        />
        {newCompany.phone && !validatePhone(newCompany.phone) && (
          <p className="text-xs text-red-500">Please enter a valid phone number (10-15 digits)</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-website" : "website"}>Website</Label>
        <Input
          id={isEdit ? "edit-website" : "website"}
          type="url"
          value={newCompany.website}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, website: e.target.value})}
          placeholder="https://company.com"
          className={newCompany.website && !validateWebsite(newCompany.website) ? 'border-red-500' : ''}
        />
        {newCompany.website && !validateWebsite(newCompany.website) && (
          <p className="text-xs text-red-500">Please enter a valid website URL (e.g., https://example.com)</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-address1" : "address1"}>Address 1</Label>
        <Input
          id={isEdit ? "edit-address1" : "address1"}
          value={newCompany.address1}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, address1: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-address2" : "address2"}>Address 2</Label>
        <Input
          id={isEdit ? "edit-address2" : "address2"}
          value={newCompany.address2}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, address2: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-city" : "city"}>City</Label>
        <Input
          id={isEdit ? "edit-city" : "city"}
          value={newCompany.city}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, city: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-state" : "state"}>State</Label>
        <Input
          id={isEdit ? "edit-state" : "state"}
          value={newCompany.state}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, state: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-zipCode" : "zipCode"}>Zip Code</Label>
        <Input
          id={isEdit ? "edit-zipCode" : "zipCode"}
          value={newCompany.zipCode}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, zipCode: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-country" : "country"}>Country</Label>
        <Input
          id={isEdit ? "edit-country" : "country"}
          value={newCompany.country}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, country: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Industry</Label>
        <Select value={newCompany.industry} onValueChange={(value: string) => setNewCompany({...newCompany, industry: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.value} value={industry.value}>{industry.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Employee Size</Label>
        <Select value={newCompany.employeeSize} onValueChange={(value: string) => setNewCompany({...newCompany, employeeSize: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1to25">1 to 25</SelectItem>
            <SelectItem value="26to50">26 to 50</SelectItem>
            <SelectItem value="51to100">51 to 100</SelectItem>
            <SelectItem value="101to250">101 to 250</SelectItem>
            <SelectItem value="251to500">251 to 500</SelectItem>
            <SelectItem value="501to1000">501 to 1000</SelectItem>
            <SelectItem value="1001to2500">1001 to 2500</SelectItem>
            <SelectItem value="2501to5000">2501 to 5000</SelectItem>
            <SelectItem value="5001to10000">5001 to 10000</SelectItem>
            <SelectItem value="over10001">over 10,001</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Revenue</Label>
        <Select value={newCompany.revenue} onValueChange={(value: string) => setNewCompany({...newCompany, revenue: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select revenue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lessthan1M">Less than $1M</SelectItem>
            <SelectItem value="1Mto5M">$1M to $5M</SelectItem>
            <SelectItem value="5Mto10M">$5M to $10M</SelectItem>
            <SelectItem value="10Mto50M">$10M to $50M</SelectItem>
            <SelectItem value="50Mto100M">$50M to $100M</SelectItem>
            <SelectItem value="100Mto250M">$100M to $250M</SelectItem>
            <SelectItem value="250Mto500M">$250M to $500M</SelectItem>
            <SelectItem value="500Mto1B">$500M to $1B</SelectItem>
            <SelectItem value="Morethan1B">More than $1B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-technology" : "technology"}>Technology – Installed Base</Label>
        <Input
          id={isEdit ? "edit-technology" : "technology"}
          value={newCompany.technology}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, technology: e.target.value})}
          placeholder="React, Node.js, AWS"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-companyLinkedInUrl" : "companyLinkedInUrl"}>Company LinkedIn URL</Label>
        <Input
          id={isEdit ? "edit-companyLinkedInUrl" : "companyLinkedInUrl"}
          value={newCompany.companyLinkedInUrl}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, companyLinkedInUrl: e.target.value})}
          placeholder="https://linkedin.com/company/..."
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={isEdit ? "edit-amfNotes" : "amfNotes"}>aMF Notes</Label>
        <Textarea
          id={isEdit ? "edit-amfNotes" : "amfNotes"}
          value={newCompany.amfNotes}
          onChange={(e: { target: { value: string } }) => setNewCompany({...newCompany, amfNotes: e.target.value})}
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle>Companies ({totalCount})</CardTitle>
          <div className="flex items-center space-x-2">
            {onToggleFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Search Filters
              </Button>
            )}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies..."
                value={searchQuery || ''}
                onChange={(e: { target: { value: string } }) => {
                  const value = e.target.value;
                  handleSearchInputChange(value);
                }}
                className="pl-9 h-9"
              />
            </div>
            
            {selectedCompanies.length > 0 && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedCompanies.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Companies</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedCompanies.length} selected companies? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleBulkDelete} 
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={handleExportBulk} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export ({selectedCompanies.length})
                </Button>
              </>
            )}
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#EF8037] hover:bg-[#EF8037]/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>Fill in the company details below to add a new company to the system.</DialogDescription>
                </DialogHeader>
                {renderFormFields(false)}
                <div className="flex justify-end space-x-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCompany} 
                    className="bg-[#EF8037] hover:bg-[#EF8037]/90 text-white"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedCompanies.length === displayedCompanies.length && displayedCompanies.length > 0}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setSelectedCompanies(displayedCompanies.map(company => company.id));
                      } else {
                        setSelectedCompanies([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead onClick={() => handleSort('companyName')} className="cursor-pointer">
                  <div className="flex items-center">
                    Company {getSortIcon('companyName')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('industry')} className="cursor-pointer">
                  <div className="flex items-center">
                    Industry {getSortIcon('industry')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('city')} className="cursor-pointer">
                  <div className="flex items-center">
                    Location {getSortIcon('city')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('revenue')} className="cursor-pointer">
                  <div className="flex items-center">
                    Revenue {getSortIcon('revenue')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('employeeSize')} className="cursor-pointer">
                  <div className="flex items-center">
                    Employees {getSortIcon('employeeSize')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('website')} className="cursor-pointer">
                  <div className="flex items-center">
                    Website {getSortIcon('website')}
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {[...Array(10)].map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-4 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : displayedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                displayedCompanies.map((company) => {
                  return (
                <TableRow 
                  key={company.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={(e: any) => {
                    // Don't trigger row click if clicking on interactive elements
                    const target = e.target as HTMLElement;
                    if (!target.closest('button') && !target.closest('[role="checkbox"]') && !target.closest('[role="menuitem"]')) {
                      onViewCompany?.(company);
                    }
                  }}
                >
                  <TableCell onClick={(e: any) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedCompanies.includes(company.id)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSelectedCompanies([...selectedCompanies, company.id]);
                        } else {
                          setSelectedCompanies(selectedCompanies.filter((id: string) => id !== company.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(company.companyName)} flex items-center justify-center flex-shrink-0`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">{company.companyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{company.industry}</Badge>
                  </TableCell>
                  <TableCell>{company.city}, {company.state}</TableCell>
                  <TableCell>{formatRevenue(company.revenue)}</TableCell>
                  <TableCell>{company.employeeSize}</TableCell>
                  <TableCell className="max-w-xs truncate">{company.website}</TableCell>
                  <TableCell onClick={(e: any) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewCompany?.(company)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportSingle(company)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCompany(company.id)}
                          className="text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls - Fixed at bottom */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Label>Rows per page:</Label>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalCount)} of {totalCount} results
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageNavigation(Math.max(currentPage - 1, 1))}
              disabled={!pagination?.hasPreviousPage || currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageNavigation(pageNum)}
                    style={currentPage === pageNum ? { backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' } : {}}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageNavigation(Math.min(currentPage + 1, totalPages))}
              disabled={!pagination?.hasNextPage || currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editingCompany !== null} onOpenChange={(open: boolean) => !open && setEditingCompany(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company information below.</DialogDescription>
          </DialogHeader>
          {renderFormFields(true)}
          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setEditingCompany(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCompany} 
              style={{ backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' }}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
