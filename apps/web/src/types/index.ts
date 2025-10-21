// User Roles
export enum UserRole {
  INFLUENCER = 'influencer',
  BRAND = 'brand',
  ORI = 'ori',
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Auth DTOs
export interface SignupDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SigninDto {
  email: string;
  password: string;
}

// Auth Response
export interface AuthResponse {
  token: string;
  user: User;
}

// Error Response
export interface AuthError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Role Permissions
export interface RolePermissions {
  isAdmin: boolean;
  canManageUsers: boolean;
  canManageBrands?: boolean;
  canManageInfluencers?: boolean;
  canViewAnalytics: boolean;
  canCreateCampaigns?: boolean;
  canApplyToCampaigns?: boolean;
}
