import React, { useState, useMemo, useEffect } from 'react';
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
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Edit, Trash2, Download, Search, Eye, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown, MoreVertical, LayoutList, Table2, Filter } from 'lucide-react';
import { Contact, User, Company } from '@/types/dashboard.types';
import { toast } from 'sonner';
import { ContactsListView } from './ContactsListView';

interface ContactsTableProps {
  contacts: Contact[];
  user: User;
  companies?: Company[];
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
  onViewContact?: (contact: Contact) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

type SortField = keyof Contact;
type SortDirection = 'asc' | 'desc';

export function ContactsTable({ 
  contacts, 
  user, 
  companies = [], 
  filters = {}, 
  searchQuery = '',
  pagination = null,
  isLoading = false,
  error = null,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onLimitChange,
  onViewContact,
  showFilters = false,
  onToggleFilters
}: ContactsTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');

  // Industry and Sub-Industry mapping
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
  
  // Use pagination from API or default values
  const currentPage = pagination?.currentPage || 1;
  const rowsPerPage = pagination?.limit || 25;
  const totalPages = pagination?.totalPages || 1;
  const totalCount = pagination?.totalCount || 0;
  
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    jobLevel: '',
    jobRole: '',
    email: '',
    phone: '',
    directPhone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    industry: '',
    subIndustry: '',
    contactLinkedInUrl: '',
    amfNotes: '',
    lastUpdateDate: new Date().toISOString().split('T')[0],
    // Required Company Fields
    companyName: '',
    employeeSize: '',
    revenue: ''
  });

  // Helper function to get company name
  const getCompanyName = (contact: Contact) => {
    // First try to use companyName from contact (if API returns it directly)
    if (contact.companyName) {
      return contact.companyName;
    }
    // Fallback to finding in companies array
    if (contact.companyId) {
      const company = companies.find(c => c.id === contact.companyId);
      return company?.companyName || '';
    }
    return '';
  };

  // Helper function to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

  // Use contacts directly from API (already filtered and paginated server-side)
  const displayedContacts = contacts;
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

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.lastName) {
      toast.error('Please enter first and last name');
      return;
    }

    // Validate required company fields
    if (!newContact.companyName || !newContact.employeeSize || !newContact.revenue) {
      toast.error('Company Name, Employee Size, and Revenue are required');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
      addedBy: user.name,
      addedByRole: user.role || '',
      addedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    // Contact added - refresh the list
    // The parent component will handle refetching
    toast.success('Contact added successfully');
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Contact added successfully');
  };

  const resetForm = () => {
    setNewContact({
      firstName: '',
      lastName: '',
      jobTitle: '',
      jobLevel: '',
      jobRole: '',
      email: '',
      phone: '',
      directPhone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      website: '',
      industry: '',
      contactLinkedInUrl: '',
      amfNotes: '',
      lastUpdateDate: new Date().toISOString().split('T')[0],
      companyName: '',
      employeeSize: '',
      revenue: ''
    });
  };

  // Sync form when editingContact changes - ensures dropdowns show correct values
  useEffect(() => {
    if (editingContact) {
      // This will be handled by handleEditContact, but this ensures sync
      // The handleEditContact is called when clicking Edit, so this is a backup
    } else {
      // Reset form when dialog closes
      resetForm();
    }
  }, [editingContact]);

  // Helper function to normalize revenue values (remove spaces to match dropdown values)
  const normalizeRevenue = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    // Valid Revenue options - exact values as they appear in SelectItem
    const validRevenues = [
      'Less-than-1M', '1M-5M', '5M-10M', '10M-50M', '50M-100M',
      '100M-250M', '250M-500M', '500M-1B', 'More-than-1B'
    ];
    
    // First check for exact match (case-sensitive)
    const exactMatch = validRevenues.find(rev => rev === trimmed);
    if (exactMatch) return exactMatch;
    
    // Remove spaces and normalize to match dropdown values
    const normalized = trimmed.replace(/\s+/g, '');
    
    // Check normalized value against valid options
    const normalizedMatch = validRevenues.find(rev => rev.replace(/\s+/g, '') === normalized);
    if (normalizedMatch) return normalizedMatch;
    
    // Map possible variations to dropdown values
    if (normalized.includes('Less-than-1M') || normalized.includes('Lessthan1M') || normalized.toLowerCase().includes('lessthan1m')) return 'Less-than-1M';
    if (normalized.includes('1M-5M') || normalized.includes('1Mto5M') || normalized === '1m5m') return '1M-5M';
    if (normalized.includes('5M-10M') || normalized.includes('5Mto10M') || normalized === '5m10m') return '5M-10M';
    if (normalized.includes('10M-50M') || normalized.includes('10Mto50M') || normalized === '10m50m') return '10M-50M';
    if (normalized.includes('50M-100M') || normalized.includes('50Mto100M') || normalized === '50m100m') return '50M-100M';
    if (normalized.includes('100M-250M') || normalized.includes('100Mto250M') || normalized === '100m250m') return '100M-250M';
    if (normalized.includes('250M-500M') || normalized.includes('250Mto500M') || normalized === '250m500m') return '250M-500M';
    if (normalized.includes('500M-1B') || normalized.includes('500Mto1B') || normalized === '500m1b') return '500M-1B';
    if (normalized.includes('More-than-1B') || normalized.includes('Morethan1B') || normalized.toLowerCase().includes('morethan1b')) return 'More-than-1B';
    
    return '';
  };

  // Helper function to normalize employeeSize values (remove spaces to match dropdown values)
  const normalizeEmployeeSize = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    // Valid Employee Size options - exact values as they appear in SelectItem
    const validSizes = [
      '1-25', '26-50', '51-100', '101-250', '251-500',
      '501-1000', '1001-2500', '2501-5000', '5001-10000', 'over-10001'
    ];
    
    // First check for exact match (case-sensitive)
    const exactMatch = validSizes.find(size => size === trimmed);
    if (exactMatch) return exactMatch;
    
    // Remove spaces and normalize to match dropdown values
    const normalized = trimmed.replace(/\s+/g, '');
    
    // Check normalized value against valid options
    const normalizedMatch = validSizes.find(size => size.replace(/\s+/g, '') === normalized);
    if (normalizedMatch) return normalizedMatch;
    
    // Map possible variations to dropdown values
    if (normalized === '1-25' || normalized === '1to25' || normalized === '1to25') return '1-25';
    if (normalized === '26-50' || normalized === '26to50') return '26-50';
    if (normalized === '51-100' || normalized === '51to100') return '51-100';
    if (normalized === '101-250' || normalized === '101to250') return '101-250';
    if (normalized === '251-500' || normalized === '251to500') return '251-500';
    if (normalized === '501-1000' || normalized === '501to1000') return '501-1000';
    if (normalized === '1001-2500' || normalized === '1001to2500') return '1001-2500';
    if (normalized === '2501-5000' || normalized === '2501to5000') return '2501-5000';
    if (normalized === '5001-10000' || normalized === '5001to10000') return '5001-10000';
    if (normalized === 'over-10001' || normalized === 'over10001' || normalized.toLowerCase().includes('over10001') || normalized.toLowerCase().includes('over 10,001')) return 'over-10001';
    
    return '';
  };

  // Helper function to normalize Job Level values (trim and match exact values)
  const normalizeJobLevel = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    // Valid Job Level options - exact values as they appear in SelectItem
    const validLevels = [
      'Analyst', 'Below Manager', 'C-Level', 'Developer', 'Director', 
      'Engineer', 'General Manager', 'Manager', 'Managing Director', 
      'Vice President', 'Architect'
    ];
    // Check if trimmed value matches any valid level (case-insensitive)
    const matched = validLevels.find(level => level.toLowerCase() === trimmed.toLowerCase());
    // Always return the exact matched value to ensure SelectItem match
    if (matched) {
      return matched;
    }
    // Check for exact match (handles cases where value is already correct)
    const exactMatch = validLevels.find(level => level === trimmed);
    return exactMatch || '';
  };

  // Helper function to normalize Job Role values (trim and match exact values)
  const normalizeJobRole = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    
    // Valid Job Role options - exact values as they appear in SelectItem
    const validRoles = [
      'Administration', 'Business Development', 'Client Management', 
      'Customer Experience', 'Customer Success', 'Data & Analytics', 
      'Demand Generation', 'Engineering', 'Finance', 'Growth', 
      'Human Resources', 'Information Technology', 'Legal', 'Manufacturing', 
      'Marketing', 'Operations', 'Others', 
      'Procurement / Sourcing / Supply Chain', 'Product', 'Quality', 
      'Risk & Compliance', 'Sales', 'Sales & Marketing', 'Strategy', 'Underwriting'
    ];
    
    // First check for exact match (case-sensitive)
    const exactMatch = validRoles.find(role => role === trimmed);
    if (exactMatch) return exactMatch;
    
    // Check for case-insensitive match
    const caseInsensitiveMatch = validRoles.find(role => role.toLowerCase() === trimmed.toLowerCase());
    if (caseInsensitiveMatch) return caseInsensitiveMatch;
    
    // Handle common variations and abbreviations
    const lowerTrimmed = trimmed.toLowerCase();
    
    // Map common variations to exact values
    const variationMap: Record<string, string> = {
      // Engineering variations
      'software engineer': 'Engineering',
      'software engineering': 'Engineering',
      'engineer': 'Engineering',
      'development': 'Engineering',
      'software development': 'Engineering',
      'dev': 'Engineering',
      'programming': 'Engineering',
      'tech': 'Engineering',
      'technical': 'Engineering',
      
      // IT variations
      'it': 'Information Technology',
      'information tech': 'Information Technology',
      'tech support': 'Information Technology',
      'technology': 'Information Technology',
      
      // Sales variations
      'sales manager': 'Sales',
      'sales executive': 'Sales',
      'sales rep': 'Sales',
      'sales representative': 'Sales',
      'account manager': 'Sales',
      
      // Marketing variations
      'marketing manager': 'Marketing',
      'digital marketing': 'Marketing',
      'brand marketing': 'Marketing',
      
      // HR variations
      'hr': 'Human Resources',
      'human resource': 'Human Resources',
      'people operations': 'Human Resources',
      'talent': 'Human Resources',
      
      // Finance variations
      'accounting': 'Finance',
      'financial': 'Finance',
      'accounts': 'Finance',
      
      // Operations variations
      'ops': 'Operations',
      'operational': 'Operations',
      
      // Product variations
      'product management': 'Product',
      'product manager': 'Product',
      'pm': 'Product',
      
      // Data variations
      'data analytics': 'Data & Analytics',
      'data and analytics': 'Data & Analytics',
      'analytics': 'Data & Analytics',
      'data science': 'Data & Analytics',
      
      // Procurement variations
      'procurement': 'Procurement / Sourcing / Supply Chain',
      'sourcing': 'Procurement / Sourcing / Supply Chain',
      'supply chain': 'Procurement / Sourcing / Supply Chain',
      'purchasing': 'Procurement / Sourcing / Supply Chain',
      
      // Customer Success variations
      'customer support': 'Customer Success',
      'customer service': 'Customer Success',
      'cs': 'Customer Success',
      
      // Legal variations
      'legal affairs': 'Legal',
      'compliance': 'Risk & Compliance',
      'risk management': 'Risk & Compliance',
    };
    
    // Check variation map
    if (variationMap[lowerTrimmed]) {
      return variationMap[lowerTrimmed];
    }
    
    // Check if trimmed value contains any valid role (partial match)
    const partialMatch = validRoles.find(role => {
      const lowerRole = role.toLowerCase();
      return lowerTrimmed.includes(lowerRole) || lowerRole.includes(lowerTrimmed);
    });
    if (partialMatch) return partialMatch;
    
    // If still no match, return empty string
    return '';
  };

  // Helper function to normalize Industry values (trim and match exact values)
  const normalizeIndustry = (value: string | undefined, industries: { value: string; label: string }[]): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    // Check if trimmed value matches any industry value (case-insensitive)
    const matched = industries.find(industry => 
      industry.value.toLowerCase() === trimmed.toLowerCase() || 
      industry.label.toLowerCase() === trimmed.toLowerCase()
    );
    // Always return the exact matched value to ensure SelectItem match
    if (matched) {
      return matched.value;
    }
    // Check for exact match (handles cases where value is already correct)
    const exactMatch = industries.find(industry => 
      industry.value === trimmed || industry.label === trimmed
    );
    return exactMatch ? exactMatch.value : '';
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    // Access contact properties, handling both _id and id fields
    const contactData = contact as any;
    
    // Debug: Log the raw contact data to see what we're working with
    console.log('=== EDIT CONTACT DEBUG ===');
    console.log('Raw contact object:', contact);
    console.log('contactData.jobLevel:', contactData.jobLevel, 'Type:', typeof contactData.jobLevel, 'Length:', contactData.jobLevel?.length);
    console.log('contactData.jobRole:', contactData.jobRole, 'Type:', typeof contactData.jobRole, 'Length:', contactData.jobRole?.length);
    console.log('contactData.industry:', contactData.industry, 'Type:', typeof contactData.industry);
    
    // Get industries array for normalization
    const industriesArray = Object.keys(industrySubIndustryMap).map(industry => ({
      label: industry,
      value: industry,
    }));
    
    // Normalize all dropdown values to ensure they match SelectItem values exactly
    const normalizedJobLevel = normalizeJobLevel(contactData.jobLevel);
    const normalizedJobRole = normalizeJobRole(contactData.jobRole);
    const normalizedIndustry = normalizeIndustry(contactData.industry, industriesArray);
    const normalizedEmployeeSize = normalizeEmployeeSize(contactData.employeeSize);
    const normalizedRevenue = normalizeRevenue(contactData.revenue);
    
    // Debug logging (remove in production)
    console.log('Edit Contact - Original values:', {
      jobLevel: contactData.jobLevel,
      jobRole: contactData.jobRole,
      industry: contactData.industry,
      employeeSize: contactData.employeeSize,
      revenue: contactData.revenue
    });
    console.log('Edit Contact - Normalized values:', {
      jobLevel: normalizedJobLevel,
      jobRole: normalizedJobRole,
      industry: normalizedIndustry,
      employeeSize: normalizedEmployeeSize,
      revenue: normalizedRevenue
    });
    
    // Additional debug for Job Role specifically
    if (contactData.jobRole) {
      console.log('Job Role Debug:', {
        original: contactData.jobRole,
        trimmed: contactData.jobRole.trim(),
        normalized: normalizedJobRole,
        isEmpty: normalizedJobRole === '',
        willDisplay: normalizedJobRole !== ''
      });
    }
    
    console.log('Edit Contact - Full contact data:', contactData);
    
    // Create updated contact object with all fields
    // Use normalized value if it exists and is not empty, otherwise fallback to original value (trimmed)
    const updatedContact = {
      firstName: String(contactData.firstName || '').trim(),
      lastName: String(contactData.lastName || '').trim(),
      jobTitle: String(contactData.jobTitle || '').trim(),
      jobLevel: (normalizedJobLevel && normalizedJobLevel !== '') ? normalizedJobLevel : String(contactData.jobLevel || '').trim(),
      jobRole: (normalizedJobRole && normalizedJobRole !== '') ? normalizedJobRole : String(contactData.jobRole || '').trim(),
      email: String(contactData.email || '').trim(),
      phone: String(contactData.phone || '').trim(),
      directPhone: String(contactData.directPhone || '').trim(),
      address1: String(contactData.address1 || '').trim(),
      address2: String(contactData.address2 || '').trim(),
      city: String(contactData.city || '').trim(),
      state: String(contactData.state || '').trim(),
      zipCode: String(contactData.zipCode || '').trim(),
      country: String(contactData.country || '').trim(),
      website: String(contactData.website || '').trim(),
      industry: (normalizedIndustry && normalizedIndustry !== '') ? normalizedIndustry : String(contactData.industry || '').trim(),
      subIndustry: String((contactData.subIndustry || '').trim()),
      contactLinkedInUrl: String(contactData.contactLinkedInUrl || contactData.LinkedInUrl || '').trim(),
      amfNotes: String(contactData.amfNotes || '').trim(),
      lastUpdateDate: contactData.lastUpdateDate || new Date().toISOString().split('T')[0],
      companyName: String(contactData.companyName || '').trim(),
      employeeSize: (normalizedEmployeeSize && normalizedEmployeeSize !== '') ? normalizedEmployeeSize : String(contactData.employeeSize || '').trim(),
      revenue: (normalizedRevenue && normalizedRevenue !== '') ? normalizedRevenue : String(contactData.revenue || '').trim()
    };
    
    // Set state immediately and ensure it's applied
    setNewContact(updatedContact);
    
    // Log the final state to verify
    console.log('Edit Contact - Final state being set:', updatedContact);
    console.log('Edit Contact - Verification:', {
      jobRole: {
        original: contactData.jobRole,
        normalized: normalizedJobRole,
        final: updatedContact.jobRole,
        isNormalizedEmpty: normalizedJobRole === '',
        isFinalEmpty: updatedContact.jobRole === ''
      },
      industry: {
        original: contactData.industry,
        normalized: normalizedIndustry,
        final: updatedContact.industry,
        isNormalizedEmpty: normalizedIndustry === '',
        isFinalEmpty: updatedContact.industry === ''
      },
      employeeSize: {
        original: contactData.employeeSize,
        normalized: normalizedEmployeeSize,
        final: updatedContact.employeeSize,
        isNormalizedEmpty: normalizedEmployeeSize === '',
        isFinalEmpty: updatedContact.employeeSize === ''
      }
    });
  };

  const handleUpdateContact = () => {
    if (!editingContact) return;

    // Contact updated - refresh the list
    // The parent component will handle refetching
    setEditingContact(null);
    resetForm();
    toast.success('Contact updated successfully');
  };

  const handleDeleteContact = (contactId: string) => {
    // Contact deleted - refresh the list
    // The parent component will handle refetching
    toast.success('Contact deleted successfully');
  };

  const handleBulkDelete = () => {
    // Contacts deleted - refresh the list
    // The parent component will handle refetching
    setSelectedContacts([]);
    toast.success(`${selectedContacts.length} contacts deleted successfully`);
  };

  const handleExportSingle = (contact: Contact) => {
    const csvHeader = 'First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Industry,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRow = `"${contact.firstName}","${contact.lastName}","${contact.jobTitle}","${contact.jobLevel}","${contact.jobRole}","${contact.email}","${contact.phone}","${contact.directPhone}","${contact.address1}","${contact.address2}","${contact.city}","${contact.state}","${contact.zipCode}","${contact.country}","${contact.website}","${contact.industry}","${contact.contactLinkedInUrl}","${contact.amfNotes}","${contact.lastUpdateDate}"`;
    
    const csvContent = [csvHeader, csvRow].join('\n');
    downloadCSV(csvContent, `contact-${contact.firstName}-${contact.lastName}.csv`);
  };

  const handleExportBulk = () => {
    const contactsToExport = selectedContacts.length > 0 
      ? contacts.filter(contact => selectedContacts.includes(contact.id))
      : displayedContacts;

    const csvHeader = 'First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Industry,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRows = contactsToExport.map(contact =>
      `"${contact.firstName}","${contact.lastName}","${contact.jobTitle}","${contact.jobLevel}","${contact.jobRole}","${contact.email}","${contact.phone}","${contact.directPhone}","${contact.address1}","${contact.address2}","${contact.city}","${contact.state}","${contact.zipCode}","${contact.country}","${contact.website}","${contact.industry}","${contact.contactLinkedInUrl}","${contact.amfNotes}","${contact.lastUpdateDate}"`
    );

    const csvContent = [csvHeader, ...csvRows].join('\n');
    downloadCSV(csvContent, 'contacts-export.csv');
    toast.success(`${contactsToExport.length} contacts exported successfully`);
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(displayedContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  const renderFormFields = (isEdit = false) => {
    const contactId = editingContact?.id || (editingContact as any)?._id || 'new';
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-firstName" : "firstName"}>First Name *</Label>
        <Input
          id={isEdit ? "edit-firstName" : "firstName"}
          value={newContact.firstName}
          onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-lastName" : "lastName"}>Last Name *</Label>
        <Input
          id={isEdit ? "edit-lastName" : "lastName"}
          value={newContact.lastName}
          onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-jobTitle" : "jobTitle"}>Job Title</Label>
        <Input
          id={isEdit ? "edit-jobTitle" : "jobTitle"}
          value={newContact.jobTitle}
          onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Job Level</Label>
        <Select 
          key={`jobLevel-${contactId}`}
          value={newContact.jobLevel || ''} 
          onValueChange={(value) => setNewContact({...newContact, jobLevel: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Analyst">Analyst</SelectItem>
            <SelectItem value="Below Manager">Below Manager</SelectItem>
            <SelectItem value="C-Level">C-Level</SelectItem>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
            <SelectItem value="Engineer">Engineer</SelectItem>
            <SelectItem value="General Manager">General Manager</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Managing Director">Managing Director</SelectItem>
            <SelectItem value="Vice President">Vice President</SelectItem>
            <SelectItem value="Architect">Architect</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Job Role</Label>
        <Select 
          key={`jobRole-${contactId}`}
          value={newContact.jobRole || ''} 
          onValueChange={(value) => setNewContact({...newContact, jobRole: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Administration">Administration</SelectItem>
            <SelectItem value="Business Development">Business Development</SelectItem>
            <SelectItem value="Client Management">Client Management</SelectItem>
            <SelectItem value="Customer Experience">Customer Experience</SelectItem>
            <SelectItem value="Customer Success">Customer Success</SelectItem>
            <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
            <SelectItem value="Demand Generation">Demand Generation</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Growth">Growth</SelectItem>
            <SelectItem value="Human Resources">Human Resources</SelectItem>
            <SelectItem value="Information Technology">Information Technology</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
            <SelectItem value="Procurement / Sourcing / Supply Chain">Procurement / Sourcing / Supply Chain</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Quality">Quality</SelectItem>
            <SelectItem value="Risk & Compliance">Risk & Compliance</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
            <SelectItem value="Strategy">Strategy</SelectItem>
            <SelectItem value="Underwriting">Underwriting</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-email" : "email"}>Email</Label>
        <Input
          id={isEdit ? "edit-email" : "email"}
          type="email"
          value={newContact.email}
          onChange={(e) => setNewContact({...newContact, email: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-phone" : "phone"}>Phone</Label>
        <Input
          id={isEdit ? "edit-phone" : "phone"}
          value={newContact.phone}
          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-directPhone" : "directPhone"}>Direct Phone</Label>
        <Input
          id={isEdit ? "edit-directPhone" : "directPhone"}
          value={newContact.directPhone}
          onChange={(e) => setNewContact({...newContact, directPhone: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-address1" : "address1"}>Address 1</Label>
        <Input
          id={isEdit ? "edit-address1" : "address1"}
          value={newContact.address1}
          onChange={(e) => setNewContact({...newContact, address1: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-address2" : "address2"}>Address 2</Label>
        <Input
          id={isEdit ? "edit-address2" : "address2"}
          value={newContact.address2}
          onChange={(e) => setNewContact({...newContact, address2: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-city" : "city"}>City</Label>
        <Input
          id={isEdit ? "edit-city" : "city"}
          value={newContact.city}
          onChange={(e) => setNewContact({...newContact, city: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-state" : "state"}>State</Label>
        <Input
          id={isEdit ? "edit-state" : "state"}
          value={newContact.state}
          onChange={(e) => setNewContact({...newContact, state: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-zipCode" : "zipCode"}>Zip Code</Label>
        <Input
          id={isEdit ? "edit-zipCode" : "zipCode"}
          value={newContact.zipCode}
          onChange={(e) => setNewContact({...newContact, zipCode: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-country" : "country"}>Country</Label>
        <Input
          id={isEdit ? "edit-country" : "country"}
          value={newContact.country}
          onChange={(e) => setNewContact({...newContact, country: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-website" : "website"}>Website</Label>
        <Input
          id={isEdit ? "edit-website" : "website"}
          value={newContact.website}
          onChange={(e) => setNewContact({...newContact, website: e.target.value})}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <Label>Industry</Label>
        <Select 
          key={`industry-${contactId}`}
          value={newContact.industry || ''} 
          onValueChange={(value) => {
            setNewContact({...newContact, industry: value, subIndustry: ''});
          }}
        >
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

      {newContact.industry && industrySubIndustryMap[newContact.industry] && (
        <div className="space-y-2">
          <Label>Sub-Industry</Label>
          <Select 
            key={`subIndustry-${contactId}-${newContact.industry}`}
            value={newContact.subIndustry || ''} 
            onValueChange={(value) => setNewContact({...newContact, subIndustry: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-industry" />
            </SelectTrigger>
            <SelectContent>
              {industrySubIndustryMap[newContact.industry].map((subIndustry) => (
                <SelectItem key={subIndustry} value={subIndustry}>{subIndustry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-contactLinkedInUrl" : "contactLinkedInUrl"}>Contact LinkedIn URL</Label>
        <Input
          id={isEdit ? "edit-contactLinkedInUrl" : "contactLinkedInUrl"}
          value={newContact.contactLinkedInUrl}
          onChange={(e) => setNewContact({...newContact, contactLinkedInUrl: e.target.value})}
          placeholder="https://linkedin.com/in/username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-lastUpdateDate" : "lastUpdateDate"}>Last Update Date</Label>
        <Input
          id={isEdit ? "edit-lastUpdateDate" : "lastUpdateDate"}
          type="date"
          value={newContact.lastUpdateDate}
          onChange={(e) => setNewContact({...newContact, lastUpdateDate: e.target.value})}
        />
      </div>
      
      {/* Required Company Information */}
      <div className="md:col-span-2">
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-4">Company Information</h3>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-companyName" : "companyName"}>Company Name *</Label>
        <Input
          id={isEdit ? "edit-companyName" : "companyName"}
          value={newContact.companyName}
          onChange={(e) => setNewContact({...newContact, companyName: e.target.value})}
          placeholder="Enter company name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-employeeSize" : "employeeSize"}>Employee Size *</Label>
        <Select 
          key={`employeeSize-${contactId}`}
          value={newContact.employeeSize || ''} 
          onValueChange={(value) => setNewContact({...newContact, employeeSize: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-25">1 to 25</SelectItem>
            <SelectItem value="26-50">26 to 50</SelectItem>
            <SelectItem value="51-100">51 to 100</SelectItem>
            <SelectItem value="101-250">101 to 250</SelectItem>
            <SelectItem value="251-500">251 to 500</SelectItem>
            <SelectItem value="501-1000">501 to 1000</SelectItem>
            <SelectItem value="1001-2500">1001 to 2500</SelectItem>
            <SelectItem value="2501-5000">2501 to 5000</SelectItem>
            <SelectItem value="5001-10000">5001 to 10000</SelectItem>
            <SelectItem value="over-10001">over 10,001</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={isEdit ? "edit-revenue" : "revenue"}>Revenue *</Label>
        <Select 
          key={`revenue-${contactId}`}
          value={newContact.revenue || ''} 
          onValueChange={(value) => setNewContact({...newContact, revenue: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select revenue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Less-than-1M">Less than $1M</SelectItem>
            <SelectItem value="1M-5M">$1M to $5M</SelectItem>
            <SelectItem value="5M-10M">$5M to $10M</SelectItem>
            <SelectItem value="10M-50M">$10M to $50M</SelectItem>
            <SelectItem value="50M-100M">$50M to $100M</SelectItem>
            <SelectItem value="100M-250M">$100M to $250M</SelectItem>
            <SelectItem value="250M-500M">$250M to $500M</SelectItem>
            <SelectItem value="500M-1B">$500M to $1B</SelectItem>
            <SelectItem value="More-than-1B">More than $1B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor={isEdit ? "edit-amfNotes" : "amfNotes"}>aMF Notes</Label>
        <Textarea
          id={isEdit ? "edit-amfNotes" : "amfNotes"}
          value={newContact.amfNotes}
          onChange={(e) => setNewContact({...newContact, amfNotes: e.target.value})}
          rows={3}
          placeholder="Additional notes about the contact..."
        />
      </div>
    </div>
    );
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle>Contacts ({totalCount})</CardTitle>
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
                placeholder="Search contacts..."
                value={searchQuery || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleSearchInputChange(value);
                }}
                className="pl-9 h-9"
              />
            </div>
            
            {/* View Mode Toggle */}


            {selectedContacts.length > 0 && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedContacts.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Contacts</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedContacts.length} selected contacts? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={handleExportBulk} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export ({selectedContacts.length})
                </Button>
              </>
            )}
            <Button onClick={handleExportBulk} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#EF8037] hover:bg-[#EF8037]/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                  <DialogDescription>Fill in the contact details below to add a new contact to the system.</DialogDescription>
                </DialogHeader>
                {renderFormFields()}
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact} className="bg-[#EF8037] hover:bg-[#EF8037]/90 text-white">
                    Save
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
                    checked={selectedContacts.length === displayedContacts.length && displayedContacts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead onClick={() => handleSort('firstName')} className="cursor-pointer">
                  <div className="flex items-center">
                    Name {getSortIcon('firstName')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('phone')} className="cursor-pointer">
                  <div className="flex items-center">
                    Phone {getSortIcon('phone')}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                  <div className="flex items-center">
                    Email {getSortIcon('email')}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Company
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('addedDate')} className="cursor-pointer">
                  <div className="flex items-center">
                    Created Date {getSortIcon('addedDate')}
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <span className="ml-3 text-gray-600">Loading contacts...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : displayedContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                displayedContacts.map((contact) => {
                  return (
                <TableRow 
                  key={contact.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={(e) => {
                    // Don't trigger row click if clicking on interactive elements
                    const target = e.target as HTMLElement;
                    if (!target.closest('button') && !target.closest('[role="checkbox"]') && !target.closest('[role="menuitem"]')) {
                      onViewContact?.(contact);
                    }
                  }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => handleSelectContact(contact.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-200">
                          {getInitials(contact.firstName, contact.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                        <div className="text-sm text-gray-500">{contact.jobTitle}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contact.phone || '-'}</TableCell>
                  <TableCell>{contact.email || '-'}</TableCell>
                  <TableCell>{getCompanyName(contact) || '-'}</TableCell>
                  <TableCell>
                    {(() => {
                      const date = (contact as any).createdAt || contact.addedDate;
                      if (!date) return '-';
                      try {
                        const dateObj = typeof date === 'string' ? new Date(date) : date;
                        return dateObj.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit' 
                        });
                      } catch {
                        return date;
                      }
                    })()}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewContact?.(contact)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportSingle(contact)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600"
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
      <Dialog open={editingContact !== null} onOpenChange={(open) => !open && setEditingContact(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update the contact information below.</DialogDescription>
          </DialogHeader>
          {renderFormFields(true)}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setEditingContact(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateContact} style={{ backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' }}>
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
