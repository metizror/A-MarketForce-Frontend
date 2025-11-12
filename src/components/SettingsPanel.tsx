import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Settings, Shield, Users, Bell, Key } from 'lucide-react';
import type { User } from '@/types/dashboard.types';
import { toast } from 'sonner';
import { privateApiCall, privateApiPost } from '@/lib/api';

interface SettingsPanelProps {
  user: User;
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [currentUser, setCurrentUser] = useState<User>(user);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user data from API on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await privateApiCall<{ admin: any }>('/auth/me');
        
        if (response.admin) {
          const adminData = response.admin;
          const fetchedUser: User = {
            id: adminData._id || adminData.id,
            name: adminData.name || '',
            email: adminData.email || '',
            role: adminData.role || 'admin'
          };
          
          setCurrentUser(fetchedUser);
          setProfile({
            name: adminData.name || '',
            email: adminData.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);
        toast.error(error.message || 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    importAlerts: true,
    exportAlerts: false,
    weeklyReports: true
  });

  const handleProfileUpdate = async () => {
    if (!profile.name) {
      toast.error('Please fill in your full name');
      return;
    }

    // Validate password fields if new password is provided
    if (profile.newPassword) {
      if (!profile.currentPassword) {
        toast.error('Please enter your current password');
        return;
      }

      if (profile.newPassword !== profile.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (profile.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long');
        return;
      }
    }

    setIsUpdating(true);

    try {
      // Prepare request data according to API format
      const requestData: any = {
        data: {
          fullName: profile.name
        }
      };

      // Add password fields if new password is provided
      if (profile.newPassword) {
        requestData.data.password = profile.currentPassword;
        requestData.data.newPassword = profile.newPassword;
      }

      // Make API call
      const response = await privateApiPost<{ message: string; admin?: any }>(
        '/auth/me',
        requestData
      );

      // Show success message
      toast.success(response.message || 'Profile updated successfully');

      // Refresh user data after successful update
      if (response.admin) {
        const adminData = response.admin;
        const updatedUser: User = {
          id: adminData._id || adminData.id,
          name: adminData.name || '',
          email: adminData.email || '',
          role: adminData.role || currentUser.role || 'admin'
        };
        setCurrentUser(updatedUser);
        setProfile({
          ...profile,
          name: adminData.name || profile.name,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        // Clear password fields after successful update
        if (profile.newPassword) {
          setProfile({
            ...profile,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationUpdate = () => {
    toast.success('Notification preferences updated');
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Settings */}
      <Card className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Gradient Header */}
        <div 
          className="h-24 relative overflow-hidden"
          style={{
            background: currentUser.role === 'superadmin' 
              ? 'linear-gradient(135deg, #FFF5E6 0%, #FFE5CC 50%, #FFDBB8 100%)'
              : 'linear-gradient(135deg, #FFE5E5 0%, #FFD6D6 50%, #FFC7C7 100%)'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20" 
            style={{ 
              background: `radial-gradient(circle, ${currentUser.role === 'superadmin' ? '#EF8037' : '#EB432F'} 0%, transparent 70%)`
            }}
          ></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${currentUser.role === 'superadmin' ? '#EF8037' : '#EB432F'} 0%, transparent 70%)`
            }}
          ></div>
          
          {/* Icon Badge */}
          <div className="absolute bottom-4 left-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ 
                background: currentUser.role === 'superadmin' 
                  ? 'linear-gradient(135deg, #EF8037 0%, #FF9F5A 100%)'
                  : 'linear-gradient(135deg, #EB432F 0%, #FF5A47 100%)'
              }}
            >
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <CardHeader className="pt-6">
          <CardTitle className="flex items-center justify-between">
            <span>Profile Settings</span>
            <Badge 
              variant={currentUser.role === 'superadmin' ? 'default' : 'secondary'}
              className="px-3 py-1"
            >
              {currentUser.role === 'superadmin' && <Shield className="w-3 h-3 mr-1" />}
              {currentUser.role === 'superadmin' ? 'Super Admin' : 'Admin'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden group"
                  style={{ 
                    background: currentUser.role === 'superadmin' 
                      ? 'linear-gradient(135deg, #EF8037 0%, #FF9F5A 100%)'
                      : 'linear-gradient(135deg, #EB432F 0%, #FF5A47 100%)'
                  }}
                >
                  <span className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110">
                    {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">{currentUser.name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{currentUser.email || ''}</p>
                </div>
              </div>
            </>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e: { target: { value: string } }) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              <Separator className="my-6" />

              <div className="flex items-center space-x-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: currentUser.role === 'superadmin' 
                      ? 'linear-gradient(135deg, #EF8037 0%, #FF9F5A 100%)'
                      : 'linear-gradient(135deg, #EB432F 0%, #FF5A47 100%)'
                  }}
                >
                  <Key className="w-4 h-4 text-white" />
                </div>
                <h4>Change Password</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <PasswordInput
                    id="current-password"
                    value={profile.currentPassword}
                    onChange={(e: any) => setProfile({...profile, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <PasswordInput
                    id="new-password"
                    value={profile.newPassword}
                    onChange={(e: any) => setProfile({...profile, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <PasswordInput
                    id="confirm-password"
                    value={profile.confirmPassword}
                    onChange={(e: any) => setProfile({...profile, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={isUpdating || isLoading}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: currentUser.role === 'superadmin' 
                      ? 'linear-gradient(135deg, #EF8037 0%, #FF9F5A 100%)'
                      : 'linear-gradient(135deg, #EB432F 0%, #FF5A47 100%)'
                  }}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Gradient Header */}
        <div 
          className="h-24 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #E8F5FF 0%, #D6ECFF 50%, #C4E3FF 100%)'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          
          {/* Icon Badge */}
          <div className="absolute bottom-4 left-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-blue-600"
            >
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <CardHeader className="pt-6">
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:border-blue-200 transition-colors duration-300">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked: boolean) => setNotifications({...notifications, emailNotifications: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:border-blue-200 transition-colors duration-300">
            <div>
              <Label htmlFor="import-alerts">Import Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when data imports complete</p>
            </div>
            <Switch
              id="import-alerts"
              checked={notifications.importAlerts}
              onCheckedChange={(checked: boolean) => setNotifications({...notifications, importAlerts: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:border-blue-200 transition-colors duration-300">
            <div>
              <Label htmlFor="export-alerts">Export Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when data exports complete</p>
            </div>
            <Switch
              id="export-alerts"
              checked={notifications.exportAlerts}
              onCheckedChange={(checked: boolean) => setNotifications({...notifications, exportAlerts: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 hover:border-blue-200 transition-colors duration-300">
            <div>
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <p className="text-sm text-gray-600">Receive weekly activity summaries</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={notifications.weeklyReports}
              onCheckedChange={(checked: boolean) => setNotifications({...notifications, weeklyReports: checked})}
            />
          </div>

          <Button onClick={handleNotificationUpdate} variant="outline">
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}