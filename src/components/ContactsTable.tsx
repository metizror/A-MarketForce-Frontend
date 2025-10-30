import React, { useState, useMemo } from 'react';
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
import { Plus, Edit, Trash2, Download, Search, Eye, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown, MoreVertical, LayoutList, Table2 } from 'lucide-react';
import { Contact, User, Company } from '../App';
import { toast } from 'sonner';
import { ContactsListView } from './ContactsListView';

interface ContactsTableProps {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  user: User;
  companies?: Company[];
  filters?: any;
  onViewContact?: (contact: Contact) => void;
}

type SortField = keyof Contact;
type SortDirection = 'asc' | 'desc';

export function ContactsTable({ contacts, setContacts, user, companies = [], filters = {}, onViewContact }: ContactsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  
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
    contactLinkedInUrl: '',
    amfNotes: '',
    lastUpdateDate: new Date().toISOString().split('T')[0],
    // Required Company Fields
    companyName: '',
    employeeSize: '',
    revenue: ''
  });

  // Helper function to get company name by contact's companyId
  const getCompanyName = (contact: Contact) => {
    if (!contact.companyId) return '';
    const company = companies.find(c => c.id === contact.companyId);
    return company?.companyName || '';
  };

  // Helper function to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Apply search, filters, and sorting
  const filteredAndSortedContacts = useMemo(() => {
    let result = contacts.filter(contact => {
      // Search across multiple fields
      const searchableFields = [
        contact.firstName, contact.lastName, contact.jobTitle, contact.email,
        contact.phone, contact.city, contact.state, contact.country, contact.industry
      ];
      const matchesSearch = searchableFields.some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Apply filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        switch (key) {
          case 'firstName':
          case 'lastName':
          case 'email':
            return contact[key as keyof Contact].toLowerCase().includes((value as string).toLowerCase());
          case 'jobLevel':
          case 'jobRole':
          case 'industry':
          case 'country':
          case 'state':
            return contact[key as keyof Contact] === value;
          default:
            return true;
        }
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
  }, [contacts, searchQuery, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedContacts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedContacts = filteredAndSortedContacts.slice(startIndex, startIndex + rowsPerPage);
  
  // Reset to first page when filters change
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

    setContacts([...contacts, contact]);
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

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      firstName: contact.firstName,
      lastName: contact.lastName,
      jobTitle: contact.jobTitle,
      jobLevel: contact.jobLevel,
      jobRole: contact.jobRole,
      email: contact.email,
      phone: contact.phone,
      directPhone: contact.directPhone,
      address1: contact.address1,
      address2: contact.address2,
      city: contact.city,
      state: contact.state,
      zipCode: contact.zipCode,
      country: contact.country,
      website: contact.website,
      industry: contact.industry,
      contactLinkedInUrl: contact.contactLinkedInUrl,
      amfNotes: contact.amfNotes,
      lastUpdateDate: contact.lastUpdateDate,
      companyName: contact.companyName || '',
      employeeSize: contact.employeeSize || '',
      revenue: contact.revenue || ''
    });
  };

  const handleUpdateContact = () => {
    if (!editingContact) return;

    const updatedContacts = contacts.map(contact =>
      contact.id === editingContact.id
        ? {
            ...contact,
            ...newContact,
            updatedDate: new Date().toISOString().split('T')[0]
          }
        : contact
    );

    setContacts(updatedContacts);
    setEditingContact(null);
    resetForm();
    toast.success('Contact updated successfully');
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
    toast.success('Contact deleted successfully');
  };

  const handleBulkDelete = () => {
    setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
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
      : filteredAndSortedContacts;

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

  const renderFormFields = (isEdit = false) => (
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
        <Select value={newContact.jobLevel} onValueChange={(value) => setNewContact({...newContact, jobLevel: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entry">Entry</SelectItem>
            <SelectItem value="Junior">Junior</SelectItem>
            <SelectItem value="Mid">Mid</SelectItem>
            <SelectItem value="Senior">Senior</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
            <SelectItem value="VP">VP</SelectItem>
            <SelectItem value="C-Level">C-Level</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Job Role</Label>
        <Select value={newContact.jobRole} onValueChange={(value) => setNewContact({...newContact, jobRole: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
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
        <Select value={newContact.industry} onValueChange={(value) => setNewContact({...newContact, industry: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Consulting">Consulting</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
        <Input
          id={isEdit ? "edit-employeeSize" : "employeeSize"}
          value={newContact.employeeSize}
          onChange={(e) => setNewContact({...newContact, employeeSize: e.target.value})}
          placeholder="e.g., 100-500"
          required
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={isEdit ? "edit-revenue" : "revenue"}>Revenue *</Label>
        <Input
          id={isEdit ? "edit-revenue" : "revenue"}
          value={newContact.revenue}
          onChange={(e) => setNewContact({...newContact, revenue: e.target.value})}
          placeholder="e.g., $10M-$50M"
          required
        />
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contacts ({filteredAndSortedContacts.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
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
              {paginatedContacts.map((contact) => (
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
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{getCompanyName(contact)}</TableCell>
                  <TableCell>{contact.addedDate}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Label>Rows per page:</Label>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}>
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
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredAndSortedContacts.length)} of {filteredAndSortedContacts.length} results
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
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
                    onClick={() => setCurrentPage(pageNum)}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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
