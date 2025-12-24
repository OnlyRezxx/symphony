
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
  username: string;
  discord: string;
  age: number;
  role_id: string;
  experience: string;
  reason: string;
  status: ApplicationStatus;
  created_at: string;
  ai_summary?: string;
}

export interface UserSession {
  user: {
    id: string;
    email?: string;
  } | null;
}
