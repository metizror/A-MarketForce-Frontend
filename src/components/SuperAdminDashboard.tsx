import React, { useState } from 'react';
import { Sidebar } from './DashboardSidebar';
import { DashboardStats } from './DashboardStats';
import { ContactsTable } from './ContactsTable';
import { CompaniesTable } from './CompaniesTable';
import { UsersTable } from './UsersTable';
import { ImportDataModule } from './ImportDataModule';
import { ActivityLogsPanel } from './ActivityLogsPanel';
import { SettingsPanel } from './SettingsPanel';
import { FilterPanel } from './FilterPanel';
import { ViewCompanyDetails } from './ViewCompanyDetails';
import { ViewContactDetails } from './ViewContactDetails';
import { SupportContactForm } from './SupportContactForm';
import { Button } from './ui/button';
import { LogOut, Filter } from 'lucide-react';
import { User, Contact, Company, ActivityLog, ApprovalRequest } from '../App';
import { ApprovalRequests } from './ApprovalRequests';

interface SuperAdminDashboardProps {
  user: User;
  contacts: Contact[];
  companies: Company[];
  users: User[];
  activityLogs: ActivityLog[];
  approvalRequests: ApprovalRequest[];
  setContacts: (contacts: Contact[]) => void;
  setCompanies: (companies: Company[]) => void;
  setUsers: (users: User[]) => void;
  setActivityLogs: (logs: ActivityLog[]) => void;
  setApprovalRequests: (requests: ApprovalRequest[]) => void;
  onLogout: () => void;
}

type ViewType = 'dashboard' | 'contacts' | 'companies' | 'approve-requests' | 'users' | 'import' | 'activity' | 'settings' | 'view-company' | 'view-contact';

