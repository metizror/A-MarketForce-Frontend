import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Mail, Lock, Building, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerRegistrationProps {
  onRegistrationComplete: () => void;
  onBackToLogin: () => void;
  onCreateApprovalRequest?: (request: {
    firstName: string;
    lastName: string;
    businessEmail: string;
    companyName: string;
  }) => void;
}

type RegistrationStep = 'form' | 'success';

export function CustomerRegistration({ onRegistrationComplete, onBackToLogin, onCreateApprovalRequest }: CustomerRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessEmail: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateBusinessEmail = (email: string): boolean => {
    // Check if email is from a business domain (not free email providers)
    const freeEmailProviders = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return !freeEmailProviders.includes(domain);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.businessEmail || 
        !formData.companyName || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateBusinessEmail(formData.businessEmail)) {
      toast.error('Please use a business email address. Free email providers are not accepted.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    // Create approval request instead of auto-approving
    if (onCreateApprovalRequest) {
      onCreateApprovalRequest({
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessEmail: formData.businessEmail,
        companyName: formData.companyName
      });
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration submitted! Your request is pending approval from Super Admin.');
      setCurrentStep('success');
    }, 2000);
  };

  const handleCompleteRegistration = () => {
    onRegistrationComplete();
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Registration Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Your registration request has been submitted successfully.<br />
                  Super Admin will review your request and you'll be notified once approved.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700">Registration submitted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700">Pending approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700">You'll be notified via email</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCompleteRegistration}
                  className="w-full h-11"
                  style={{ backgroundColor: '#EF8037' }}
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#EF8037' }}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Join aMFAccess - Pay only for what you download</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Customer Registration</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Please use your business email address. Free email providers are not accepted.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="businessEmail"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    className="h-11 pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Only business email addresses are accepted (no Gmail, Yahoo, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Company Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Pay-Per-Use Model</p>
                    <p>Pay only $0.40 per contact you download. No subscriptions, no hidden fees.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11"
                style={{ backgroundColor: '#EF8037' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Already have an account? <span className="text-orange-600 font-medium">Sign In</span>
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
