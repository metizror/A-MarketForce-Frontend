import React from 'react';
import { Download, Calendar, FileText, Search, Trash2, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function CustomerDownloads() {
  const downloads = [
    {
      id: 1,
      fileName: 'Tech_Industry_Contacts_Oct_2025.csv',
      date: 'Oct 10, 2025',
      contacts: 50,
      size: '2.4 MB',
      status: 'Completed',
      type: 'csv',
    },
    {
      id: 2,
      fileName: 'Finance_VP_Contacts_Oct_2025.xlsx',
      date: 'Oct 8, 2025',
      contacts: 100,
      size: '4.8 MB',
      status: 'Completed',
      type: 'xlsx',
    },
    {
      id: 3,
      fileName: 'Marketing_Directors_Sep_2025.csv',
      date: 'Sep 28, 2025',
      contacts: 75,
      size: '3.2 MB',
      status: 'Completed',
      type: 'csv',
    },
    {
      id: 4,
      fileName: 'Sales_Leaders_Sep_2025.xlsx',
      date: 'Sep 15, 2025',
      contacts: 120,
      size: '5.6 MB',
      status: 'Completed',
      type: 'xlsx',
    },
    {
      id: 5,
      fileName: 'HR_Executives_Sep_2025.csv',
      date: 'Sep 10, 2025',
      contacts: 60,
      size: '2.8 MB',
      status: 'Completed',
      type: 'csv',
    },
    {
      id: 6,
      fileName: 'Technology_CTOs_Aug_2025.xlsx',
      date: 'Aug 25, 2025',
      contacts: 90,
      size: '4.2 MB',
      status: 'Completed',
      type: 'xlsx',
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#030000]">My Downloads</h1>
            <p className="text-gray-600 mt-1">Access and manage your downloaded contact files</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search downloads..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Downloads</p>
                  <p className="text-[#030000] text-2xl">{downloads.length}</p>
                  <p className="text-gray-500 text-xs">files stored</p>
                </div>
              </div>
              <TrendingUp className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity" size={32} />
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Download className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Contacts</p>
                  <p className="text-[#030000] text-2xl">{downloads.reduce((sum, d) => sum + d.contacts, 0)}</p>
                  <p className="text-gray-500 text-xs">contacts downloaded</p>
                </div>
              </div>
              <TrendingUp className="text-green-500 opacity-20 group-hover:opacity-40 transition-opacity" size={32} />
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Last Download</p>
                  <p className="text-[#030000] text-2xl">{downloads[0].date.split(',')[0]}</p>
                  <p className="text-gray-500 text-xs">{downloads[0].date.split(' ')[2]}</p>
                </div>
              </div>
              <Clock className="text-purple-500 opacity-20 group-hover:opacity-40 transition-opacity" size={32} />
            </div>
          </div>
        </div>

        {/* Downloads Grid - Card Style Instead of Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#030000]">Recent Downloads</h2>
            <button 
              onClick={() => window.location.hash = 'all-downloads'}
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#EF8037] transition-colors flex items-center gap-2"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#EF8037]/30 transition-all relative overflow-hidden"
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EF8037]/5 to-[#EB432F]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative flex items-start gap-4">
                  {/* File Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EF8037]/20 to-[#EB432F]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative">
                    <FileText className="text-[#EF8037]" size={28} />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="text-white" size={14} />
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-[#030000] truncate group-hover:text-[#EF8037] transition-colors mb-1">
                          {download.fileName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {download.date}
                          </span>
                          <span>•</span>
                          <span>{download.size}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wide ${
                        download.type === 'csv' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {download.type}
                      </span>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Download size={14} className="text-gray-600" />
                        <span className="text-sm text-[#030000]">{download.contacts} contacts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">{download.status}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button className="flex-1 group/btn px-4 py-2.5 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                        <Download size={16} className="relative z-10" />
                        <span className="relative z-10">Download Again</span>
                      </button>
                      <button className="p-2.5 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group/del">
                        <Trash2 size={16} className="text-gray-600 group-hover/del:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card - Enhanced */}
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-xl">
              <FileText className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#030000] mb-2">📦 Download History & Storage</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    All your downloaded files are <span className="text-blue-600 px-2 py-0.5 bg-blue-100 rounded">securely stored for 1 day (24 hours)</span>. After that, they will be automatically removed from our servers to ensure your privacy.
                  </p>
                  <div className="flex items-start gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-700 text-sm">
                      <strong>Need to re-download?</strong> Simply go to Search Contacts and download again at no extra cost. Your credits won't be deducted twice!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
