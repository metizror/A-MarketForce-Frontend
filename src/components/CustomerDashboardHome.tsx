import React from 'react';
import { Users, Download, CreditCard, Calendar, TrendingUp, Clock } from 'lucide-react';

interface CustomerDashboardHomeProps {
  userName: string;
  setActiveTab: (tab: string) => void;
}

export default function CustomerDashboardHome({ userName, setActiveTab }: CustomerDashboardHomeProps) {
  const stats = [
    {
      title: 'Contacts Downloaded',
      value: '2,450',
      icon: Download,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Payment Status',
      value: 'Active',
      icon: CreditCard,
      gradient: 'from-[#EF8037] to-[#EB432F]',
      bgGradient: 'from-orange-50 to-red-50',
    },
    {
      title: 'Last Invoice Date',
      value: 'Oct 1, 2025',
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  const recentActivity = [
    { action: 'Downloaded 50 contacts from Tech Industry', time: '2 hours ago', icon: Download },
    { action: 'Payment processed successfully', time: '1 day ago', icon: CreditCard },
    { action: 'Invoice #INV-2025-1001 generated', time: '1 day ago', icon: Calendar },
    { action: 'Downloaded 100 contacts from Finance Industry', time: '3 days ago', icon: Download },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#030000]">Welcome back, {userName}! 👋</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('search')}
              className="px-6 py-3 bg-[#EF8037] text-white rounded-xl hover:bg-[#EF8037]/90 transition-colors shadow-lg shadow-orange-200"
            >
              Search Contacts
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className="px-6 py-3 bg-white border border-gray-300 text-[#030000] rounded-xl hover:bg-gray-50 transition-colors"
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden cursor-pointer"
                style={{
                  animation: `slideUp 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Decorative Circle */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <TrendingUp className="text-green-500" size={18} />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                  <p className="text-[#030000] text-2xl group-hover:text-3xl transition-all duration-300">{stat.value}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-700 group-hover:w-full`}
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Enhanced */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <h2 className="text-[#030000]">Recent Activity</h2>
                </div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                  Live
                </div>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div 
                      key={index} 
                      className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-300 border border-transparent hover:border-orange-200"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-orange-100 group-hover:to-red-100 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <Icon className="text-gray-600 group-hover:text-[#EF8037] transition-colors duration-300" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#030000] mb-1 group-hover:text-[#EF8037] transition-colors duration-300">{activity.action}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock size={14} />
                            <span className="text-sm">{activity.time}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">Just now</span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 text-[#EF8037]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions - Enhanced */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-[#030000]">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('search-contacts')}
                  className="group w-full px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-[#030000] rounded-xl transition-all duration-300 text-left border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                      <Users className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Contact Search</p>
                      <p className="text-xs text-gray-600">Find contacts instantly</p>
                    </div>
                    <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('downloads')}
                  className="group w-full px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-[#030000] rounded-xl transition-all duration-300 text-left border-2 border-green-100 hover:border-green-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                      <Download className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">My Downloads</p>
                      <p className="text-xs text-gray-600">Access your files</p>
                    </div>
                    <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('payment')}
                  className="group w-full px-5 py-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 text-[#030000] rounded-xl transition-all duration-300 text-left border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Make Payment</p>
                      <p className="text-xs text-gray-600">Manage billing</p>
                    </div>
                    <svg className="w-5 h-5 text-[#EF8037] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="group w-full px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-[#030000] rounded-xl transition-all duration-300 text-left border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Invoices</p>
                      <p className="text-xs text-gray-600">View history</p>
                    </div>
                    <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary */}

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>

      </div>
    </div>
  );
}
