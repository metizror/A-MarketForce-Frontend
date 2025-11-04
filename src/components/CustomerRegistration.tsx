import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Mail, Lock, Building, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerCustomer } from '@/store/slices/customerRegister.slice';
import { clearVerifiedCustomer } from '@/store/slices/auth.slice';
import { CustomerRegistrationSchema, CustomerRegistrationFormValues } from '@/validation-schemas';

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

export function CustomerRegistration({ onRegistrationComplete, onBackToLogin, onCreateApprovalRequest }: CustomerRegistrationProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pending } = useAppSelector((state) => state.customerRegister);

  const initialValues: CustomerRegistrationFormValues = {
    firstName: '',
    lastName: '',
    businessEmail: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  };

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues,
    validationSchema: CustomerRegistrationSchema,
    onSubmit: async (value, action) => {
      console.log('Form submitted', value);
      try {
        // Clear any previous verifiedCustomer state before starting new registration
        dispatch(clearVerifiedCustomer());
        
        const payload = {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.businessEmail,
          companyName: value.companyName,
          password: value.password,
        };
        console.log('Dispatching registerCustomer with payload:', payload);
        
        const result = await dispatch(registerCustomer(payload)).unwrap();
        console.log('Registration successful:', result);

        // Create approval request
        if (onCreateApprovalRequest) {
          onCreateApprovalRequest({
            firstName: value.firstName,
            lastName: value.lastName,
            businessEmail: value.businessEmail,
            companyName: value.companyName
          });
        }

        toast.success(result.message || 'Registration successful! Please verify your email.');
        
        // Reset form and navigate to OTP verify page
        action.resetForm();
        router.push('/otp-verify');
      } catch (err: any) {
        console.error('Registration error:', err);
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    },
  });

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={values.firstName}
                    onChange={handleChange}
                    className={`h-11 ${errors.firstName && touched.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-xs text-red-600 font-medium">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={values.lastName}
                    onChange={handleChange}
                    className={`h-11 ${errors.lastName && touched.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-xs text-red-600 font-medium">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={values.businessEmail}
                    onChange={handleChange}
                    className={`h-11 pl-10 ${errors.businessEmail && touched.businessEmail ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.businessEmail && touched.businessEmail ? (
                  <p className="text-xs text-red-600 font-medium">{errors.businessEmail}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Only business email addresses are accepted (no Gmail, Yahoo, etc.)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Your Company Inc."
                    value={values.companyName}
                    onChange={handleChange}
                    className={`h-11 pl-10 ${errors.companyName && touched.companyName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.companyName && touched.companyName && (
                  <p className="text-xs text-red-600 font-medium">{errors.companyName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={values.password}
                      onChange={handleChange}
                      className={`h-11 pl-10 ${errors.password && touched.password ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-xs text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className={`h-11 pl-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                  )}
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
                disabled={pending}
              >
                {pending ? (
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