export function SuperAdminDashboard({
  user,
  contacts,
  companies,
  users,
  activityLogs,
  approvalRequests,
  setContacts,
  setCompanies,
  setUsers,
  setActivityLogs,
  setApprovalRequests,
  onLogout
}: SuperAdminDashboardProps) {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const pendingRequestsCount = approvalRequests.filter(req => req.status === 'pending').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'contacts', label: 'Contacts', icon: 'Users' },
    { id: 'companies', label: 'Companies', icon: 'Building2' },
    { 
      id: 'approve-requests', 
      label: 'Approve Requests', 
      icon: 'CheckCircle2', 
      ...(pendingRequestsCount > 0 && { badge: pendingRequestsCount })
    },
    { id: 'users', label: 'Users', icon: 'UserCheck' },
    { id: 'import', label: 'Import Data', icon: 'Upload', exclusive: true },
    { id: 'activity', label: 'Activity Logs', icon: 'Activity' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setActiveView('view-company');
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setActiveView('companies');
  };

  const handleEditCompany = (company: Company) => {
    // Navigate back to companies view with edit dialog open
    // This will be handled by the CompaniesTable component
    setSelectedCompany(null);
    setActiveView('companies');
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanies(companies.filter(c => c.id !== companyId));
    setSelectedCompany(null);
    setActiveView('companies');
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setActiveView('view-contact');
  };

  const handleBackToContacts = () => {
    setSelectedContact(null);
    setActiveView('contacts');
  };

  const handleEditContact = (contact: Contact) => {
    // Navigate back to contacts view with edit dialog open
    // This will be handled by the ContactsTable component
    setSelectedContact(null);
    setActiveView('contacts');
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
    setSelectedContact(null);
    setActiveView('contacts');
  };

  const handleExportContact = (contact: Contact) => {
    const csvHeader = 'First Name,Last Name,Job Title,Job Level,Job Role,Email,Phone,Direct Phone,Address 1,Address 2,City,State,Zip Code,Country,Website,Industry,Contact LinkedIn URL,aMF Notes,Last Update Date';
    const csvRow = `"${contact.firstName}","${contact.lastName}","${contact.jobTitle}","${contact.jobLevel}","${contact.jobRole}","${contact.email}","${contact.phone}","${contact.directPhone}","${contact.address1}","${contact.address2}","${contact.city}","${contact.state}","${contact.zipCode}","${contact.country}","${contact.website}","${contact.industry}","${contact.contactLinkedInUrl}","${contact.amfNotes}","${contact.lastUpdateDate}"`;
    
    const csvContent = [csvHeader, csvRow].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-${contact.firstName}-${contact.lastName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats 
              contacts={contacts}
              companies={companies}
              users={users}
              role="superadmin"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImportDataModule 
                onImportComplete={(newContacts, newCompanies) => {
                  setContacts([...contacts, ...newContacts]);
                  setCompanies([...companies, ...newCompanies]);
                }}
              />
              <ActivityLogsPanel logs={activityLogs.slice(0, 5)} />
            </div>
          </div>
        );
      case 'contacts':
        return <ContactsTable contacts={contacts} setContacts={setContacts} user={user} companies={companies} filters={filters} onViewContact={handleViewContact} />;
      case 'companies':
        return <CompaniesTable companies={companies} setCompanies={setCompanies} user={user} filters={filters} onViewCompany={handleViewCompany} />;
      case 'view-company':
        return selectedCompany ? (
          <ViewCompanyDetails
            company={selectedCompany}
            contacts={contacts}
            setContacts={setContacts}
            user={user}
            onBack={handleBackToCompanies}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
        ) : null;
      case 'view-contact':
        return selectedContact ? (
          <ViewContactDetails
            contact={selectedContact}
            user={user}
            onBack={handleBackToContacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onExport={handleExportContact}
            companyName={selectedContact.companyId ? companies.find(c => c.id === selectedContact.companyId)?.companyName : undefined}
            company={selectedContact.companyId ? companies.find(c => c.id === selectedContact.companyId) : undefined}
          />
        ) : null;
      case 'users':
        return <UsersTable users={users} setUsers={setUsers} />;
      case 'approve-requests':
        return (
          <ApprovalRequests
            approvalRequests={approvalRequests}
            setApprovalRequests={setApprovalRequests}
            currentUser={{ name: user.name, role: user.role || '' }}
            onApprove={(request) => {
              // Add activity log when approving
              const newLog: ActivityLog = {
                id: Date.now().toString(),
                action: 'Customer Approved',
                details: `Approved customer registration for ${request.firstName} ${request.lastName} (${request.businessEmail})`,
                user: user.name,
                role: user.role || '',
                timestamp: new Date().toISOString()
              };
              setActivityLogs([newLog, ...activityLogs]);
            }}
          />
        );
      case 'import':
        return (
          <ImportDataModule 
            onImportComplete={(newContacts, newCompanies) => {
              setContacts([...contacts, ...newContacts]);
              setCompanies([...companies, ...newCompanies]);
            }}
          />
        );
      case 'activity':
        return <ActivityLogsPanel logs={activityLogs} />;
      case 'settings':
        return <SettingsPanel user={user} />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        menuItems={menuItems}
        user={user}
        onLogout={onLogout}
        onSupportClick={() => setShowSupportModal(true)}
        pendingRequestsCount={pendingRequestsCount}
      />
      
      {/* Support Modal */}
      <SupportContactForm
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        userEmail={user.email}
        userName={user.name}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {activeView !== 'view-company' && activeView !== 'view-contact' && (
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                  {activeView === 'dashboard' ? 'Super Admin Dashboard' : activeView === 'approve-requests' ? 'Approve Requests' : activeView}
                </h1>
                {(activeView === 'contacts' || activeView === 'companies') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Search Filters
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Filter Panel */}
          {showFilters && (activeView === 'contacts' || activeView === 'companies') && (
            <FilterPanel 
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
          
          {/* Main Content */}
          <main className={`flex-1 overflow-auto relative ${activeView === 'view-company' || activeView === 'view-contact' ? '' : 'p-6'}`}>
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Top Right Gradient Orb */}
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 via-orange-100/20 to-transparent rounded-full blur-3xl"></div>
              
              {/* Bottom Left Gradient Orb */}
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/20 via-purple-100/20 to-transparent rounded-full blur-3xl"></div>
              
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}