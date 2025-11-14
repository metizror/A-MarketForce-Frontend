import React, { useState } from 'react';
import { User, Lock, Bell, CreditCard, Shield, Globe, Trash2, Save, Upload, Camera, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { PasswordInput } from './ui/password-input';

export default function CustomerSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRequestSent, setDeleteRequestSent] = useState(false);

  const handleDeleteRequest = () => {
    // Send delete request to Owner
    console.log('Delete account request sent to Owner');
    setDeleteRequestSent(true);
    setShowDeleteConfirm(false);
    // In real implementation, this would make an API call
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'security', label: 'Security', icon: Lock, gradient: 'from-green-500 to-emerald-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, gradient: 'from-purple-500 to-pink-500' },
    { id: 'billing', label: 'Billing', icon: CreditCard, gradient: 'from-orange-500 to-red-500' },
    { id: 'privacy', label: 'Privacy', icon: Shield, gradient: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <h1 className="text-[#030000]">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation - Enhanced */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
            <div className="mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Settings Menu</p>
            </div>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
                    )}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center relative z-10 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon size={18} className={isActive ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <span className="relative z-10">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'profile' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                      <h2 className="text-[#030000]">Profile Information</h2>
                    </div>
                    
                    <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-200">
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center text-white text-3xl shadow-xl group-hover:scale-105 transition-transform">
                          JD
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                          <Camera className="text-white" size={18} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[#030000] mb-2">John Doe</h3>
                        <p className="text-gray-600 mb-4">john.doe@example.com</p>
                        <div className="flex gap-3">
                          <button className="px-5 py-2.5 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                            <Upload size={16} />
                            Upload Photo
                          </button>
                          <button className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          defaultValue="john.doe@example.com"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          defaultValue="Acme Corporation"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Job Title</label>
                        <input
                          type="text"
                          defaultValue="Sales Director"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button className="mt-6 px-8 py-4 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2">
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'security' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Lock className="text-white" size={20} />
                      </div>
                      <h2 className="text-[#030000]">Change Password</h2>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Current Password</label>
                        <PasswordInput
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">New Password</label>
                        <PasswordInput
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                        <PasswordInput
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button className="mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Shield className="text-white" size={20} />
                    </div>
                    <h2 className="text-[#030000]">Two-Factor Authentication</h2>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Shield className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-[#030000] mb-1">Enable 2FA Protection</p>
                        <p className="text-gray-700 text-sm">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#EF8037] peer-checked:to-[#EB432F]"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Globe className="text-white" size={20} />
                    </div>
                    <h2 className="text-[#030000]">Active Sessions</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="group flex items-center justify-between p-5 border-2 border-green-200 bg-green-50 rounded-xl hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                          <Globe className="text-green-600" size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[#030000]">Chrome on MacOS</p>
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              Active
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">📍 San Francisco, CA • Current session</p>
                        </div>
                      </div>
                      <CheckCircle className="text-green-600" size={24} />
                    </div>

                    <div className="group flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Globe className="text-gray-600" size={24} />
                        </div>
                        <div>
                          <p className="text-[#030000] mb-1">Safari on iPhone</p>
                          <p className="text-gray-600 text-sm">📍 New York, NY • 2 days ago</p>
                        </div>
                      </div>
                      <button className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-200 hover:border-red-300">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bell className="text-white" size={20} />
                    </div>
                    <h2 className="text-[#030000]">Notification Preferences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Email Notifications', desc: 'Receive email updates about your account', checked: true },
                      { title: 'Payment Reminders', desc: 'Get notified before your next billing date', checked: true },
                      { title: 'Download Notifications', desc: 'Get notified when your downloads are ready', checked: true },
                      { title: 'Product Updates', desc: 'Receive updates about new features and improvements', checked: false },
                      { title: 'Marketing Emails', desc: 'Receive promotional offers and newsletters', checked: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="text-[#030000] mb-1">{item.title}</p>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full blur-3xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center">
                        <CreditCard className="text-white" size={20} />
                      </div>
                      <h2 className="text-[#030000]">Billing Address</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          defaultValue="123 Main Street"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          defaultValue="San Francisco"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          defaultValue="CA"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          defaultValue="94102"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          defaultValue="United States"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button className="mt-6 px-8 py-4 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all">
                      Update Address
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-[#030000] mb-6">Auto-Renewal</h2>
                  
                  <div className="flex items-center justify-between p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={24} />
                      </div>
                      <div>
                        <p className="text-[#030000] mb-1">Automatic Subscription Renewal</p>
                        <p className="text-gray-700 text-sm">Your subscription will automatically renew on the billing date</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'privacy' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                      <Shield className="text-white" size={20} />
                    </div>
                    <h2 className="text-[#030000]">Data & Privacy</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <h3 className="text-[#030000] mb-2 flex items-center gap-2">
                        <Download size={18} className="text-blue-600" />
                        Download Your Data
                      </h3>
                      <p className="text-gray-700 mb-4 text-sm">Request a copy of all your personal data stored in our system</p>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                        Request Data Export
                      </button>
                    </div>

                    <div className="p-6 bg-red-50 rounded-xl border-2 border-red-200">
                      <h3 className="text-[#030000] mb-2 flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-600" />
                        Delete Account
                      </h3>
                      <p className="text-gray-700 mb-4 text-sm">Request account deletion. Your request will be sent to the Owner for review and approval.</p>
                      {deleteRequestSent ? (
                        <div className="px-6 py-3 bg-green-100 text-green-700 rounded-xl border-2 border-green-300 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Request sent to Owner
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={18} />
                          Request Account Deletion
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-300 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="text-yellow-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-[#030000] mb-2">🔒 Privacy Notice</h3>
                      <p className="text-gray-800 leading-relaxed">
                        We take your privacy seriously. All your data is encrypted and stored securely using industry-standard protocols. We never share your personal information with third parties without your explicit consent. Your data is yours.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h3 className="text-[#030000] text-center mb-2">Request Account Deletion?</h3>
            <p className="text-gray-600 text-center mb-6">
              Your deletion request will be sent to the Owner for review. You'll be notified once your request has been processed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
