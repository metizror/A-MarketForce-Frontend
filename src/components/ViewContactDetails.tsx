import React, { useState } from 'react';
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
  Cpu,
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
import { toast } from 'sonner';

interface ViewContactDetailsProps {
  contact: Contact;
  user: UserType;
  onBack: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onExport: (contact: Contact) => void;
  companyName?: string;
  company?: Company;
}

export function ViewContactDetails({
  contact,
  user,
  onBack,
  onEdit,
  onDelete,
  onExport,
  companyName,
  company
}: ViewContactDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(contact.id);
    setShowDeleteDialog(false);
    toast.success('Contact deleted successfully');
    onBack();
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
              onClick={() => onEdit(contact)}
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
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
                    <div className="font-semibold text-gray-900">{contact.addedBy || 'Unknown'}</div>
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
                  
                  {/* Technology-Installed Base */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="mt-0.5">
                      <Cpu className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">Technology-Installed Base</div>
                      <div className="text-sm font-medium text-gray-900">{company?.technology || '-'}</div>
                    </div>
                  </div>
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
    </div>
  );
}
