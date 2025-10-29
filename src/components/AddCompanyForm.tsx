import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../App';

interface AddCompanyFormProps {
  onSave: (company: any) => void;
  onCancel: () => void;
  currentUser: User;
}

export function AddCompanyForm({ onSave, onCancel, currentUser }: AddCompanyFormProps) {
  const [formData, setFormData] = useState({
    // Company Fields (13 fields from Excel)
    companyName: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    revenue: '',
    employeeSize: '',
    industry: '',
    companyLinkedIn: '',
    technology: '',
    
    // System Fields
    amfNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.companyName) {
      toast.error('Company Name is required');
      return;
    }

    const newCompany = {
      id: `company-${Date.now()}`,
      companyName: formData.companyName,
      phone: formData.phone,
      address1: formData.address,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      website: formData.website,
      revenue: formData.revenue,
      employeeSize: formData.employeeSize,
      industry: formData.industry,
      companyLinkedInUrl: formData.companyLinkedIn,
      technology: formData.technology,
      amfNotes: formData.amfNotes,
      lastUpdateDate: new Date().toISOString().split('T')[0],
      addedBy: currentUser.name,
      addedByRole: currentUser.role,
      addedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    onSave(newCompany);
    toast.success('Company added successfully!');
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
                  <Building className="w-5 h-5 text-white" />
                </div>
                <CardTitle>Add New Company</CardTitle>
              </div>
            </div>
            
            {!canDelete && (
              <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                Only Super Admin can delete companies
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wider px-3">
                  Company Information
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

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
                    placeholder="e.g., Technology, Healthcare"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeSize">Employee Size</Label>
                  <Input
                    id="employeeSize"
                    value={formData.employeeSize}
                    onChange={(e) => handleInputChange('employeeSize', e.target.value)}
                    placeholder="e.g., 100-500, 1000+"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue</Label>
                  <Input
                    id="revenue"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    placeholder="e.g., $10M-$50M"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="technology">Technology-Installed Base</Label>
                  <Input
                    id="technology"
                    value={formData.technology}
                    onChange={(e) => handleInputChange('technology', e.target.value)}
                    placeholder="e.g., Salesforce, AWS, React"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wider px-3">
                  Address Information
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address2">Address 2</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => handleInputChange('address2', e.target.value)}
                    placeholder="Apt, suite, building (optional)"
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
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State / Province"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="Postal code"
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
                  placeholder="Add internal notes about this company..."
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
                      if (confirm('Are you sure you want to delete this company?')) {
                        toast.success('Company deleted');
                        onCancel();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Company
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#EF8037' }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Company
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
