# 🚀 Setup Monorepo - React + Vite + Tailwind + NestJS

## 📋 Stack Escolhido

- **Backend**: NestJS + Better Auth + MongoDB
- **Frontend**: React + Vite + Tailwind CSS + TypeScript
- **Monorepo**: Turborepo + pnpm workspaces
- **Shared**: Types, UI Components, Tailwind Config

---

## 🎯 Passo a Passo Completo

### 1. Criar a Estrutura Base do Monorepo

```bash
# Voltar para a pasta pai
cd ..

# Criar novo monorepo com Turborepo
npx create-turbo@latest system-authentication-platform

# Opções ao criar:
# - Which package manager? → pnpm
# - Include example apps and packages? → No (vamos criar do zero)
```

### 2. Mover o Backend Existente

```bash
cd system-authentication-platform

# Criar pasta apps se não existir
mkdir -p apps

# Mover seu backend atual para dentro do monorepo
mv ../system-authentication-prototype ./apps/backend

# Atualizar o package.json do backend
cd apps/backend
```

Editar `apps/backend/package.json`:
```json
{
  "name": "@myapp/backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest"
  }
}
```

### 3. Criar Frontend com React + Vite

```bash
# Voltar para a raiz
cd ../..

# Criar app React com Vite
cd apps
pnpm create vite web --template react-ts

cd web

# Instalar Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @tailwindcss/forms @tailwindcss/typography

# Inicializar Tailwind
npx tailwindcss init -p
```

Configurar `apps/web/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Componentes compartilhados
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

Criar `apps/web/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

Atualizar `apps/web/package.json`:
```json
{
  "name": "@myapp/web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3001",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
```

### 4. Criar Package de Tipos Compartilhados

```bash
# Voltar para a raiz
cd ../..

# Criar package de tipos
mkdir -p packages/types/src
cd packages/types
```

Criar `packages/types/package.json`:
```json
{
  "name": "@myapp/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint src --ext .ts"
  },
  "devDependencies": {
    "typescript": "^5.5.3"
  }
}
```

Criar `packages/types/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Criar `packages/types/src/index.ts`:
```typescript
// User & Auth Types
export enum UserRole {
  INFLUENCER = 'influencer',
  BRAND = 'brand',
  ORI = 'ori',
}

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

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Permissions
export interface RolePermissions {
  isAdmin: boolean;
  canManageUsers: boolean;
  canManageBrands?: boolean;
  canManageInfluencers?: boolean;
  canViewAnalytics: boolean;
  canCreateCampaigns?: boolean;
  canApplyToCampaigns?: boolean;
}

// Helper function type
export type GetRolePermissions = (role: UserRole) => RolePermissions;
```

### 5. Criar Package UI (Componentes Compartilhados)

```bash
# Voltar para a raiz
cd ../..

# Criar package ui
mkdir -p packages/ui/src
cd packages/ui
```

Criar `packages/ui/package.json`:
```json
{
  "name": "@myapp/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
```

Criar `packages/ui/src/Button.tsx`:
```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

Criar `packages/ui/src/Input.tsx`:
```tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
```

Criar `packages/ui/src/index.ts`:
```typescript
export { Button } from './Button';
export { Input } from './Input';
```

### 6. Configurar Workspaces na Raiz

Criar `pnpm-workspace.yaml` na raiz:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Criar `package.json` na raiz:
```json
{
  "name": "system-authentication-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.1.3",
    "typescript": "^5.5.3",
    "eslint": "^8.57.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 7. Configurar Turborepo

Criar `turbo.json` na raiz:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 8. Instalar Dependências

```bash
# Na raiz do monorepo
pnpm install

# Instalar dependências específicas do backend
cd apps/backend
pnpm install

# Instalar dependências do frontend
cd ../web
pnpm install
pnpm add react-router-dom
pnpm add -D @types/node

# Voltar para a raiz
cd ../..
```

### 9. Configurar TypeScript Paths

Atualizar `apps/web/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@myapp/types": ["../../packages/types/src"],
      "@myapp/ui": ["../../packages/ui/src"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/types" },
    { "path": "../../packages/ui" }
  ]
}
```

Atualizar `apps/web/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@myapp/types': path.resolve(__dirname, '../../packages/types/src'),
      '@myapp/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### 10. Criar Estrutura do Frontend

```bash
cd apps/web/src

# Criar estrutura de pastas
mkdir -p components/auth
mkdir -p components/common
mkdir -p pages/{influencer,brand,admin}
mkdir -p services
mkdir -p hooks
mkdir -p utils
```

### 11. Rodar o Monorepo

```bash
# Na raiz do monorepo
pnpm dev
```

Isso vai rodar:
- ✅ Backend em `http://localhost:3000`
- ✅ Frontend em `http://localhost:3001`
- ✅ Hot reload em ambos
- ✅ Types compartilhados sincronizados

---

## 🎯 Próximos Passos

1. **Testar o setup**:
   ```bash
   pnpm dev
   ```

2. **Criar componentes de Auth no frontend** (vou criar exemplos)

3. **Conectar frontend com backend**

4. **Criar rotas para cada tipo de usuário**

---

## 📦 Estrutura Final

```
system-authentication-platform/
├── apps/
│   ├── backend/         ← NestJS (porta 3000)
│   └── web/             ← React + Vite (porta 3001)
├── packages/
│   ├── types/           ← Tipos compartilhados
│   └── ui/              ← Componentes compartilhados
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## ✅ Comandos Úteis

```bash
# Rodar tudo em dev
pnpm dev

# Build de produção
pnpm build

# Lint em tudo
pnpm lint

# Adicionar dependência em um app específico
cd apps/web && pnpm add axios

# Adicionar dependência na raiz
pnpm add -w eslint

# Limpar tudo
pnpm clean
```

---

Quer que eu execute esses comandos para você agora?
