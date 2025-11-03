"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, UserCircle } from 'lucide-react';

// User type definition (matching app/page.tsx)
export type UserRole = 'superadmin' | 'admin' | 'customer' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
import { toast } from 'sonner';
import { CustomerRegistration } from './CustomerRegistration';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/auth.slice';
import { LoginPayload } from '@/types/auth.types';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('superadmin');
  const [showRegistration, setShowRegistration] = useState(false);

  // Redux hooks
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user, token } = useAppSelector((state) => state.auth);

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

  // Map tab value to role
  const getRoleFromTab = (tab: string): 'superadmin' | 'admin' | 'customer' => {
    if (tab === 'superadmin') return 'superadmin';
    if (tab === 'admin') return 'admin';
    return 'customer';
  };

  const handleLogin = async (e: { preventDefault: () => void }, role: 'superadmin' | 'admin' | 'customer') => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Create login payload with dynamic role
    const loginPayload: LoginPayload = {
      email,
      password,
      role,
    };

    // Dispatch Redux login action
    try {
      await dispatch(login(loginPayload)).unwrap();
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by useEffect above
      console.error('Login failed:', err);
    }
  };

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
                <form onSubmit={(e) => handleLogin(e, 'superadmin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="superadmin@company.com"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      className="h-11"
                    />
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
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-admin">Email</Label>
                    <Input
                      id="email-admin"
                      type="email"
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-admin">Password</Label>
                    <Input
                      id="password-admin"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      className="h-11"
                    />
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
                </form>
              </TabsContent>

              <TabsContent value="customer">
                <form onSubmit={(e) => handleLogin(e, 'customer')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-customer">Email</Label>
                    <Input
                      id="email-customer"
                      type="email"
                      placeholder="customer@company.com"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-customer">Password</Label>
                    <Input
                      id="password-customer"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      className="h-11"
                    />
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