import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Edit, Trash2, Download, Search, Eye, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown, Filter, Building2, BarChart3, MoreVertical, Plus, FileText, ChevronDown as ChevronDownIcon, Mail, Phone, Globe, MapPin, Users, DollarSign, TrendingUp, Briefcase, Link as LinkIcon } from 'lucide-react';
import { Company, Contact, User } from '../App';
import { toast } from 'sonner';

interface ViewCompanyDetailsProps {
  company: Company;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  user: User;
  onBack: () => void;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
}

type SortField = keyof Contact;
type SortDirection = 'asc' | 'desc';

export function ViewCompanyDetails({ 
  company, 
  contacts, 
  setContacts, 
  user, 
  onBack, 
  onEdit, 
  onDelete 
}: ViewCompanyDetailsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobLevel: 'all',
    jobRole: 'all',
    industry: 'all',
    country: '',
    state: ''
  });

  // Filter contacts related to this company (by matching company name or other criteria)
  const relatedContacts = useMemo(() => {
    return contacts.filter(contact => 
      // Match by company name in contact's email domain, or add a companyId field in future
      contact.email.includes(company.companyName.toLowerCase().replace(/\s+/g, '')) ||
      contact.industry === company.industry ||
      (contact.city === company.city && contact.state === company.state)
    );
  }, [contacts, company]);

  // Apply search, filters, and sorting to related contacts
  const filteredAndSortedContacts = useMemo(() => {
    let result = relatedContacts.filter(contact => {
      // Search across multiple fields
      const searchableFields = [
        contact.firstName, contact.lastName, contact.jobTitle, contact.email,
        contact.phone, contact.city, contact.state, contact.country
      ];
      const matchesSearch = searchableFields.some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Apply filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return contact[key as keyof Contact] === value;
      });
      
      return matchesSearch && matchesFilters;
    });

    // Sort results
    result.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return result;
  }, [relatedContacts, searchQuery, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedContacts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedContacts = filteredAndSortedContacts.slice(startIndex, startIndex + rowsPerPage);

  // Reset to first page when search/filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

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

  const handleExportCompany = () => {
    const csvHeader = 'Company Name,First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Revenue,Employee Size,Industry,Technology – Installed Base,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRow = `"${company.companyName}","${company.firstName}","${company.lastName}","${company.jobTitle}","${company.jobLevel}","${company.jobRole}","${company.email}","${company.phone}","${company.directPhone}","${company.address1}","${company.address2}","${company.city}","${company.state}","${company.zipCode}","${company.country}","${company.website}","${company.revenue}","${company.employeeSize}","${company.industry}","${company.technology}","${company.contactLinkedInUrl}","${company.amfNotes}","${company.lastUpdateDate}"`;
    
    const csvContent = [csvHeader, csvRow].join('\n');
    downloadCSV(csvContent, `company-${company.companyName.replace(/\s+/g, '-').toLowerCase()}.csv`);
    toast.success('Company details exported successfully');
  };

  const handleExportContacts = () => {
    const contactsToExport = selectedContacts.length > 0 
      ? filteredAndSortedContacts.filter(contact => selectedContacts.includes(contact.id))
      : filteredAndSortedContacts;

    const csvHeader = 'First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Location,Industry,Last Update Date';
    const csvRows = contactsToExport.map(contact =>
      `"${contact.firstName}","${contact.lastName}","${contact.jobTitle}","${contact.jobLevel}","${contact.jobRole}","${contact.email}","${contact.phone}","${contact.directPhone}","${contact.city}, ${contact.state}, ${contact.country}","${contact.industry}","${contact.lastUpdateDate}"`
    );

    const csvContent = [csvHeader, ...csvRows].join('\n');
    downloadCSV(csvContent, `${company.companyName}-contacts.csv`);
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
      setSelectedContacts(paginatedContacts.map(contact => contact.id));
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

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
    toast.success('Contact deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        {/* Header */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">Company detail</h1>
          </div>
        </div>

        {/* Gradient Banner */}
        <div className="relative h-32 bg-gradient-to-r from-orange-100 to-orange-200">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Header */}
        <div className="pt-16 px-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl mb-1">{company.companyName}</h2>
              <p className="text-gray-500">{company.industry}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(company)}>
                <Edit className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCompany}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Company
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(company.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Company
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Company Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Contact Section */}


                {/* Company Details Section */}
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Company Details</h3>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-indigo-700">Company Name</Label>
                        <p className="text-lg mt-1">{company.companyName}</p>
                      </div>
                      {company.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-indigo-600" />
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate">
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-xs text-gray-500">Revenue</Label>
                      <p className="mt-1 text-sm">{company.revenue || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-xs text-gray-500">Employees</Label>
                      <p className="mt-1 text-sm">{company.employeeSize || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-xs text-gray-500">Industry</Label>
                      <p className="mt-1 text-sm">{company.industry}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-xs text-gray-500">Last Updated</Label>
                      <p className="mt-1 text-sm">{company.lastUpdateDate}</p>
                    </div>
                  </div>

                  {company.technology && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <Label className="text-xs text-amber-700">Technology Stack</Label>
                      <p className="mt-1 text-sm">{company.technology}</p>
                    </div>
                  )}
                </div>

                {/* Location & Notes Section */}
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Location & Additional Info</h3>
                  
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                      <div className="space-y-1">
                        <Label className="text-xs text-teal-700">Address</Label>
                        {company.address1 && <p className="text-sm">{company.address1}</p>}
                        {company.address2 && <p className="text-sm">{company.address2}</p>}
                        <p className="text-sm">
                          {company.city && `${company.city}, `}
                          {company.state && `${company.state} `}
                          {company.zipCode}
                        </p>
                        {company.country && <p className="text-sm">{company.country}</p>}
                      </div>
                    </div>
                  </div>

                  {company.amfNotes && (
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <Label className="text-xs text-yellow-700">aMF Notes</Label>
                      <p className="mt-2 text-sm leading-relaxed">{company.amfNotes}</p>
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
                    <div className="space-y-1">
                      <p>Added by: <span className="font-medium text-gray-900">{company.addedBy}</span> ({company.addedByRole})</p>
                      <p>Added on: <span className="font-medium text-gray-900">{company.addedDate}</span></p>
                      <p>Updated: <span className="font-medium text-gray-900">{company.updatedDate}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Section */}
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <CardContent className="p-0">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #EF8037 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                {/* Content */}
                <div className="relative p-12">
                  <div className="max-w-2xl mx-auto text-center">
                    {/* Icon Circle */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl">
                          <Users className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-4">
                      <div>
                        <div className="inline-block px-4 py-1.5 bg-white rounded-full shadow-sm border border-orange-100 mb-3">
                          <span className="text-sm text-gray-600">Available Contacts</span>
                        </div>
                        <h3 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                          {filteredAndSortedContacts.length}
                        </h3>
                        <p className="text-xl text-gray-700 font-medium">
                          Contacts Available for{' '}
                          <span className="text-orange-600">{company.companyName}</span>
                        </p>
                      </div>

                      {/* Decorative Stats Bar */}
                      <div className="flex items-center justify-center gap-8 pt-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-600">Verified</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                          <Mail className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">Email Contacts</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                          <Phone className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">Phone Contacts</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-6">
                        <Button 
                          size="lg"
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                          onClick={handleExportContacts}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download All Contacts
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
