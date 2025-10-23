// Extensão dos tipos do Better Auth para incluir o campo role

import { UserRole } from './auth/enums/user-role.enum.js';

declare module 'better-auth' {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}

export {};
