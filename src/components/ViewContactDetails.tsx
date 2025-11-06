import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Building2,
  Briefcase,
  Globe,
  Linkedin,
  DollarSign,
  Users,
  BarChart,
} from 'lucide-react';
import { Contact, User as UserType, Company } from '@/types/dashboard.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateContact, deleteContacts } from '@/store/slices/contacts.slice';

interface ViewContactDetailsProps {
  contact: Contact;
  user: UserType;
  onBack: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onExport: (contact: Contact) => void;
  companyName?: string;
  company?: Company;
  onContactUpdated?: () => void; // Callback to refresh contact data after update
}

export function ViewContactDetails({
  contact,
  user,
  onBack,
  onEdit,
  onDelete,
  onExport,
  companyName,
  company,
  onContactUpdated
}: ViewContactDetailsProps) {
  const dispatch = useAppDispatch();
  const { isUpdating, isDeleting } = useAppSelector((state) => state.contacts);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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

  const [editForm, setEditForm] = useState({
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
    lastUpdateDate: '',
    companyName: '',
    employeeSize: '',
    revenue: ''
  });

  const handleDelete = async () => {
    try {
      // Dispatch deleteContacts action
      await dispatch(deleteContacts({ ids: [contact.id] })).unwrap();
      
      // Close dialog
      setShowDeleteDialog(false);
      
      // Show success message
      toast.success('Contact deleted successfully');
      
      // Navigate back to contacts list
      onBack();
    } catch (error: any) {
      // Error occurred - show error message
      toast.error(error.message || 'Failed to delete contact');
      // Keep dialog open so user can retry
    }
  };

  const handleExport = () => {
    onExport(contact);
    toast.success('Contact exported successfully');
  };

  const roleColor = user.role === 'superadmin' ? '#EF8037' : '#EB432F';

  // Helper function to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper functions for normalization (same as ContactsTable)
  const normalizeRevenue = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const validRevenues = [
      'Less-than-1M', '1M-5M', '5M-10M', '10M-50M', '50M-100M',
      '100M-250M', '250M-500M', '500M-1B', 'More-than-1B'
    ];
    const exactMatch = validRevenues.find(rev => rev === trimmed);
    if (exactMatch) return exactMatch;
    if (trimmed === 'Less than $1M' || trimmed.toLowerCase() === 'less than $1m' || trimmed === 'Less-than-$1M') return 'Less-than-1M';
    if (trimmed === 'More than $1B' || trimmed.toLowerCase() === 'more than $1b' || trimmed === 'More-than-$1B') return 'More-than-1B';
    let normalized = trimmed.replace(/\$/g, '').replace(/\s+to\s+/gi, '-');
    const normalizedMatch = validRevenues.find(rev => rev === normalized);
    if (normalizedMatch) return normalizedMatch;
    return '';
  };

  const normalizeEmployeeSize = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const validSizes = [
      '1-25', '26-50', '51-100', '101-250', '251-500',
      '501-1000', '1001-2500', '2501-5000', '5001-10000', 'over-10001'
    ];
    const exactMatch = validSizes.find(size => size === trimmed);
    if (exactMatch) return exactMatch;
    if (trimmed === 'over 10,001' || trimmed.toLowerCase() === 'over 10,001') return 'over-10001';
    const normalized = trimmed.replace(/\s+to\s+/gi, '-');
    const normalizedMatch = validSizes.find(size => size === normalized);
    if (normalizedMatch) return normalizedMatch;
    return '';
  };

  const normalizeJobLevel = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const validLevels = [
      'Analyst', 'Below Manager', 'C-Level', 'Developer', 'Director', 
      'Engineer', 'General Manager', 'Manager', 'Managing Director', 
      'Vice President', 'Architect'
    ];
    const matched = validLevels.find(level => level.toLowerCase() === trimmed.toLowerCase());
    if (matched) return matched;
    const exactMatch = validLevels.find(level => level === trimmed);
    return exactMatch || '';
  };

  const normalizeJobRole = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const validRoles = [
      'Administration', 'Business Development', 'Client Management', 
      'Customer Experience', 'Customer Success', 'Data & Analytics', 
      'Demand Generation', 'Engineering', 'Finance', 'Growth', 
      'Human Resources', 'Information Technology', 'Legal', 'Manufacturing', 
      'Marketing', 'Operations', 'Others', 
      'Procurement / Sourcing / Supply Chain', 'Product', 'Quality', 
      'Risk & Compliance', 'Sales', 'Sales & Marketing', 'Strategy', 'Underwriting'
    ];
    const exactMatch = validRoles.find(role => role === trimmed);
    if (exactMatch) return exactMatch;
    const caseInsensitiveMatch = validRoles.find(role => role.toLowerCase() === trimmed.toLowerCase());
    if (caseInsensitiveMatch) return caseInsensitiveMatch;
    return '';
  };

  const normalizeIndustry = (value: string | undefined): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const matched = industries.find(industry => 
      industry.value.toLowerCase() === trimmed.toLowerCase() || 
      industry.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (matched) return matched.value;
    const exactMatch = industries.find(industry => 
      industry.value === trimmed || industry.label === trimmed
    );
    return exactMatch ? exactMatch.value : '';
  };

  // Handle opening edit dialog
  const handleEditClick = () => {
    const contactData = contact as any;
    const normalizedJobLevel = normalizeJobLevel(contactData.jobLevel);
    const normalizedJobRole = normalizeJobRole(contactData.jobRole);
    const normalizedIndustry = normalizeIndustry(contactData.industry);
    const normalizedEmployeeSize = normalizeEmployeeSize(contactData.employeeSize);
    const normalizedRevenue = normalizeRevenue(contactData.revenue);
    
    setEditForm({
      firstName: String(contactData.firstName || '').trim(),
      lastName: String(contactData.lastName || '').trim(),
      jobTitle: String(contactData.jobTitle || '').trim(),
      jobLevel: normalizedJobLevel || String(contactData.jobLevel || '').trim(),
      jobRole: normalizedJobRole || String(contactData.jobRole || '').trim(),
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
      industry: normalizedIndustry || String(contactData.industry || '').trim(),
      subIndustry: String((contactData.subIndustry || '').trim()),
      contactLinkedInUrl: String(contactData.contactLinkedInUrl || contactData.LinkedInUrl || '').trim(),
      amfNotes: String(contactData.amfNotes || '').trim(),
      lastUpdateDate: contactData.lastUpdateDate || new Date().toISOString().split('T')[0],
      companyName: String(contactData.companyName || '').trim(),
      employeeSize: normalizedEmployeeSize || String(contactData.employeeSize || '').trim(),
      revenue: normalizedRevenue || String(contactData.revenue || '').trim()
    });
    setIsEditDialogOpen(true);
  };

  // Handle update contact
  const handleUpdateContact = async () => {
    if (!editForm.firstName || !editForm.lastName) {
      toast.error('Please enter first and last name');
      return;
    }

    if (!editForm.companyName || !editForm.employeeSize || !editForm.revenue) {
      toast.error('Company Name, Employee Size, and Revenue are required');
      return;
    }

    try {
      const payload = {
        id: contact.id,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        jobTitle: editForm.jobTitle || undefined,
        jobLevel: editForm.jobLevel || undefined,
        jobRole: editForm.jobRole || undefined,
        email: editForm.email || undefined,
        phone: editForm.phone || undefined,
        directPhone: editForm.directPhone || undefined,
        address1: editForm.address1 || undefined,
        address2: editForm.address2 || undefined,
        city: editForm.city || undefined,
        state: editForm.state || undefined,
        zipCode: editForm.zipCode || undefined,
        country: editForm.country || undefined,
        website: editForm.website || undefined,
        industry: editForm.industry || undefined,
        subIndustry: editForm.subIndustry || undefined,
        LinkedInUrl: editForm.contactLinkedInUrl || undefined,
        lastUpdateDate: editForm.lastUpdateDate || undefined,
        companyName: editForm.companyName || undefined,
        employeeSize: editForm.employeeSize || undefined,
        revenue: editForm.revenue || undefined,
        amfNotes: editForm.amfNotes || undefined,
      };

      await dispatch(updateContact(payload)).unwrap();
      
      setIsEditDialogOpen(false);
      toast.success('Contact updated successfully');
      
      // Call callback to refresh contact data
      if (onContactUpdated) {
        onContactUpdated();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update contact');
    }
  };

  // Render form fields for edit dialog
  const renderEditFormFields = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="edit-firstName">First Name *</Label>
          <Input
            id="edit-firstName"
            value={editForm.firstName}
            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-lastName">Last Name *</Label>
          <Input
            id="edit-lastName"
            value={editForm.lastName}
            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-jobTitle">Job Title</Label>
          <Input
            id="edit-jobTitle"
            value={editForm.jobTitle}
            onChange={(e) => setEditForm({...editForm, jobTitle: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label>Job Level</Label>
          <Select 
            value={editForm.jobLevel || ''} 
            onValueChange={(value) => setEditForm({...editForm, jobLevel: value})}
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
            value={editForm.jobRole || ''} 
            onValueChange={(value) => setEditForm({...editForm, jobRole: value})}
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
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            value={editForm.phone}
            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-directPhone">Direct Phone</Label>
          <Input
            id="edit-directPhone"
            value={editForm.directPhone}
            onChange={(e) => setEditForm({...editForm, directPhone: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-address1">Address 1</Label>
          <Input
            id="edit-address1"
            value={editForm.address1}
            onChange={(e) => setEditForm({...editForm, address1: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-address2">Address 2</Label>
          <Input
            id="edit-address2"
            value={editForm.address2}
            onChange={(e) => setEditForm({...editForm, address2: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-city">City</Label>
          <Input
            id="edit-city"
            value={editForm.city}
            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-state">State</Label>
          <Input
            id="edit-state"
            value={editForm.state}
            onChange={(e) => setEditForm({...editForm, state: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-zipCode">Zip Code</Label>
          <Input
            id="edit-zipCode"
            value={editForm.zipCode}
            onChange={(e) => setEditForm({...editForm, zipCode: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-country">Country</Label>
          <Input
            id="edit-country"
            value={editForm.country}
            onChange={(e) => setEditForm({...editForm, country: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-website">Website</Label>
          <Input
            id="edit-website"
            value={editForm.website}
            onChange={(e) => setEditForm({...editForm, website: e.target.value})}
            placeholder="https://example.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select 
            value={editForm.industry || ''} 
            onValueChange={(value) => {
              setEditForm({...editForm, industry: value, subIndustry: ''});
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

        {editForm.industry && industrySubIndustryMap[editForm.industry] && (
          <div className="space-y-2">
            <Label>Sub-Industry</Label>
            <Select 
              value={editForm.subIndustry || ''} 
              onValueChange={(value) => setEditForm({...editForm, subIndustry: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-industry" />
              </SelectTrigger>
              <SelectContent>
                {industrySubIndustryMap[editForm.industry].map((subIndustry) => (
                  <SelectItem key={subIndustry} value={subIndustry}>{subIndustry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="edit-contactLinkedInUrl">Contact LinkedIn URL</Label>
          <Input
            id="edit-contactLinkedInUrl"
            value={editForm.contactLinkedInUrl}
            onChange={(e) => setEditForm({...editForm, contactLinkedInUrl: e.target.value})}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-lastUpdateDate">Last Update Date</Label>
          <Input
            id="edit-lastUpdateDate"
            type="date"
            value={editForm.lastUpdateDate}
            onChange={(e) => setEditForm({...editForm, lastUpdateDate: e.target.value})}
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="font-medium text-gray-900 mb-4">Company Information</h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-companyName">Company Name *</Label>
          <Input
            id="edit-companyName"
            value={editForm.companyName}
            onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
            placeholder="Enter company name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-employeeSize">Employee Size *</Label>
          <Select 
            value={editForm.employeeSize || ''} 
            onValueChange={(value) => setEditForm({...editForm, employeeSize: value})}
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
          <Label htmlFor="edit-revenue">Revenue *</Label>
          <Select 
            value={editForm.revenue || ''} 
            onValueChange={(value) => setEditForm({...editForm, revenue: value})}
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
          <Label htmlFor="edit-amfNotes">aMF Notes</Label>
          <Textarea
            id="edit-amfNotes"
            value={editForm.amfNotes}
            onChange={(e) => setEditForm({...editForm, amfNotes: e.target.value})}
            rows={3}
            placeholder="Additional notes about the contact..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-full">
      {/* Thin dark brown top bar */}
      {/* <div className="h-1" style={{ backgroundColor: '#8B4513' }}></div>   */}
      
      {/* Header with Actions */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="h-10 w-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              style={{ color: '#374151' }}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: '#374151', strokeWidth: 2 }} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Contact Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage contact information
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 text-gray-700" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 text-gray-700" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 bg-red-600 border-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 text-white" />
              Delete
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {contact.firstName} {contact.lastName}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-gray-100 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white text-2xl font-semibold">
                  {getInitials(contact.firstName, contact.lastName)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Basic Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {contact.firstName} {contact.lastName}
                    </h2>
                    <p className="text-lg text-gray-700 mb-3">{contact.jobTitle || '-'}</p>
                    <div className="flex items-center gap-2">
                      {contact.jobLevel && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-0 rounded-full px-3 py-1">
                          {contact.jobLevel}
                        </Badge>
                      )}
                      {contact.jobRole && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-0 rounded-full px-3 py-1">
                          {contact.jobRole}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Added By</div>
                    <div className="font-semibold text-gray-900">{(contact as any).createdBy || contact.addedBy || 'Unknown'}</div>
                  </div>
                </div>

                {/* Quick Contact Info */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {contact.email && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-blue-700 mb-1 font-medium">Email</div>
                        <div className="text-sm text-gray-900 truncate font-medium">{contact.email}</div>
                      </div>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-green-700 mb-1 font-medium">Phone</div>
                        <div className="text-sm text-gray-900 font-medium">{contact.phone}</div>
                      </div>
                    </div>
                  )}
                  {(contact.city || contact.state) && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-purple-700 mb-1 font-medium">Location</div>
                        <div className="text-sm text-gray-900 font-medium">
                          {contact.city || ''}{contact.city && contact.state ? ', ' : ''}{contact.state || ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Personal and professional contact details</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contact Name */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Contact Name</div>
                    <div className="text-sm font-medium text-gray-900">{contact.firstName} {contact.lastName}</div>
                  </div>
                </div>
                
                {/* Job Title */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Job Title</div>
                    <div className="text-sm font-medium text-gray-900">{contact.jobTitle || '-'}</div>
                  </div>
                </div>
                
                {/* Job Level */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    <BarChart className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Job Level</div>
                    <div className="text-sm font-medium text-gray-900">{contact.jobLevel || '-'}</div>
                  </div>
                </div>
                
                {/* Role/Department */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Role/Department</div>
                    <div className="text-sm font-medium text-gray-900">{contact.jobRole || '-'}</div>
                  </div>
                </div>
                
                {/* Email ID */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Email Id</div>
                    <div className="text-sm font-medium text-gray-900">{contact.email || '-'}</div>
                  </div>
                </div>
                
                {/* Phone# */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="mt-0.5">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Phone#</div>
                    <div className="text-sm font-medium text-gray-900">{contact.phone || '-'}</div>
                  </div>
                </div>
                
                {/* Direct / Mobile# */}
                {contact.directPhone && (
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Direct / Mobile#</div>
                      <div className="text-sm font-medium text-gray-900">{contact.directPhone}</div>
                    </div>
                  </div>
                )}
                
                {/* Contact LinkedIn */}
                {contact.contactLinkedInUrl && (
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Linkedin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Contact_LinkedIn</div>
                      <div className="text-sm font-medium text-blue-600">
                        <a href={contact.contactLinkedInUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                          {contact.contactLinkedInUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          {(companyName || company || contact.companyName) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
                    <p className="text-sm text-gray-600 mt-0.5">Organization and business details</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Company Name */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Building2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Company Name</div>
                      <div className="text-sm font-medium text-gray-900">{company?.companyName || companyName || contact.companyName || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Website */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Website</div>
                      <div className="text-sm font-medium text-gray-900">{company?.website || contact.website || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Industry */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Industry</div>
                      <div className="text-sm font-medium text-gray-900">{company?.industry || contact.industry || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Employee Size */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Employee Size</div>
                      <div className="text-sm font-medium text-gray-900">{company?.employeeSize || contact.employeeSize || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Revenue */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Revenue</div>
                      <div className="text-sm font-medium text-gray-900">{company?.revenue || contact.revenue || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Address/Location */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Address/Location</div>
                      <div className="text-sm font-medium text-gray-900">
                        {(() => {
                          const addr = company 
                            ? `${company.address1 || ''}${company.address2 ? ', ' + company.address2 : ''}${company.city ? ', ' + company.city : ''}${company.state ? ', ' + company.state : ''}`
                            : `${contact.address1 || ''}${contact.address2 ? ', ' + contact.address2 : ''}${contact.city ? ', ' + contact.city : ''}${contact.state ? ', ' + contact.state : ''}`;
                          return addr.trim() || '-';
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone# */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Phone#</div>
                      <div className="text-sm font-medium text-gray-900">{company?.phone || contact.phone || '-'}</div>
                    </div>
                  </div>
                  
                  {/* Company LinkedIn */}
                  {(company?.contactLinkedInUrl || contact.contactLinkedInUrl) && (
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="mt-0.5">
                        <Linkedin className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">Company_LinkedIn</div>
                        <div className="text-sm font-medium text-blue-600">
                          <a href={company?.contactLinkedInUrl || contact.contactLinkedInUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                            {company?.contactLinkedInUrl || contact.contactLinkedInUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes Section */}
          {contact.amfNotes && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">aMF Notes</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Additional information and remarks</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-800">{contact.amfNotes}</p>
              </div>
            </div>
          )}

          {/* Record Information Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Contact ID</div>
                <div className="text-base font-medium text-gray-900">#{contact.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Added Date</div>
                <div className="text-base font-medium text-gray-900">
                  {(() => {
                    const date = contact.addedDate || (contact as any).createdAt;
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
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-base font-medium text-gray-900">
                  {(() => {
                    const date = contact.lastUpdateDate || contact.updatedDate || (contact as any).updatedAt;
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update the contact information below.</DialogDescription>
          </DialogHeader>
          {renderEditFormFields()}
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateContact}
              style={{ backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' }}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
