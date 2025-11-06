import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  DollarSign,
  Users,
  BarChart,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import { Company, User as UserType, Contact } from '@/types/dashboard.types';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCompany, deleteCompanies, getCompanies } from '@/store/slices/companies.slice';
import { getContacts } from '@/store/slices/contacts.slice';
import { privateApiCall } from '@/lib/api';

interface ViewCompanyDetailsProps {
  company: Company;
  user: UserType;
  onBack: () => void;
  onExport: (company: Company) => void;
  onCompanyUpdated?: () => void; // Callback to refresh company data after update
}

export function ViewCompanyDetails({
  company,
  user,
  onBack,
  onExport,
  onCompanyUpdated
}: ViewCompanyDetailsProps) {
  const dispatch = useAppDispatch();
  const { isUpdating, isDeleting } = useAppSelector((state) => state.companies);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsCount, setContactsCount] = useState(0);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  // Fetch contacts for this company
  useEffect(() => {
    const fetchCompanyContacts = async () => {
      if (!company.companyName) return;
      
      try {
        setIsLoadingContacts(true);
        // Fetch contacts filtered by company name
        const response = await privateApiCall<{ contacts: any[], pagination: any }>(
          `/admin/contacts?companyName=${encodeURIComponent(company.companyName)}&limit=1000`
        );
        
        const mappedContacts: Contact[] = response.contacts.map((contact: any) => ({
          id: contact._id?.toString() || contact.id,
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          phone: contact.phone || '',
          // Add other required fields
          jobTitle: contact.jobTitle || '',
          jobLevel: contact.jobLevel || '',
          jobRole: contact.jobRole || '',
          directPhone: contact.directPhone || '',
          address1: contact.address1 || '',
          address2: contact.address2 || '',
          city: contact.city || '',
          state: contact.state || '',
          zipCode: contact.zipCode || '',
          country: contact.country || '',
          website: contact.website || '',
          industry: contact.industry || '',
          contactLinkedInUrl: contact.contactLinkedInUrl || contact.LinkedInUrl || '',
          amfNotes: contact.amfNotes || '',
          lastUpdateDate: contact.lastUpdateDate || '',
          addedBy: contact.addedBy || undefined,
          addedByRole: contact.addedByRole || undefined,
          createdBy: contact.createdBy || undefined,
          addedDate: contact.addedDate || '',
          updatedDate: contact.updatedDate || '',
        }));
        
        setContacts(mappedContacts);
        setContactsCount(mappedContacts.length);
      } catch (error: any) {
        console.error('Failed to fetch contacts:', error);
        setContacts([]);
        setContactsCount(0);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    fetchCompanyContacts();
  }, [company.companyName]);

  const [editForm, setEditForm] = useState({
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
    subIndustry: '',
    technology: '',
    companyLinkedInUrl: '',
    amfNotes: '',
    lastUpdateDate: '',
  });

  const handleDelete = async () => {
    try {
      // Dispatch deleteCompanies action
      await dispatch(deleteCompanies({ ids: [company.id] })).unwrap();
      
      // Close dialog
      setShowDeleteDialog(false);
      
      // Show success message
      toast.success('Company deleted successfully');
      
      // Navigate back to companies list
      onBack();
    } catch (error: any) {
      // Error occurred - show error message
      toast.error(error.message || 'Failed to delete company');
      // Keep dialog open so user can retry
    }
  };

  const handleExport = () => {
    onExport(company);
    toast.success('Company exported successfully');
  };

  const handleExportContacts = () => {
    if (contacts.length === 0) {
      toast.info('No contacts available to export');
      return;
    }

    // Helper function to escape CSV values
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvHeader = 'First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Industry,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRows = contacts.map(contact => [
      escapeCSV(contact.firstName || ''),
      escapeCSV(contact.lastName || ''),
      escapeCSV(contact.jobTitle || ''),
      escapeCSV(contact.jobLevel || ''),
      escapeCSV(contact.jobRole || ''),
      escapeCSV(contact.email || ''),
      escapeCSV(contact.phone || ''),
      escapeCSV(contact.directPhone || ''),
      escapeCSV(contact.address1 || ''),
      escapeCSV(contact.address2 || ''),
      escapeCSV(contact.city || ''),
      escapeCSV(contact.state || ''),
      escapeCSV(contact.zipCode || ''),
      escapeCSV(contact.country || ''),
      escapeCSV(contact.website || ''),
      escapeCSV(contact.industry || ''),
      escapeCSV(contact.contactLinkedInUrl || ''),
      escapeCSV(contact.amfNotes || ''),
      escapeCSV(contact.lastUpdateDate || '')
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.companyName}-contacts.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success(`${contacts.length} contacts exported successfully`);
  };

  // Handle opening edit dialog
  const handleEditClick = () => {
    const companyData = company as any;
    setEditForm({
      companyName: company.companyName || '',
      phone: company.phone || '',
      address1: company.address1 || '',
      address2: company.address2 || '',
      city: company.city || '',
      state: company.state || '',
      zipCode: company.zipCode || '',
      country: company.country || '',
      website: company.website || '',
      revenue: company.revenue || '',
      employeeSize: company.employeeSize || '',
      industry: company.industry || '',
      subIndustry: companyData.subIndustry || '',
      technology: company.technology || '',
      companyLinkedInUrl: company.companyLinkedInUrl || '',
      amfNotes: company.amfNotes || '',
      lastUpdateDate: company.lastUpdateDate || companyData.createdAt || new Date().toISOString().split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  // Handle update company
  const handleUpdateCompany = async () => {
    if (!editForm.companyName) {
      toast.error('Please enter company name');
      return;
    }

    try {
      const payload = {
        id: company.id,
        companyName: editForm.companyName || undefined,
        phone: editForm.phone || undefined,
        address1: editForm.address1 || undefined,
        address2: editForm.address2 || undefined,
        city: editForm.city || undefined,
        state: editForm.state || undefined,
        zipCode: editForm.zipCode || undefined,
        country: editForm.country || undefined,
        website: editForm.website || undefined,
        revenue: editForm.revenue || undefined,
        employeeSize: editForm.employeeSize || undefined,
        industry: editForm.industry || undefined,
        subIndustry: editForm.subIndustry || undefined,
        technology: editForm.technology || undefined,
        companyLinkedInUrl: editForm.companyLinkedInUrl || undefined,
        amfNotes: editForm.amfNotes || undefined,
        lastUpdateDate: editForm.lastUpdateDate || undefined,
      };

      await dispatch(updateCompany(payload)).unwrap();
      
      setIsEditDialogOpen(false);
      toast.success('Company updated successfully');
      
      // Call callback to refresh company data
      if (onCompanyUpdated) {
        onCompanyUpdated();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update company');
    }
  };

  // Render form fields for edit dialog
  const renderEditFormFields = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="edit-companyName">Company Name *</Label>
          <Input
            id="edit-companyName"
            value={editForm.companyName}
            onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
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
          <Label htmlFor="edit-website">Website</Label>
          <Input
            id="edit-website"
            value={editForm.website}
            onChange={(e) => setEditForm({...editForm, website: e.target.value})}
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
          <Label>Industry</Label>
          <Input
            value={editForm.industry}
            onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label>Employee Size</Label>
          <Input
            value={editForm.employeeSize}
            onChange={(e) => setEditForm({...editForm, employeeSize: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label>Revenue</Label>
          <Input
            value={editForm.revenue}
            onChange={(e) => setEditForm({...editForm, revenue: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-technology">Technology Stack</Label>
          <Input
            id="edit-technology"
            value={editForm.technology}
            onChange={(e) => setEditForm({...editForm, technology: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-companyLinkedInUrl">Company LinkedIn URL</Label>
          <Input
            id="edit-companyLinkedInUrl"
            value={editForm.companyLinkedInUrl}
            onChange={(e) => setEditForm({...editForm, companyLinkedInUrl: e.target.value})}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="edit-amfNotes">aMF Notes</Label>
          <Textarea
            id="edit-amfNotes"
            value={editForm.amfNotes}
            onChange={(e) => setEditForm({...editForm, amfNotes: e.target.value})}
            rows={3}
          />
        </div>
      </div>
    );
  };

  const roleColor = user.role === 'superadmin' ? '#EF8037' : '#EB432F';

  // Format address
  const formatAddress = () => {
    const parts = [
      company.address1,
      company.address2,
      company.city,
      company.state,
      company.zipCode,
      company.country
    ].filter(Boolean);
    return parts.join(', ') || '-';
  };

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-full">
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
              <h1 className="text-2xl font-semibold text-gray-900">Company detail</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <BarChart className="w-4 h-4 text-gray-700" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <MoreVertical className="w-4 h-4 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Company Profile */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {/* Large Orange Square Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                
                {/* Company Name */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {company.companyName}
                </h2>
                
                {/* Industry */}
                <p className="text-gray-600 text-center">
                  {company.industry || '-'}
                </p>
              </div>
            </div>

            {/* Right Column - Company Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* COMPANY DETAILS Column */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">COMPANY DETAILS</h4>
                      
                      {/* Company Name with Website - Blue Card */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-xs text-blue-700 font-medium mb-1">Company Name</div>
                        <div className="text-base font-bold text-gray-900 mb-2">{company.companyName}</div>
                        {company.website && (
                          <div className="flex items-center gap-2 mt-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <a 
                              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {company.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Revenue - White Card */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Revenue</div>
                        <div className="text-sm font-medium text-gray-900">{company.revenue || '-'}</div>
                      </div>

                      {/* Employees - White Card */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Employees</div>
                        <div className="text-sm font-medium text-gray-900">{company.employeeSize || '-'}</div>
                      </div>

                      {/* Industry - White Card */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Industry</div>
                        <div className="text-sm font-medium text-gray-900">{company.industry || '-'}</div>
                      </div>

                      {/* Last Updated - White Card */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(company.lastUpdateDate)}</div>
                      </div>

                      {/* Technology Stack - Yellow Card */}
                      {company.technology && (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="text-xs text-yellow-700 font-medium mb-1">Technology Stack</div>
                          <div className="text-sm text-gray-900">{company.technology}</div>
                        </div>
                      )}
                    </div>

                    {/* LOCATION & ADDITIONAL INFO Column */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">LOCATION & ADDITIONAL INFO</h4>
                      
                      {/* Address - Green Card */}
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-green-700 font-medium mb-1">Address</div>
                            <div className="text-sm text-gray-900">{formatAddress()}</div>
                          </div>
                        </div>
                      </div>

                      {/* aMF Notes - Yellow Card */}
                      {company.amfNotes && (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="text-xs text-yellow-700 font-medium mb-2">aMF Notes</div>
                          <div className="text-sm text-gray-900">{company.amfNotes}</div>
                        </div>
                      )}

                      {/* Added/Updated Info - White Card */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>
                            Added by: <span className="font-medium text-gray-900">{(company as any).createdBy || company.addedBy || 'Unknown'}</span>
                            {company.addedByRole && (
                              <span className="text-gray-600"> ({company.addedByRole})</span>
                            )}
                          </div>
                          <div>
                            Added on: <span className="font-medium text-gray-900">{formatDate(company.addedDate)}</span>
                          </div>
                          <div>
                            Updated: <span className="font-medium text-gray-900">{formatDate(company.updatedDate || company.lastUpdateDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Contacts Section */}
          <div className="mt-8 bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-12">
              <div className="max-w-2xl mx-auto text-center">
                {/* Large Orange Circular Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Available Contacts Text */}
                <div className="mb-4">
                  <div className="inline-block px-4 py-1.5 bg-white rounded-full shadow-sm border border-orange-100 mb-3">
                    <span className="text-sm text-gray-600">Available Contacts</span>
                  </div>
                </div>

                {/* Count */}
                <h3 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  {contactsCount}
                </h3>

                {/* Description */}
                <p className="text-xl text-gray-700 font-medium mb-6">
                  Contacts Available for{' '}
                  <span className="text-orange-600">{company.companyName}</span>
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Verified</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Email Contacts</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Phone Contacts</span>
                  </div>
                </div>

                {/* Download Button */}
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  onClick={handleExportContacts}
                  disabled={contactsCount === 0}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download All Contacts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company information below.</DialogDescription>
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
              onClick={handleUpdateCompany}
              style={{ backgroundColor: roleColor }}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {company.companyName}? This action cannot be undone.
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
  );
}
