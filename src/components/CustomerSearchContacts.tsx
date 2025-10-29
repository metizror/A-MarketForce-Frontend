import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Lock, AlertCircle, ChevronDown } from 'lucide-react';

interface CustomerSearchContactsProps {
  isPaid: boolean;
  setActiveTab: (tab: string) => void;
}

export default function CustomerSearchContacts({ isPaid, setActiveTab }: CustomerSearchContactsProps) {
  const [filters, setFilters] = useState({
    company: '',
    industry: '',
    location: '',
    role: '',
    jobRole: '',
    jobLevel: '',
    employeeSize: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<'company' | 'jobTitle'>('company');

  const resetFilters = () => {
    setFilters({
      company: '',
      industry: '',
      location: '',
      role: '',
      jobRole: '',
      jobLevel: '',
      employeeSize: '',
    });
  };

  // Mock contact data
  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      title: 'VP of Sales',
      company: 'Tech Solutions Inc',
      industry: 'Technology',
      location: 'San Francisco, CA',
      email: 'john.smith@techsolutions.com',
      phone: '+1 (555) 123-4567',
      jobRole: 'Sales',
      jobLevel: 'VP',
      employeeSize: '500-1000',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      title: 'Marketing Director',
      company: 'Digital Marketing Co',
      industry: 'Marketing',
      location: 'New York, NY',
      email: 'sarah.j@digitalmarketing.com',
      phone: '+1 (555) 234-5678',
      jobRole: 'Marketing',
      jobLevel: 'Director',
      employeeSize: '100-250',
    },
    {
      id: 3,
      name: 'Michael Chen',
      title: 'Chief Technology Officer',
      company: 'Innovation Labs',
      industry: 'Technology',
      location: 'Austin, TX',
      email: 'm.chen@innovationlabs.com',
      phone: '+1 (555) 345-6789',
      jobRole: 'Engineering',
      jobLevel: 'C-Level',
      employeeSize: '1000-5000',
    },
    {
      id: 4,
      name: 'Emily Davis',
      title: 'Head of Finance',
      company: 'Capital Financial',
      industry: 'Finance',
      location: 'Chicago, IL',
      email: 'e.davis@capitalfinancial.com',
      phone: '+1 (555) 456-7890',
      jobRole: 'Finance',
      jobLevel: 'Head',
      employeeSize: '5000-10000',
    },
    {
      id: 5,
      name: 'Robert Martinez',
      title: 'VP of Operations',
      company: 'Global Logistics',
      industry: 'Logistics',
      location: 'Los Angeles, CA',
      email: 'r.martinez@globallogistics.com',
      phone: '+1 (555) 567-8901',
      jobRole: 'Operations',
      jobLevel: 'VP',
      employeeSize: '10000+',
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      title: 'Senior Product Manager',
      company: 'Software Innovations',
      industry: 'Technology',
      location: 'Seattle, WA',
      email: 'l.anderson@softwareinno.com',
      phone: '+1 (555) 678-9012',
      jobRole: 'Product',
      jobLevel: 'Senior',
      employeeSize: '500-1000',
    },
    {
      id: 7,
      name: 'David Wilson',
      title: 'HR Director',
      company: 'People First Inc',
      industry: 'Human Resources',
      location: 'Boston, MA',
      email: 'd.wilson@peoplefirst.com',
      phone: '+1 (555) 789-0123',
      jobRole: 'Human Resources',
      jobLevel: 'Director',
      employeeSize: '200-500',
    },
    {
      id: 8,
      name: 'Jennifer Taylor',
      title: 'Chief Marketing Officer',
      company: 'Brand Builders',
      industry: 'Marketing',
      location: 'Miami, FL',
      email: 'j.taylor@brandbuilders.com',
      phone: '+1 (555) 890-1234',
      jobRole: 'Marketing',
      jobLevel: 'C-Level',
      employeeSize: '100-250',
    },
    {
      id: 9,
      name: 'Christopher Lee',
      title: 'VP of Engineering',
      company: 'Tech Innovators',
      industry: 'Technology',
      location: 'Denver, CO',
      email: 'c.lee@techinnovators.com',
      phone: '+1 (555) 901-2345',
      jobRole: 'Engineering',
      jobLevel: 'VP',
      employeeSize: '500-1000',
    },
    {
      id: 10,
      name: 'Amanda White',
      title: 'Sales Director',
      company: 'Enterprise Solutions',
      industry: 'Technology',
      location: 'Atlanta, GA',
      email: 'a.white@enterprisesol.com',
      phone: '+1 (555) 012-3456',
      jobRole: 'Sales',
      jobLevel: 'Director',
      employeeSize: '1000-5000',
    },
    {
      id: 11,
      name: 'James Brown',
      title: 'CEO',
      company: 'Startup Ventures',
      industry: 'Technology',
      location: 'Portland, OR',
      email: 'j.brown@startupventures.com',
      phone: '+1 (555) 123-4567',
      jobRole: 'Executive',
      jobLevel: 'C-Level',
      employeeSize: '50-100',
    },
  ];

  // Sort contacts
  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortBy === 'company') {
      return a.company.localeCompare(b.company);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const visibleContacts = isPaid ? sortedContacts : sortedContacts.slice(0, 10);
  const showPaywall = !isPaid && contacts.length > 10;
  const hasNoResults = visibleContacts.length === 0;

  const handleDownload = (contactId: number) => {
    if (!isPaid) {
      alert('Please upgrade to download contacts');
      return;
    }
    console.log('Downloading contact:', contactId);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#030000]">Contact Search Filters</h1>
            <p className="text-gray-600 mt-1">Find and explore contacts from our database</p>
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
              placeholder="Search by name, company, or title..."
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent shadow-sm"
            />
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Company Name"
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent shadow-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="logistics">Logistics</option>
              <option value="hr">Human Resources</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
          
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">All Locations</option>
              <option value="ca">California</option>
              <option value="ny">New York</option>
              <option value="tx">Texas</option>
              <option value="il">Illinois</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <select
              value={filters.jobRole}
              onChange={(e) => setFilters({ ...filters, jobRole: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">Job Role</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="hr">Human Resources</option>
              <option value="executive">Executive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <select
              value={filters.jobLevel}
              onChange={(e) => setFilters({ ...filters, jobLevel: e.target.value })}
              className="w-40 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm"
            >
              <option value="">Job Level</option>
              <option value="c-level">C-Level</option>
              <option value="vp">VP</option>
              <option value="director">Director</option>
              <option value="head">Head</option>
              <option value="manager">Manager</option>
              <option value="senior">Senior</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="relative">
            <select
              value={filters.employeeSize}
              onChange={(e) => setFilters({ ...filters, employeeSize: e.target.value })}
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Search className="text-white" size={20} />
              </div>
              <div>
                <p className="text-[#030000]">Search Results</p>
                <p className="text-gray-600 text-sm">
                  Showing <span className="text-[#EF8037]">{visibleContacts.length}</span> of <span className="text-[#030000]">{contacts.length}</span> contacts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'company' | 'jobTitle')}
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF8037] focus:border-transparent appearance-none bg-white shadow-sm pr-10"
                >
                  <option value="company">Sort by Company</option>
                  <option value="jobTitle">Sort by Job Title</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
              {!isPaid && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 px-5 py-3 rounded-xl border border-red-200">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertCircle className="text-[#EB432F]" size={18} />
                  </div>
                  <div>
                    <p className="text-[#EB432F] text-sm">Free Preview Mode</p>
                    <p className="text-gray-600 text-xs">Limited to 10 contacts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {hasNoResults && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
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
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Contact</span>
                    </div>
                  </th>
                  <th className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Job Title</span>
                    </div>
                  </th>
                  <th className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Company</span>
                    </div>
                  </th>
                  <th className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Email</span>
                    </div>
                  </th>
                  <th className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Phone</span>
                    </div>
                  </th>
                  <th className="text-left px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleContacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all group"
                    style={{
                      animation: `slideInRow 0.3s ease-out ${index * 0.03}s both`
                    }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                          <span>{contact.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-[#030000] group-hover:text-[#EF8037] transition-colors">{contact.name}</p>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {contact.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-700 text-sm">{contact.title}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-[#030000] mb-1">{contact.company}</p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                          {contact.industry}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {isPaid ? (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 text-xs">{contact.email}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          <Lock className="text-gray-500" size={14} />
                          <span className="text-gray-400 blur-[4px] select-none pointer-events-none text-xs">{contact.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {isPaid ? (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700 text-xs">{contact.phone}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          <Lock className="text-gray-500" size={14} />
                          <span className="text-gray-400 blur-[4px] select-none pointer-events-none text-xs">{contact.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(contact.id)}
                          className={`p-3 rounded-xl transition-all ${
                            isPaid
                              ? 'bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white hover:shadow-lg hover:scale-105'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!isPaid}
                          title={isPaid ? 'Download' : 'Locked'}
                        >
                          {isPaid ? <Download size={16} /> : <Lock size={16} />}
                        </button>
                        <button 
                          className="p-3 border-2 border-gray-200 rounded-xl hover:border-[#EF8037] hover:bg-orange-50 transition-all hover:scale-105"
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
        <div className="md:hidden space-y-4">
          {visibleContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all"
              style={{
                animation: `slideUp 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {/* Contact Header */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EF8037] to-[#EB432F] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <span className="text-lg">{contact.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#030000] truncate mb-1">{contact.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{contact.title}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {contact.location}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 mb-4">
                {/* Company */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Company</p>
                    <p className="text-[#030000]">{contact.company}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {contact.industry}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    {isPaid ? (
                      <p className="text-gray-700 text-sm break-all">{contact.email}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="text-gray-500" size={14} />
                        <span className="text-gray-400 blur-[4px] select-none text-sm">{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    {isPaid ? (
                      <p className="text-gray-700 text-sm">{contact.phone}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="text-gray-500" size={14} />
                        <span className="text-gray-400 blur-[4px] select-none text-sm">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDownload(contact.id)}
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
                    <h3 className="text-[#030000] mb-1">You've reached your 10 free contacts</h3>
                    <p className="text-gray-700 text-sm">Upgrade now to unlock full contact details and access our complete database of {contacts.length}+ contacts</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('payment')}
                  className="group px-8 py-4 bg-gradient-to-r from-[#EF8037] to-[#EB432F] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 shadow-lg whitespace-nowrap"
                >
                  <span>Unlock & Download Contacts</span>
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
