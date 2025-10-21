export enum UserRole {
  INFLUENCER = 'influencer',
  BRAND = 'brand',
  ORI = 'ori',
}

export const USER_ROLES = [
  UserRole.INFLUENCER,
  UserRole.BRAND,
  UserRole.ORI,
] as const;

// Helper functions
export const isAdminRole = (role: UserRole): boolean => {
  return role === UserRole.ORI;
};

export const hasAdminAccess = (role: UserRole): boolean => {
  return isAdminRole(role);
};

export const getRolePermissions = (role: UserRole) => {
  switch (role) {
    case UserRole.ORI:
      return {
        isAdmin: true,
        canManageUsers: true,
        canManageBrands: true,
        canManageInfluencers: true,
        canViewAnalytics: true,
      };
    case UserRole.BRAND:
      return {
        isAdmin: false,
        canManageUsers: false,
        canManageBrands: false,
        canManageInfluencers: false,
        canViewAnalytics: true,
        canCreateCampaigns: true,
      };
    case UserRole.INFLUENCER:
      return {
        isAdmin: false,
        canManageUsers: false,
        canManageBrands: false,
        canManageInfluencers: false,
        canViewAnalytics: true,
        canApplyToCampaigns: true,
      };
    default:
      return {
        isAdmin: false,
        canManageUsers: false,
        canManageBrands: false,
        canManageInfluencers: false,
        canViewAnalytics: false,
      };
  }
};
