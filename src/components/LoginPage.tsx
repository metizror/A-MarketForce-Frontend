"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CustomerRegistration } from './CustomerRegistration';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/auth.slice';
import { LoginPayload } from '@/types/auth.types';
import {
  SuperadminLoginSchema,
  AdminLoginSchema,
  CustomerLoginSchema,
  SuperadminLoginFormValues,
  AdminLoginFormValues,
  CustomerLoginFormValues,
} from '@/validation-schemas';

// User type definition (matching app/page.tsx)
export type UserRole = 'superadmin' | 'admin' | 'customer' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
  onCreateApprovalRequest?: (request: {
    firstName: string;
    lastName: string;
    businessEmail: string;
    companyName: string;
  }) => void;
}

export function LoginPage({ onLogin, onCreateApprovalRequest }: LoginPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('superadmin');
  const [showRegistration, setShowRegistration] = useState(false);

  // Redux hooks
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user, token } = useAppSelector((state) => state.auth);

  // Superadmin Login Form
  const superadminInitialValues: SuperadminLoginFormValues = {
    email: '',
    password: '',
  };

  const {
    handleChange: handleSuperadminChange,
    handleSubmit: handleSuperadminSubmit,
    values: superadminValues,
    errors: superadminErrors,
    touched: superadminTouched,
  } = useFormik({
    initialValues: superadminInitialValues,
    validationSchema: SuperadminLoginSchema,
    onSubmit: async (value, action) => {
      const loginPayload: LoginPayload = {
        email: value.email,
        password: value.password,
        role: 'superadmin',
      };
      try {
        await dispatch(login(loginPayload)).unwrap();
        action.resetForm();
        router.push('/dashboard');
      } catch (err) {
        console.error('Login failed:', err);
      }
    },
  });

  // Admin Login Form
  const adminInitialValues: AdminLoginFormValues = {
    email: '',
    password: '',
  };

  const {
    handleChange: handleAdminChange,
    handleSubmit: handleAdminSubmit,
    values: adminValues,
    errors: adminErrors,
    touched: adminTouched,
  } = useFormik({
    initialValues: adminInitialValues,
    validationSchema: AdminLoginSchema,
    onSubmit: async (value, action) => {
      const loginPayload: LoginPayload = {
        email: value.email,
        password: value.password,
        role: 'admin',
      };
      try {
        await dispatch(login(loginPayload)).unwrap();
        action.resetForm();
        router.push('/dashboard');
      } catch (err) {
        console.error('Login failed:', err);
      }
    },
  });

  // Customer Login Form
  const customerInitialValues: CustomerLoginFormValues = {
    email: '',
    password: '',
  };

  const {
    handleChange: handleCustomerChange,
    handleSubmit: handleCustomerSubmit,
    values: customerValues,
    errors: customerErrors,
    touched: customerTouched,
  } = useFormik({
    initialValues: customerInitialValues,
    validationSchema: CustomerLoginSchema,
    onSubmit: async (value, action) => {
      const loginPayload: LoginPayload = {
        email: value.email,
        password: value.password,
        role: 'customer',
      };
      try {
        await dispatch(login(loginPayload)).unwrap();
        action.resetForm();
        router.push('/dashboard');
      } catch (err) {
        console.error('Login failed:', err);
      }
    },
  });

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated && user && token) {
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
        role: user.role || 'customer',
      };
      toast.success(`Welcome back, ${userData.name}!`);
      onLogin(userData);
    }
  }, [isAuthenticated, user, token, onLogin]);

  // Handle login errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    setActiveTab('customer');
    toast.success('Registration complete! Please log in with your credentials.');
  };

  if (showRegistration) {
    return <CustomerRegistration 
      onRegistrationComplete={handleRegistrationComplete} 
      onBackToLogin={() => setShowRegistration(false)}
      onCreateApprovalRequest={onCreateApprovalRequest}
    />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#EF8037' }}>
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Contact Management System</h1>
          <p className="text-gray-600 mt-2">Manage your contacts and companies efficiently</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="superadmin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Super Admin
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Customer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="superadmin">
                <form onSubmit={handleSuperadminSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="superadmin-email">Email</Label>
                    <Input
                      id="superadmin-email"
                      name="email"
                      type="email"
                      placeholder="superadmin@company.com"
                      value={superadminValues.email}
                      onChange={handleSuperadminChange}
                      className={`h-11 ${superadminErrors.email && superadminTouched.email ? 'border-red-500' : ''}`}
                    />
                    {superadminErrors.email && superadminTouched.email && (
                      <p className="text-xs text-red-600 font-medium">{superadminErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="superadmin-password">Password</Label>
                    <PasswordInput
                      id="superadmin-password"
                      name="password"
                      placeholder="Enter your password"
                      value={superadminValues.password}
                      onChange={handleSuperadminChange}
                      className={`h-11 ${superadminErrors.password && superadminTouched.password ? 'border-red-500' : ''}`}
                    />
                    {superadminErrors.password && superadminTouched.password && (
                      <p className="text-xs text-red-600 font-medium">{superadminErrors.password}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    style={{ backgroundColor: '#EF8037' }}
                    disabled={isLoading}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isLoading ? 'Logging in...' : 'Login as Super Admin'}
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("resetPasswordRole", "superadmin");
                        }
                        router.push("/reset-password");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={adminValues.email}
                      onChange={handleAdminChange}
                      className={`h-11 ${adminErrors.email && adminTouched.email ? 'border-red-500' : ''}`}
                    />
                    {adminErrors.email && adminTouched.email && (
                      <p className="text-xs text-red-600 font-medium">{adminErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <PasswordInput
                      id="admin-password"
                      name="password"
                      placeholder="Enter your password"
                      value={adminValues.password}
                      onChange={handleAdminChange}
                      className={`h-11 ${adminErrors.password && adminTouched.password ? 'border-red-500' : ''}`}
                    />
                    {adminErrors.password && adminTouched.password && (
                      <p className="text-xs text-red-600 font-medium">{adminErrors.password}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    style={{ backgroundColor: '#EB432F' }}
                    disabled={isLoading}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isLoading ? 'Logging in...' : 'Login as Admin'}
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("resetPasswordRole", "admin");
                        }
                        router.push("/reset-password");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="customer">
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      name="email"
                      type="email"
                      placeholder="customer@company.com"
                      value={customerValues.email}
                      onChange={handleCustomerChange}
                      className={`h-11 ${customerErrors.email && customerTouched.email ? 'border-red-500' : ''}`}
                    />
                    {customerErrors.email && customerTouched.email && (
                      <p className="text-xs text-red-600 font-medium">{customerErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <PasswordInput
                      id="customer-password"
                      name="password"
                      placeholder="Enter your password"
                      value={customerValues.password}
                      onChange={handleCustomerChange}
                      className={`h-11 ${customerErrors.password && customerTouched.password ? 'border-red-500' : ''}`}
                    />
                    {customerErrors.password && customerTouched.password && (
                      <p className="text-xs text-red-600 font-medium">{customerErrors.password}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    style={{ backgroundColor: '#EF8037' }}
                    disabled={isLoading}
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    {isLoading ? 'Logging in...' : 'Login as Customer'}
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("resetPasswordRole", "customer");
                        }
                        router.push("/reset-password");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      New to aMFAccess? Pay only for what you download.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/customer-signup')}
                    >
                      Create Customer Account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}