import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Calendar, DollarSign, CheckCircle, TrendingUp, CreditCard, ChevronRight } from 'lucide-react';

export default function CustomerInvoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const invoices = [
    {
      id: 'INV-2025-1010',
      date: 'Oct 10, 2025',
      amount: '$273.90',
      plan: 'Premium Plan',
      status: 'Paid',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: 'INV-2025-1001',
      date: 'Oct 1, 2025',
      amount: '$273.90',
      plan: 'Premium Plan',
      status: 'Paid',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: 'INV-2025-0901',
      date: 'Sep 1, 2025',
      amount: '$273.90',
      plan: 'Premium Plan',
      status: 'Paid',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: 'INV-2025-0801',
      date: 'Aug 1, 2025',
      amount: '$273.90',
      plan: 'Premium Plan',
      status: 'Paid',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: 'INV-2025-0701',
      date: 'Jul 1, 2025',
      amount: '$108.90',
      plan: 'Starter Plan',
      status: 'Paid',
      paymentMethod: 'Visa ****4242',
    },
    {
      id: 'INV-2025-0601',
      date: 'Jun 1, 2025',
      amount: '$108.90',
      plan: 'Starter Plan',
      status: 'Paid',
      paymentMethod: 'Visa ****4242',
    },
  ];

  const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '')), 0);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#030000]">Invoices & Payment History</h1>
            <p className="text-gray-600 mt-1">Track all your billing and payment transactions</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
            <Download size={18} />
            Export All
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="text-white" size={20} />
                </div>
                <TrendingUp className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity" size={20} />
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Invoices</p>
              <p className="text-[#030000] text-2xl">{invoices.length}</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="text-white" size={20} />
                </div>
                <TrendingUp className="text-green-500 opacity-20 group-hover:opacity-40 transition-opacity" size={20} />
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Paid</p>
              <p className="text-[#030000] text-2xl">${totalPaid.toFixed(2)}</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="text-white" size={20} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Last Payment</p>
              <p className="text-[#030000] text-xl">{invoices[0].date}</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="text-white" size={20} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Payment Status</p>
              <div className="text-green-600 text-xl flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All Paid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search - Enhanced */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search invoices by ID, amount, or date..."
                value={searchTerm}
                onChange={(e: { target: { value: string } }) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e: { target: { value: string } }) => setFilterStatus(e.target.value)}
              className="px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button className="px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center gap-2 border border-gray-200">
              <Filter size={18} />
              More Filters
            </button>
          </div>
        </div>

        {/* Invoices Cards - Modern Card Design Instead of Table */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#030000]">Recent Invoices</h2>
            <p className="text-gray-600 text-sm">{invoices.length} total invoices</p>
          </div>

          {invoices.map((invoice, index) => (
            <div
              key={invoice.id}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#EF8037]/30 transition-all relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#EF8037]/5 to-[#EB432F]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative flex items-center justify-between">
                {/* Left Section - Invoice Info */}
                <div className="flex items-center gap-6 flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EF8037]/20 to-[#EB432F]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="text-[#EF8037]" size={24} />
                  </div>

                  {/* Invoice Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[#030000] group-hover:text-[#EF8037] transition-colors">
                        {invoice.id}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle size={12} />
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {invoice.date}
                      </span>
                      <span>•</span>
                      <span>{invoice.plan}</span>
                      <span>•</span>
                      <span className="flex items-center gap-2">
                        <CreditCard size={14} />
                        {invoice.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Amount & Actions */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-gray-600 text-sm mb-1">Amount Paid</p>
                    <p className="text-[#030000] text-2xl">{invoice.amount}</p>
                  </div>
                  
                  <button className="group/btn px-6 py-3 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                    <Download size={16} className="relative z-10" />
                    <span className="relative z-10">Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Billing Information - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
                <h3 className="text-[#030000]">Billing Information</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Name</span>
                  <span className="text-[#030000]">John Doe</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Email</span>
                  <span className="text-[#030000]">john.doe@example.com</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Company</span>
                  <span className="text-[#030000]">Acme Corporation</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">VAT Number</span>
                  <span className="text-[#030000]">US123456789</span>
                </div>
              </div>

              <button className="w-full py-3.5 border-2 border-gray-200 text-[#030000] rounded-xl hover:border-[#EF8037] hover:bg-orange-50 transition-all flex items-center justify-center gap-2 group">
                <span>Update Billing Info</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <CreditCard className="text-white" size={20} />
                </div>
                <h3 className="text-[#030000]">Payment Method</h3>
              </div>
              
              <div className="p-5 border-2 border-gray-200 rounded-xl mb-6 hover:border-purple-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">💳</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#030000] mb-1">Visa ending in 4242</p>
                    <p className="text-gray-600 text-sm">Expires 12/2026</p>
                  </div>
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
                    <CheckCircle size={14} />
                    Default
                  </span>
                </div>
              </div>

              <button className="w-full py-3.5 border-2 border-gray-200 text-[#030000] rounded-xl hover:border-[#EF8037] hover:bg-orange-50 transition-all flex items-center justify-center gap-2 group">
                <span>Update Payment Method</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Billing - Premium Design */}
        <div className="bg-gradient-to-br from-[#EF8037] to-[#EB432F] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                <Calendar className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-white mb-2">Next Billing Date</h3>
                <p className="text-white/90 mb-1">
                  <span className="text-white px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">November 1, 2025</span>
                </p>
                <p className="text-white/90">You will be charged <span className="text-white">$273.90</span> for Premium Plan</p>
              </div>
            </div>
            <div className="text-right">
              <div className="px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <div className="text-white/80 text-sm mb-1">Auto-renewal</div>
                <div className="text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Enabled
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
