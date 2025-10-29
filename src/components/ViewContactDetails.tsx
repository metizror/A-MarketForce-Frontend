import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Linkedin,
  Calendar,
  User,
  Building2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  BarChart,
  Cpu
} from 'lucide-react';
import { Contact, User as UserType, Company } from '../App';
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
import { toast } from 'sonner@2.0.3';

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
  const [contactInfoOpen, setContactInfoOpen] = useState(true);
  const [companyInfoOpen, setCompanyInfoOpen] = useState(true);

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

  const InfoField = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | undefined;
  }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
        <div className="mt-0.5">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-0.5">{label}</div>
          <div className="text-sm text-gray-900 break-words">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header with Actions */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-10 w-10 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => onEdit(contact)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            {user.role === 'superadmin' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
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
              </>
            )}
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
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white text-2xl">
                  {getInitials(contact.firstName, contact.lastName)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Basic Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                      {contact.firstName} {contact.lastName}
                    </h2>
                    <p className="text-lg text-gray-700 mb-3">{contact.jobTitle || 'No Job Title'}</p>
                    <div className="flex items-center gap-3">
                      {contact.jobLevel && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">
                          {contact.jobLevel}
                        </Badge>
                      )}
                      {contact.jobRole && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-0">
                          {contact.jobRole}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Added By</div>
                    <div className="font-medium text-gray-900">{contact.addedBy}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {contact.addedByRole === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </Badge>
                  </div>
                </div>

                {/* Quick Contact Info */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {contact.email && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-blue-700 mb-0.5">Email</div>
                        <div className="text-sm text-gray-900 truncate">{contact.email}</div>
                      </div>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-green-700 mb-0.5">Phone</div>
                        <div className="text-sm text-gray-900">{contact.phone}</div>
                      </div>
                    </div>
                  )}
                  {contact.city && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-purple-700 mb-0.5">Location</div>
                        <div className="text-sm text-gray-900">{contact.city}{contact.state ? ', ' + contact.state : ''}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <Collapsible open={contactInfoOpen} onOpenChange={setContactInfoOpen}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-sm text-gray-600 mt-0.5">Personal and professional contact details</p>
                  </div>
                </div>
                {contactInfoOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField
                      icon={User}
                      label="Contact Name"
                      value={`${contact.firstName} ${contact.lastName}`}
                    />
                    <InfoField
                      icon={Briefcase}
                      label="Job Title"
                      value={contact.jobTitle}
                    />
                    <InfoField
                      icon={BarChart}
                      label="Job Level"
                      value={contact.jobLevel}
                    />
                    <InfoField
                      icon={Briefcase}
                      label="Role/Department"
                      value={contact.jobRole}
                    />
                    <InfoField
                      icon={Mail}
                      label="Email Id"
                      value={contact.email}
                    />
                    <InfoField
                      icon={Phone}
                      label="Phone#"
                      value={contact.phone}
                    />
                    <InfoField
                      icon={Phone}
                      label="Direct / Mobile#"
                      value={contact.directPhone}
                    />
                    <InfoField
                      icon={Linkedin}
                      label="Contact_LinkedIn"
                      value={contact.contactLinkedInUrl}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Company Information Section */}
          {(companyName || company) && (
            <Collapsible open={companyInfoOpen} onOpenChange={setCompanyInfoOpen}>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <CollapsibleTrigger className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
                      <p className="text-sm text-gray-600 mt-0.5">Organization and business details</p>
                    </div>
                  </div>
                  {companyInfoOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField
                        icon={Building2}
                        label="Company Name"
                        value={company?.companyName || companyName}
                      />
                      <InfoField
                        icon={Globe}
                        label="Website"
                        value={company?.website || contact.website}
                      />
                      <InfoField
                        icon={Briefcase}
                        label="Industry"
                        value={company?.industry || contact.industry}
                      />
                      <InfoField
                        icon={Users}
                        label="Employee Size"
                        value={company?.employeeSize}
                      />
                      <InfoField
                        icon={DollarSign}
                        label="Revenue"
                        value={company?.revenue}
                      />
                      <InfoField
                        icon={MapPin}
                        label="Address/Location"
                        value={company ? `${company.address1}${company.address2 ? ', ' + company.address2 : ''}${company.city ? ', ' + company.city : ''}${company.state ? ', ' + company.state : ''}` : `${contact.address1}${contact.address2 ? ', ' + contact.address2 : ''}${contact.city ? ', ' + contact.city : ''}${contact.state ? ', ' + contact.state : ''}`}
                      />
                      <InfoField
                        icon={Phone}
                        label="Phone#"
                        value={company?.phone || contact.phone}
                      />
                      <InfoField
                        icon={Linkedin}
                        label="Company_LinkedIn"
                        value={company?.contactLinkedInUrl || contact.contactLinkedInUrl}
                      />
                      <InfoField
                        icon={Cpu}
                        label="Technology-Installed Base"
                        value={company?.technology}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* Additional Notes Section */}
          {contact.amfNotes && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">aMF Notes</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Additional information and remarks</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-800">{contact.amfNotes}</p>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Record Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Contact ID</div>
                <div className="font-medium text-gray-900">#{contact.id}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Added Date</div>
                <div className="font-medium text-gray-900">{contact.addedDate}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                <div className="font-medium text-gray-900">{contact.lastUpdateDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
