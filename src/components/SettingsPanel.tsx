import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Settings, Shield, Users, Bell, Key } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner';

interface SettingsPanelProps {
  user: User;
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    importAlerts: true,
    exportAlerts: false,
    weeklyReports: true
  });

  const handleProfileUpdate = () => {
    if (!profile.name || !profile.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Profile updated successfully');
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
            background: user.role === 'superadmin' 
              ? 'linear-gradient(135deg, #FFF5E6 0%, #FFE5CC 50%, #FFDBB8 100%)'
              : 'linear-gradient(135deg, #FFE5E5 0%, #FFD6D6 50%, #FFC7C7 100%)'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20" 
            style={{ 
              background: `radial-gradient(circle, ${user.role === 'superadmin' ? '#EF8037' : '#EB432F'} 0%, transparent 70%)`
            }}
          ></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${user.role === 'superadmin' ? '#EF8037' : '#EB432F'} 0%, transparent 70%)`
            }}
          ></div>
          
          {/* Icon Badge */}
          <div className="absolute bottom-4 left-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ 
                background: user.role === 'superadmin' 
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
              variant={user.role === 'superadmin' ? 'default' : 'secondary'}
              className="px-3 py-1"
            >
              {user.role === 'superadmin' && <Shield className="w-3 h-3 mr-1" />}
              {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden group"
              style={{ 
                background: user.role === 'superadmin' 
                  ? 'linear-gradient(135deg, #EF8037 0%, #FF9F5A 100%)'
                  : 'linear-gradient(135deg, #EB432F 0%, #FF5A47 100%)'
              }}
            >
              <span className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center space-x-2 mb-4">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                background: user.role === 'superadmin' 
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
              className="shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                background: user.role === 'superadmin' 
                  ? 'linear-gradient(135deg, #EF8037 0%, #FF9F5A 100%)'
                  : 'linear-gradient(135deg, #EB432F 0%, #FF5A47 100%)'
              }}
            >
              Update Profile
            </Button>
          </div>
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
              onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
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
              onCheckedChange={(checked) => setNotifications({...notifications, importAlerts: checked})}
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
              onCheckedChange={(checked) => setNotifications({...notifications, exportAlerts: checked})}
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
              onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
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