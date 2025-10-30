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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Plus, Edit, Trash2, Download, Search, Eye, ChevronLeft, ChevronRight, MoreVertical, Building2 } from 'lucide-react';
import { Company, User } from '../App';
import { toast } from 'sonner';

interface CompaniesTableProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  user: User;
  filters?: any;
  onViewCompany?: (company: Company) => void;
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

export function CompaniesTable({ companies, setCompanies, user, filters = {}, onViewCompany }: CompaniesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
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

  // Apply search, filters, and sorting
  const filteredAndSortedCompanies = useMemo(() => {
    let result = companies.filter(company => {
      // Search across multiple fields
      const searchableFields = [
        company.companyName, company.industry, company.city, company.state, company.country,
        company.website, company.technology
      ];
      const matchesSearch = searchableFields.some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Apply filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        switch (key) {
          case 'companyName':
            return company.companyName.toLowerCase().includes((value as string).toLowerCase());
          case 'technology':
            return company.technology.toLowerCase().includes((value as string).toLowerCase());
          case 'employeeSize':
          case 'revenue':
          case 'industry':
          case 'country':
          case 'state':
            return company[key as keyof Company] === value;
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
  }, [companies, searchQuery, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCompanies.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCompanies = filteredAndSortedCompanies.slice(startIndex, startIndex + rowsPerPage);
  
  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleAddCompany = () => {
    if (!newCompany.companyName) {
      toast.error('Please enter company name');
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      ...newCompany,
      addedBy: user.name,
      addedByRole: user.role || '',
      addedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    setCompanies([...companies, company]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Company added successfully');
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
      lastUpdateDate: company.lastUpdateDate
    });
  };

  const handleUpdateCompany = () => {
    if (!editingCompany) return;

    const updatedCompanies = companies.map(company =>
      company.id === editingCompany.id
        ? {
            ...company,
            ...newCompany,
            updatedDate: new Date().toISOString().split('T')[0]
          }
        : company
    );

    setCompanies(updatedCompanies);
    setEditingCompany(null);
    resetForm();
    toast.success('Company updated successfully');
  };

  const handleDeleteCompany = () => {
    if (!deletingCompany) return;
    setCompanies(companies.filter(company => company.id !== deletingCompany.id));
    setDeletingCompany(null);
    toast.success('Company deleted successfully');
  };

  const handleBulkDelete = () => {
    setCompanies(companies.filter(company => !selectedCompanies.includes(company.id)));
    setSelectedCompanies([]);
    toast.success(`${selectedCompanies.length} companies deleted successfully`);
  };

  const handleExportSingle = (company: Company) => {
    const csvHeader = 'Company Name,First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Revenue,Employee Size,Industry,Technology – Installed Base,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRow = `"${company.companyName}","${company.firstName}","${company.lastName}","${company.jobTitle}","${company.jobLevel}","${company.jobRole}","${company.email}","${company.phone}","${company.directPhone}","${company.address1}","${company.address2}","${company.city}","${company.state}","${company.zipCode}","${company.country}","${company.website}","${company.revenue}","${company.employeeSize}","${company.industry}","${company.technology}","${company.contactLinkedInUrl}","${company.amfNotes}","${company.lastUpdateDate}"`;
    
    const csvContent = [csvHeader, csvRow].join('\n');
    downloadCSV(csvContent, `company-${company.companyName.replace(/\s+/g, '-').toLowerCase()}.csv`);
  };

  const handleExportBulk = () => {
    const companiesToExport = selectedCompanies.length > 0 
      ? companies.filter(company => selectedCompanies.includes(company.id))
      : filteredAndSortedCompanies;

    const csvHeader = 'Company Name,First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Revenue,Employee Size,Industry,Technology – Installed Base,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRows = companiesToExport.map(company =>
      `"${company.companyName}","${company.firstName}","${company.lastName}","${company.jobTitle}","${company.jobLevel}","${company.jobRole}","${company.email}","${company.phone}","${company.directPhone}","${company.address1}","${company.address2}","${company.city}","${company.state}","${company.zipCode}","${company.country}","${company.website}","${company.revenue}","${company.employeeSize}","${company.industry}","${company.technology}","${company.contactLinkedInUrl}","${company.amfNotes}","${company.lastUpdateDate}"`
    );

    const csvContent = [csvHeader, ...csvRows].join('\n');
    downloadCSV(csvContent, 'companies-export.csv');
    toast.success(`${companiesToExport.length} companies exported successfully`);
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
          onChange={(e) => setNewCompany({...newCompany, companyName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-phone" : "phone"}>Phone</Label>
        <Input
          id={isEdit ? "edit-phone" : "phone"}
          value={newCompany.phone}
          onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-website" : "website"}>Website</Label>
        <Input
          id={isEdit ? "edit-website" : "website"}
          value={newCompany.website}
          onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
          placeholder="https://company.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-address1" : "address1"}>Address 1</Label>
        <Input
          id={isEdit ? "edit-address1" : "address1"}
          value={newCompany.address1}
          onChange={(e) => setNewCompany({...newCompany, address1: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-address2" : "address2"}>Address 2</Label>
        <Input
          id={isEdit ? "edit-address2" : "address2"}
          value={newCompany.address2}
          onChange={(e) => setNewCompany({...newCompany, address2: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-city" : "city"}>City</Label>
        <Input
          id={isEdit ? "edit-city" : "city"}
          value={newCompany.city}
          onChange={(e) => setNewCompany({...newCompany, city: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-state" : "state"}>State</Label>
        <Input
          id={isEdit ? "edit-state" : "state"}
          value={newCompany.state}
          onChange={(e) => setNewCompany({...newCompany, state: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-zipCode" : "zipCode"}>Zip Code</Label>
        <Input
          id={isEdit ? "edit-zipCode" : "zipCode"}
          value={newCompany.zipCode}
          onChange={(e) => setNewCompany({...newCompany, zipCode: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-country" : "country"}>Country</Label>
        <Input
          id={isEdit ? "edit-country" : "country"}
          value={newCompany.country}
          onChange={(e) => setNewCompany({...newCompany, country: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Industry</Label>
        <Select value={newCompany.industry} onValueChange={(value) => setNewCompany({...newCompany, industry: value})}>
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
            <SelectItem value="Services">Services</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Employee Size</Label>
        <Select value={newCompany.employeeSize} onValueChange={(value) => setNewCompany({...newCompany, employeeSize: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10</SelectItem>
            <SelectItem value="11-50">11-50</SelectItem>
            <SelectItem value="51-200">51-200</SelectItem>
            <SelectItem value="201-500">201-500</SelectItem>
            <SelectItem value="501-1000">501-1000</SelectItem>
            <SelectItem value="1001-5000">1001-5000</SelectItem>
            <SelectItem value="5000+">5000+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Revenue</Label>
        <Select value={newCompany.revenue} onValueChange={(value) => setNewCompany({...newCompany, revenue: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select revenue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="< $1M">{"< $1M"}</SelectItem>
            <SelectItem value="$1M-$10M">$1M-$10M</SelectItem>
            <SelectItem value="$10M-$50M">$10M-$50M</SelectItem>
            <SelectItem value="$50M-$100M">$50M-$100M</SelectItem>
            <SelectItem value="$100M+">$100M+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-technology" : "technology"}>Technology – Installed Base</Label>
        <Input
          id={isEdit ? "edit-technology" : "technology"}
          value={newCompany.technology}
          onChange={(e) => setNewCompany({...newCompany, technology: e.target.value})}
          placeholder="React, Node.js, AWS"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-companyLinkedInUrl" : "companyLinkedInUrl"}>Company LinkedIn URL</Label>
        <Input
          id={isEdit ? "edit-companyLinkedInUrl" : "companyLinkedInUrl"}
          value={newCompany.companyLinkedInUrl}
          onChange={(e) => setNewCompany({...newCompany, companyLinkedInUrl: e.target.value})}
          placeholder="https://linkedin.com/company/..."
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={isEdit ? "edit-amfNotes" : "amfNotes"}>aMF Notes</Label>
        <Textarea
          id={isEdit ? "edit-amfNotes" : "amfNotes"}
          value={newCompany.amfNotes}
          onChange={(e) => setNewCompany({...newCompany, amfNotes: e.target.value})}
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Companies ({filteredAndSortedCompanies.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            {selectedCompanies.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selectedCompanies.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportBulk}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Companies</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedCompanies.length} companies? This action cannot be undone.
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button onClick={handleExportBulk} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>Fill in the company details below</DialogDescription>
                </DialogHeader>
                {renderFormFields(false)}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCompany} style={{ backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' }}>
                    Add Company
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedCompanies.length === paginatedCompanies.length && paginatedCompanies.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCompanies(paginatedCompanies.map(c => c.id));
                        } else {
                          setSelectedCompanies([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company) => (
                  <TableRow 
                    key={company.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewCompany && onViewCompany(company)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCompanies([...selectedCompanies, company.id]);
                          } else {
                            setSelectedCompanies(selectedCompanies.filter(id => id !== company.id));
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
                    <TableCell>{company.firstName} {company.lastName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.industry}</Badge>
                    </TableCell>
                    <TableCell>{company.city}, {company.state}</TableCell>
                    <TableCell>{company.revenue}</TableCell>
                    <TableCell>{company.employeeSize}</TableCell>
                    <TableCell className="max-w-xs truncate">{company.website}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewCompany && onViewCompany(company)}>
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
                          <DropdownMenuItem onClick={() => setDeletingCompany(company)} className="text-red-600">
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Rows per page:</Label>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredAndSortedCompanies.length)} of {filteredAndSortedCompanies.length}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingCompany} onOpenChange={(open) => {
        if (!open) {
          setEditingCompany(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company details below</DialogDescription>
          </DialogHeader>
          {renderFormFields(true)}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => {
              setEditingCompany(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCompany} style={{ backgroundColor: user.role === 'superadmin' ? '#EF8037' : '#EB432F' }}>
              Update Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCompany} onOpenChange={(open) => !open && setDeletingCompany(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingCompany?.companyName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
