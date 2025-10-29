import React from 'react';
import { Home, Search, Download, CreditCard, FileText, Settings, LogOut, Menu, X, MessageCircle } from 'lucide-react';

interface CustomerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onSupportClick: () => void;
}

export default function CustomerSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, onSupportClick }: CustomerSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'search-contacts', label: 'Contact Search Filters', icon: Search },
    { id: 'search-companies', label: 'Company Search Filters', icon: Search },
    { id: 'downloads', label: 'My Downloads', icon: Download },
    { id: 'payment', label: 'Make Payment', icon: CreditCard },
    { id: 'invoices', label: 'Invoices & History', icon: FileText },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const supportItem = { id: 'support', label: 'Support', icon: MessageCircle };

  return (
    <div 
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center">
              <span className="text-white">C</span>
            </div>
            <span className="text-[#030000]">Customer Portal</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#EF8037] text-white shadow-lg shadow-orange-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Support & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onSupportClick}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all`}
        >
          <MessageCircle size={20} />
          {!isCollapsed && <span>Support</span>}
        </button>
        <button
          onClick={() => {
            // Handle logout
            window.location.href = '/';
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
