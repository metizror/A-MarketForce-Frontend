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

export interface ApprovalRequest {
  id: string;
  firstName: string;
  lastName: string;
  businessEmail: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

