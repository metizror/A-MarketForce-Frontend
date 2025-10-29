import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../App';
import { Shield, Users, UserCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { CustomerRegistration } from './CustomerRegistration';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('superadmin');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = (e: React.FormEvent, role: 'superadmin' | 'admin' | 'customer') => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Mock authentication
    const mockUser: User = {
      id: role === 'superadmin' ? '1' : role === 'admin' ? '2' : '3',
      email,
      name: role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin User' : 'John Doe',
      role
    };

    toast.success(`Welcome back, ${mockUser.name}!`);
    onLogin(mockUser);
  };

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    setActiveTab('customer');
    toast.success('Registration complete! Please log in with your credentials.');
  };

  if (showRegistration) {
    return <CustomerRegistration onRegistrationComplete={handleRegistrationComplete} onBackToLogin={() => setShowRegistration(false)} />;
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    style={{ backgroundColor: '#EF8037' }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Login as Super Admin
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    style={{ backgroundColor: '#EB432F' }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Login as Admin
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    style={{ backgroundColor: '#EF8037' }}
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Login as Customer
                  </Button>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      New to aMFAccess? Pay only for what you download.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowRegistration(true)}
                    >
                      Create Customer Account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div><strong>Super Admin:</strong> Any email/password</div>
                <div><strong>Admin:</strong> Any email/password</div>
                <div><strong>Customer:</strong> Any email/password</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}