import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Lock, AlertCircle, ChevronDown, Building2 } from 'lucide-react';

interface CustomerSearchCompaniesProps {
  isPaid: boolean;
  setActiveTab: (tab: string) => void;
}

export default function CustomerSearchCompanies({ isPaid, setActiveTab }: CustomerSearchCompaniesProps) {
  const [filters, setFilters] = useState({
    companyName: '',
    industry: '',
    location: '',
    revenue: '',
    employeeSize: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  const resetFilters = () => {
    setFilters({
      companyName: '',
      industry: '',
      location: '',
      revenue: '',
      employeeSize: '',
    });
  };

  // Mock company data
  const companies = [
    {
      id: 1,
      companyName: 'Tech Solutions Inc',
      phone: '+1 (555) 100-0001',
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      website: 'www.techsolutions.com',
      revenue: '$50M - $100M',
      employeeSize: '500-1000',
      industry: 'Technology',
      companyLinkedIn: 'linkedin.com/company/tech-solutions',
      technology: 'Salesforce, AWS, React',
    },
    {
      id: 2,
      companyName: 'Digital Marketing Co',
      phone: '+1 (555) 200-0002',
      address: '456 Marketing Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      website: 'www.digitalmarketing.com',
      revenue: '$10M - $50M',
      employeeSize: '200-500',
      industry: 'Marketing',
      companyLinkedIn: 'linkedin.com/company/digital-marketing',
      technology: 'HubSpot, Google Analytics',
    },
    {
      id: 3,
      companyName: 'Innovation Labs',
      phone: '+1 (555) 300-0003',
      address: '789 Innovation Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      website: 'www.innovationlabs.com',
      revenue: '$100M - $500M',
      employeeSize: '1000-5000',
      industry: 'Technology',
      companyLinkedIn: 'linkedin.com/company/innovation-labs',
      technology: 'Azure, Docker, Kubernetes',
    },
    {
      id: 4,
      companyName: 'Capital Financial',
      phone: '+1 (555) 400-0004',
      address: '321 Finance Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      website: 'www.capitalfinancial.com',
      revenue: '$500M - $1B',
      employeeSize: '5000-10000',
      industry: 'Finance',
      companyLinkedIn: 'linkedin.com/company/capital-financial',
      technology: 'Bloomberg Terminal, SAP',
    },
    {
      id: 5,
      companyName: 'Global Logistics',
      phone: '+1 (555) 500-0005',
      address: '654 Logistics Ln',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      website: 'www.globallogistics.com',
      revenue: '$1B+',
      employeeSize: '10000+',
      industry: 'Logistics',
      companyLinkedIn: 'linkedin.com/company/global-logistics',
      technology: 'Oracle, SAP, Workday',
    },
  ];

  // Free users see first 10 companies, paid users see all
  const visibleCompanies = isPaid ? companies : companies.slice(0, 10);
  const showPaywall = !isPaid && companies.length > 10;
  const hasNoResults = visibleCompanies.length === 0;

  const handleDownload = (companyId: number) => {
    if (!isPaid) return;
    console.log('Downloading company:', companyId);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#030000]">Company Search Filters</h1>
            <p className="text-gray-600 mt-1">Find and explore companies from our database</p>
          </div>
        </div>
      </div>

      {/* Filter Bar - Sticky */}
      <div className={`sticky top-[97px] z-10 bg-white border-b border-gray-200 px-8 py-4 shadow-sm transition-all duration-300 ${
        showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by company name, industry, or location..."
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent shadow-sm"
            />
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Company Name"
              value={filters.companyName}
              onChange={(e: { target: { value: string } }) => setFilters({ ...filters, companyName: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent shadow-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={filters.industry}
              onChange={(e: { target: { value: string } }) => setFilters({ ...filters, industry: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="logistics">Logistics</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <select
              value={filters.location}
              onChange={(e: { target: { value: string } }) => setFilters({ ...filters, location: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">Location</option>
              <option value="ca">California</option>
              <option value="ny">New York</option>
              <option value="tx">Texas</option>
              <option value="il">Illinois</option>
              <option value="fl">Florida</option>
              <option value="wa">Washington</option>
              <option value="ma">Massachusetts</option>
              <option value="co">Colorado</option>
              <option value="ga">Georgia</option>
              <option value="or">Oregon</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <select
              value={filters.employeeSize}
              onChange={(e: { target: { value: string } }) => setFilters({ ...filters, employeeSize: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">Employee Size</option>
              <option value="1-50">1-50</option>
              <option value="50-100">50-100</option>
              <option value="100-250">100-250</option>
              <option value="250-500">250-500</option>
              <option value="500-1000">500-1000</option>
              <option value="1000-5000">1000-5000</option>
              <option value="5000-10000">5000-10000</option>
              <option value="10000+">10000+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
          
          <div className="relative">
            <select
              value={filters.revenue}
              onChange={(e: { target: { value: string } }) => setFilters({ ...filters, revenue: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">All Revenue</option>
              <option value="0-10m">$0 - $10M</option>
              <option value="10m-50m">$10M - $50M</option>
              <option value="50m-100m">$50M - $100M</option>
              <option value="100m-500m">$100M - $500M</option>
              <option value="500m-1b">$500M - $1B</option>
              <option value="1b+">$1B+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
          
          <button className="px-6 py-3.5 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all shadow-sm flex items-center gap-2">
            <Filter size={18} />
            Apply Filters
          </button>

          <button 
            onClick={resetFilters}
            className="text-gray-600 hover:text-[#EF8037] transition-colors underline text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Results Header */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <p className="text-[#030000]">Search Results</p>
                <p className="text-gray-600 text-sm">
                  Showing <span className="text-[#EF8037]">{visibleCompanies.length}</span> of <span className="text-[#030000]">{companies.length}</span> companies
                </p>
              </div>
            </div>
            {!isPaid && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 px-5 py-3 rounded-xl border border-red-200">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="text-[#EB432F]" size={18} />
                </div>
                <div>
                  <p className="text-[#EB432F] text-sm">Free Preview Mode</p>
                  <p className="text-gray-600 text-xs">Limited to 10 companies</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {hasNoResults && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-gray-400" size={32} />
            </div>
            <h3 className="text-[#030000] mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">Try fewer filters or contact us for a custom dataset.</p>
            <button 
              onClick={resetFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Desktop Table View - Hidden on Mobile */}
        {!hasNoResults && (
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left px-6 py-4 text-gray-700">Company Name</th>
                  <th className="text-left px-6 py-4 text-gray-700">Phone</th>
                  <th className="text-left px-6 py-4 text-gray-700">Location</th>
                  <th className="text-left px-6 py-4 text-gray-700">Website</th>
                  <th className="text-left px-6 py-4 text-gray-700">Revenue</th>
                  <th className="text-left px-6 py-4 text-gray-700">Employee Size</th>
                  <th className="text-left px-6 py-4 text-gray-700">Industry</th>
                  <th className="text-left px-6 py-4 text-gray-700">Technology</th>
                  <th className="text-left px-6 py-4 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCompanies.map((company, index) => (
                  <tr
                    key={company.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                    style={{
                      animation: `slideInRow 0.3s ease-out ${index * 0.03}s both`
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[#030000]">{company.companyName}</p>
                        <p className="text-gray-500 text-sm">{company.city}, {company.state}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isPaid ? (
                        <span className="text-gray-700 text-sm">{company.phone}</span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <Lock className="text-gray-500" size={14} />
                          <span className="text-gray-400 blur-[4px] select-none pointer-events-none text-sm">{company.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-700 text-sm">{company.address}</p>
                        <p className="text-gray-500 text-sm">{company.zipCode}, {company.country}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isPaid ? (
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm hover:underline">
                          {company.website}
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <Lock className="text-gray-500" size={14} />
                          <span className="text-gray-400 blur-[4px] select-none pointer-events-none text-sm">{company.website}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 text-sm">{company.revenue}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 text-sm">{company.employeeSize}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 text-sm">{company.industry}</span>
                    </td>
                    <td className="px-6 py-4">
                      {isPaid ? (
                        <span className="text-gray-700 text-sm">{company.technology}</span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <Lock className="text-gray-500" size={14} />
                          <span className="text-gray-400 blur-[4px] select-none pointer-events-none text-sm">{company.technology}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(company.id)}
                          className={`p-2.5 rounded-lg transition-all ${
                            isPaid
                              ? 'bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white hover:shadow-lg'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!isPaid}
                          title={isPaid ? 'Download' : 'Locked'}
                        >
                          {isPaid ? <Download size={16} /> : <Lock size={16} />}
                        </button>
                        <button 
                          className="p-2.5 border border-gray-300 rounded-lg hover:border-[#EF8037] hover:bg-orange-50 transition-all"
                          title="View Details"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        )}

        {/* Mobile Card View - Visible Only on Mobile */}
        {!hasNoResults && (
        <div className="lg:hidden space-y-4">
          {visibleCompanies.map((company, index) => (
            <div
              key={company.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all"
              style={{
                animation: `slideUp 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {/* Company Header */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Building2 size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#030000] truncate mb-1">{company.companyName}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {company.city}, {company.state}
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-md">
                    {company.industry}
                  </span>
                </div>
              </div>

              {/* Company Details Grid */}
              <div className="space-y-3 mb-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    {isPaid ? (
                      <p className="text-gray-700 text-sm">{company.phone}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="text-gray-500" size={14} />
                        <span className="text-gray-400 blur-[4px] select-none text-sm">{company.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Full Address</p>
                    <p className="text-gray-700 text-sm">{company.address}</p>
                    <p className="text-gray-500 text-xs">{company.zipCode}, {company.country}</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    {isPaid ? (
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline break-all">
                        {company.website}
                      </a>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="text-gray-500" size={14} />
                        <span className="text-gray-400 blur-[4px] select-none text-sm break-all">{company.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue & Employees Row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Revenue</p>
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-md">
                        {company.revenue}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Employees</p>
                      <p className="text-gray-700 text-sm">{company.employeeSize}</p>
                    </div>
                  </div>
                </div>

                {/* Technology */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Technology Stack</p>
                    {isPaid ? (
                      <p className="text-gray-700 text-sm">{company.technology}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="text-gray-500" size={14} />
                        <span className="text-gray-400 blur-[4px] select-none text-sm">{company.technology}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDownload(company.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    isPaid
                      ? 'bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isPaid}
                >
                  {isPaid ? <Download size={16} /> : <Lock size={16} />}
                  <span className="text-sm">{isPaid ? 'Download' : 'Locked'}</span>
                </button>
                <button className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-[#EF8037] hover:bg-orange-50 transition-all">
                  <Eye size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        )}

        {/* Paywall Banner - Enhanced Sticky */}
        {showPaywall && (
          <div className="mt-8 sticky bottom-0 z-10">
            <div className="bg-gradient-to-r from-[#FFF3EC] to-[#FFE8DC] border-2 border-[#EF8037] rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center shadow-lg">
                    <Lock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-[#030000] mb-1">You've reached your 10 free companies</h3>
                    <p className="text-gray-700 text-sm">Upgrade now to unlock full company details and access our complete database of {companies.length}+ companies</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('payment')}
                  className="group px-8 py-4 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 shadow-lg"
                >
                  <span>Pay Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRow {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
