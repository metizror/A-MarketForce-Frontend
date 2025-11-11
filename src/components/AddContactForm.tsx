import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UserPlus, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { User, Company } from '../App';

interface AddContactFormProps {
  onSave: (contact: any, newCompany?: any) => void;
  onCancel: () => void;
  currentUser: User;
  existingCompanies: Company[];
}

export function AddContactForm({ onSave, onCancel, currentUser, existingCompanies }: AddContactFormProps) {
  const [formData, setFormData] = useState({
    // Contact Fields (9 fields from Excel)
    firstName: '',
    lastName: '',
    jobTitle: '',
    jobLevel: '',
    jobRole: '',
    email: '',
    phone: '',
    directPhone: '',
    contactLinkedIn: '',
    
    // Company Fields (Required fields marked as per requirements)
    companyName: '',
    employeeSize: '',
    revenue: '',
    website: '',
    industry: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    companyLinkedIn: '',
    technology: '',
    
    // System Fields
    amfNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required contact fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('First Name, Last Name, and Email are required');
      return;
    }

    // Validate required company fields (Company Name, Employee Size, Revenue)
    if (!formData.companyName || !formData.employeeSize || !formData.revenue) {
      toast.error('Company Name, Employee Size, and Revenue are required');
      return;
    }

    // Create new company with all provided data
    const newCompany = {
      id: `company-${Date.now()}`,
      name: formData.companyName,
      employeeSize: formData.employeeSize,
      revenue: formData.revenue,
      website: formData.website,
      industry: formData.industry,
      address: formData.address,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      companyLinkedIn: formData.companyLinkedIn,
      technology: formData.technology,
      addedBy: currentUser.name,
      addedByRole: currentUser.role,
      addedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    const newContact = {
      id: `contact-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      jobTitle: formData.jobTitle,
      jobLevel: formData.jobLevel,
      jobRole: formData.jobRole,
      email: formData.email,
      phone: formData.phone,
      directPhone: formData.directPhone,
      contactLinkedIn: formData.contactLinkedIn,
      companyName: formData.companyName,
      companyId: newCompany.id,
      notes: formData.amfNotes,
      addedBy: currentUser.name,
      addedByRole: currentUser.role,
      addedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    onSave(newContact, newCompany);
    toast.success('Contact added successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canDelete = currentUser.role === 'superadmin';

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <CardTitle>Add New Contact</CardTitle>
              </div>
            </div>
            
            {!canDelete && (
              <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                Only Super Admin can delete contacts
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wider px-3">
                  Contact Information
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@example.com"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="directPhone">Direct Phone / Ext.</Label>
                  <Input
                    id="directPhone"
                    value={formData.directPhone}
                    onChange={(e) => handleInputChange('directPhone', e.target.value)}
                    placeholder="Extension or direct line"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobLevel">Job Level</Label>
                  <Input
                    id="jobLevel"
                    value={formData.jobLevel}
                    onChange={(e) => handleInputChange('jobLevel', e.target.value)}
                    placeholder="e.g., Senior, Manager, Director"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role/Department</Label>
                  <Input
                    id="jobRole"
                    value={formData.jobRole}
                    onChange={(e) => handleInputChange('jobRole', e.target.value)}
                    placeholder="e.g., Engineering, Sales"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contactLinkedIn">Contact LinkedIn URL</Label>
                  <Input
                    id="contactLinkedIn"
                    type="url"
                    value={formData.contactLinkedIn}
                    onChange={(e) => handleInputChange('contactLinkedIn', e.target.value)}
                    placeholder="https://www.linkedin.com/in/..."
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wider px-3">
                  Company Information
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-4">
                {/* Required Company Fields - Always Visible */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Enter company name"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeSize">Employee Size *</Label>
                    <Input
                      id="employeeSize"
                      value={formData.employeeSize}
                      onChange={(e) => handleInputChange('employeeSize', e.target.value)}
                      placeholder="e.g., 100-500"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue">Revenue *</Label>
                    <Input
                      id="revenue"
                      value={formData.revenue}
                      onChange={(e) => handleInputChange('revenue', e.target.value)}
                      placeholder="e.g., $10M-$50M"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.example.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="e.g., Technology"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">Address 2</Label>
                    <Input
                      id="address2"
                      value={formData.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      placeholder="Suite, unit, etc."
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State or Province"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="ZIP or Postal Code"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Country"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technology">Technology Stack</Label>
                    <Input
                      id="technology"
                      value={formData.technology}
                      onChange={(e) => handleInputChange('technology', e.target.value)}
                      placeholder="e.g., AWS, React, Python"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyLinkedIn">Company LinkedIn URL</Label>
                    <Input
                      id="companyLinkedIn"
                      type="url"
                      value={formData.companyLinkedIn}
                      onChange={(e) => handleInputChange('companyLinkedIn', e.target.value)}
                      placeholder="https://www.linkedin.com/company/..."
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wider px-3">
                  Additional Information
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amfNotes">aMF Notes</Label>
                <Textarea
                  id="amfNotes"
                  value={formData.amfNotes}
                  onChange={(e) => handleInputChange('amfNotes', e.target.value)}
                  placeholder="Add internal notes about this contact..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                {canDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this contact?')) {
                        toast.success('Contact deleted');
                        onCancel();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Contact
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#EF8037' }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Contact
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
