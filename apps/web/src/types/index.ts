// User Roles
export const UserRole = {
  INFLUENCER: 'influencer',
  BRAND: 'brand',
  ORI: 'ori'
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// User Interface
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  emailVerified: boolean
  image?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

// Auth DTOs
export interface SignupDto {
  email: string
  password: string
  name: string
  role: UserRole
  // Campos opcionais para Influencer
  instagram?: string
  followers?: number
  bio?: string
  // Campos opcionais para Brand
  website?: string
  industry?: string
  description?: string
}

export interface SigninDto {
  email: string
  password: string
}

// Auth Response
export interface AuthResponse {
  token: string
  user: User
}

// Error Response
export interface AuthError {
  statusCode: number
  message: string | string[]
  error: string
}

// Role Permissions
export interface RolePermissions {
  isAdmin: boolean
  canManageUsers: boolean
  canManageBrands?: boolean
  canManageInfluencers?: boolean
  canViewAnalytics: boolean
  canCreateCampaigns?: boolean
  canApplyToCampaigns?: boolean
}
