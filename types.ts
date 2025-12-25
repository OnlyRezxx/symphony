export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  permissions: string[];
  color: string;
}

export interface Application {
  id: string;
  user_id: string;
  username: string;
  discord: string;
  age: number;
  role_id: string;
  experience: string;
  reason: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}