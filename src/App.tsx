import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'superadmin' | 'admin' | 'customer' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Contact {
  id: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  jobLevel: string;
  jobRole: string;
  email: string;
  phone: string;
  directPhone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  industry: string;
  contactLinkedInUrl: string;
  amfNotes: string;
  lastUpdateDate: string;
  addedBy: string;
  addedByRole: string;
  addedDate: string;
  updatedDate: string;
  // Required Company Fields
  companyName?: string;
  employeeSize?: string;
  revenue?: string;
}

export interface Company {
  id: string;
  companyName: string;
  phone?: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  revenue: string;
  employeeSize: string;
  industry: string;
  technology: string;
  companyLinkedInUrl?: string;
  amfNotes: string;
  lastUpdateDate: string;
  addedBy: string;
  addedByRole: string;
  addedDate: string;
  updatedDate: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  user: string;
  role: string;
  timestamp: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Initialize with mock data
    initializeMockData(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const initializeMockData = (user: User) => {
    // Mock contacts
    const mockContacts: Contact[] = [
      {
        id: '1',
        companyId: '1',
        firstName: 'John',
        lastName: 'Smith',
        jobTitle: 'Senior Software Engineer',
        jobLevel: 'Senior',
        jobRole: 'Engineering',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        directPhone: '+1 (555) 123-4568',
        address1: '123 Tech Street',
        address2: 'Suite 400',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94105',
        country: 'United States',
        website: 'https://johnsmith-portfolio.com',
        industry: 'Technology',
        contactLinkedInUrl: 'https://linkedin.com/in/johnsmith',
        amfNotes: 'Key technical decision maker. Passionate about clean code and modern frameworks.',
        lastUpdateDate: '2024-01-15',
        addedBy: user.name,
        addedByRole: user.role || '',
        addedDate: '2024-01-15',
        updatedDate: '2024-01-15',
        companyName: 'TechCorp Inc.',
        employeeSize: '500-1000',
        revenue: '$50M-$100M'
      },
      {
        id: '2',
        companyId: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        jobTitle: 'Marketing Director',
        jobLevel: 'Director',
        jobRole: 'Marketing',
        email: 'sarah.johnson@growthco.com',
        phone: '+1 (555) 987-6543',
        directPhone: '+1 (555) 987-6544',
        address1: '456 Growth Avenue',
        address2: 'Floor 12',
        city: 'New York',
        state: 'New York',
        zipCode: '10001',
        country: 'United States',
        website: 'https://sarahjohnson.marketing',
        industry: 'Marketing',
        contactLinkedInUrl: 'https://linkedin.com/in/sarahjohnson',
        amfNotes: 'Experienced marketing leader focused on digital transformation. Budget authority for marketing tools.',
        lastUpdateDate: '2024-01-12',
        addedBy: 'Admin User',
        addedByRole: 'admin',
        addedDate: '2024-01-10',
        updatedDate: '2024-01-12',
        companyName: 'GrowthCo',
        employeeSize: '100-250',
        revenue: '$10M-$25M'
      },
      {
        id: '3',
        companyId: '1',
        firstName: 'Michael',
        lastName: 'Chen',
        jobTitle: 'Product Manager',
        jobLevel: 'Mid',
        jobRole: 'Product',
        email: 'michael.chen@innovate.com',
        phone: '+1 (555) 246-8135',
        directPhone: '+1 (555) 246-8136',
        address1: '789 Innovation Drive',
        address2: '',
        city: 'Austin',
        state: 'Texas',
        zipCode: '73301',
        country: 'United States',
        website: 'https://michaelchen.pm',
        industry: 'Technology',
        contactLinkedInUrl: 'https://linkedin.com/in/michaelchen-pm',
        amfNotes: 'Product-focused professional with strong analytics background. Interested in user research tools.',
        lastUpdateDate: '2024-01-14',
        addedBy: user.name,
        addedByRole: user.role || '',
        addedDate: '2024-01-14',
        updatedDate: '2024-01-14'
      }
    ];

    // Mock companies
    const mockCompanies: Company[] = [
      {
        id: '1',
        companyName: 'TechCorp Inc',
        phone: '+1 (555) 123-4567',
        address1: '123 Tech Street',
        address2: 'Suite 400',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94105',
        country: 'United States',
        website: 'https://techcorp.com',
        revenue: '$50M-$100M',
        employeeSize: '1000-5000',
        industry: 'Technology',
        technology: 'React, Node.js, AWS',
        companyLinkedInUrl: 'https://linkedin.com/company/techcorp',
        amfNotes: 'Leading technology company with strong focus on cloud solutions.',
        lastUpdateDate: '2024-01-15',
        addedBy: user.name,
        addedByRole: user.role || '',
        addedDate: '2024-01-15',
        updatedDate: '2024-01-15'
      },
      {
        id: '2',
        companyName: 'GrowthCo Marketing',
        phone: '+1 (555) 987-6543',
        address1: '456 Growth Avenue',
        address2: '',
        city: 'New York',
        state: 'New York',
        zipCode: '10001',
        country: 'United States',
        website: 'https://growthco.com',
        revenue: '$10M-$50M',
        employeeSize: '100-500',
        industry: 'Marketing',
        technology: 'HubSpot, Salesforce',
        companyLinkedInUrl: 'https://linkedin.com/company/growthco',
        amfNotes: 'Looking to expand marketing automation capabilities. Budget approved for Q2.',
        lastUpdateDate: '2024-01-12',
        addedBy: 'Admin User',
        addedByRole: 'admin',
        addedDate: '2024-01-10',
        updatedDate: '2024-01-12'
      }
    ];

    // Mock users
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'superadmin@company.com',
        name: 'Super Admin',
        role: 'superadmin'
      },
      {
        id: '2',
        email: 'admin@company.com',
        name: 'Admin User',
        role: 'admin'
      }
    ];

    // Mock activity logs
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        action: 'Contact Added',
        details: 'Added John Smith to TechCorp Inc',
        user: user.name,
        role: user.role || '',
        timestamp: '2024-01-15 10:30:00'
      },
      {
        id: '2',
        action: 'Data Import',
        details: 'Imported 150 contacts from CSV',
        user: 'Super Admin',
        role: 'superadmin',
        timestamp: '2024-01-10 09:15:00'
      }
    ];

    setContacts(mockContacts);
    setCompanies(mockCompanies);
    setUsers(mockUsers);
    setActivityLogs(mockLogs);
  };

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentUser.role === 'superadmin' ? (
        <SuperAdminDashboard
          user={currentUser}
          contacts={contacts}
          companies={companies}
          users={users}
          activityLogs={activityLogs}
          setContacts={setContacts}
          setCompanies={setCompanies}
          setUsers={setUsers}
          setActivityLogs={setActivityLogs}
          onLogout={handleLogout}
        />
      ) : currentUser.role === 'admin' ? (
        <AdminDashboard
          user={currentUser}
          contacts={contacts}
          companies={companies}
          activityLogs={activityLogs}
          setContacts={setContacts}
          setCompanies={setCompanies}
          setActivityLogs={setActivityLogs}
          onLogout={handleLogout}
        />
      ) : currentUser.role === 'customer' ? (
        <CustomerDashboard />
      ) : null}
      <Toaster />
    </div>
  );
}