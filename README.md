# 🔐 Authentication System Monorepo

Sistema completo de autenticação com **Role-Based Access Control (RBAC)** para gerenciamento de influenciadores, marcas e administradores.

## 📋 Sobre o Projeto

Monorepo moderno construído com **Turborepo** que inclui:

- **Backend**: NestJS + Better Auth + MongoDB com sistema RBAC completo
- **Frontend**: React + Vite + Tailwind CSS v4 com interface moderna
- **3 Tipos de Usuários**: Influencer, Brand e Ori (Admin)

## 🏗️ Arquitetura

```
authentication-system-monorepo/
├── apps/
│   ├── backend/              # API NestJS
│   │   ├── src/
│   │   │   ├── auth/        # Sistema de autenticação e RBAC
│   │   │   ├── admin/       # Rotas protegidas para admin
│   │   │   └── lib/         # Configuração Better Auth
│   │   ├── scripts/         # Scripts utilitários (create-admin)
│   │   └── test/guides/     # Documentação detalhada
│   └── web/                  # Frontend React
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── pages/       # Páginas (Auth + Dashboards)
│       │   ├── services/    # Serviços de API
│       │   └── types/       # Definições TypeScript
│       └── vite.config.ts
├── packages/
│   └── eslint-config/       # Configurações ESLint compartilhadas
├── turbo.json               # Configuração Turborepo
└── package.json             # Workspaces root
```

## 🚀 Tech Stack

### Backend
- **NestJS** 11.0.1 - Framework Node.js
- **Better Auth** 1.3.27 - Sistema de autenticação moderno
- **MongoDB** 6.20.0 + Mongoose 8.19.1 - Banco de dados
- **TypeScript** - Tipagem estática
- **Class Validator** - Validação de DTOs

### Frontend
- **React** 18.3.1 - Biblioteca UI
- **Vite** 5.4.1 - Build tool super rápido
- **Tailwind CSS** 3.4.11 - Framework CSS utilitário
- **React Router DOM** 6.26.0 - Roteamento
- **Lucide React** - Ícones modernos
- **TypeScript** - Tipagem estática

### DevOps
- **Turborepo** 2.1.3 - Monorepo build system
- **npm workspaces** - Gerenciamento de pacotes

## 📦 Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** (local ou Atlas)
- **Git**

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/s4mp41xao/authentication-system-monorepo.git
cd authentication-system-monorepo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

#### Backend (`apps/backend/.env`)

```bash
# Copie o arquivo de exemplo
cp apps/backend/.env.example apps/backend/.env
```

Edite `apps/backend/.env`:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/authentication-system"
# ou para MongoDB Atlas:
# DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/authentication-system"

# Better Auth
BETTER_AUTH_SECRET="seu-secret-super-seguro-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# Frontend URL (para CORS)
FRONTEND_URL="http://localhost:5173"

# Node Environment
NODE_ENV="development"
```

#### Frontend (`apps/web/.env`)

```bash
# Crie o arquivo .env
echo 'VITE_API_URL=http://localhost:3000' > apps/web/.env
```

### 4. Inicie o MongoDB

```bash
# Se estiver usando MongoDB local
mongod

# Ou use MongoDB Atlas (configure a URL no .env)
```

### 5. Execute o projeto

```bash
# Inicia backend e frontend simultaneamente
npm run dev
```

Ou execute separadamente:

```bash
# Backend (porta 3000)
npm run dev --filter=backend

# Frontend (porta 5173)
npm run dev --filter=web
```

## 🔑 Criando Usuário Admin

Após configurar o backend, crie o primeiro usuário admin:

```bash
cd apps/backend
npm run create-admin
```

**Credenciais padrão:**
- Email: `admin@ori.com`
- Senha: `Admin@123`

⚠️ **Importante**: Altere essas credenciais em produção!

## 📱 Funcionalidades

### Sistema de Autenticação
- ✅ Registro com seleção de role (Influencer/Brand)
- ✅ Login com email e senha
- ✅ Logout
- ✅ Sessões com cookies (httpOnly)
- ✅ Proteção contra auto-registro como admin

### RBAC (Role-Based Access Control)
- ✅ 3 tipos de usuários: `influencer`, `brand`, `ori` (admin)
- ✅ Guards de proteção de rotas
- ✅ Decorators customizados (`@Roles()`)
- ✅ Middleware de autenticação global
- ✅ Redirecionamento baseado em role

### Interface Moderna
- ✅ Design split-screen para autenticação
- ✅ Seleção interativa de role com cards
- ✅ Toggle de visualização de senha
- ✅ Dashboards específicos por role
- ✅ Homepage com apresentação de tipos de usuário
- ✅ Responsivo (mobile-first)

## 🎨 Páginas Disponíveis

### Públicas
- `/` - Homepage
- `/signup` - Cadastro
- `/signin` - Login

### Protegidas (por role)
- `/influencer/dashboard` - Dashboard do Influencer
- `/brand/dashboard` - Dashboard da Brand
- `/admin/dashboard` - Dashboard do Admin (Ori)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## 📚 Documentação Adicional

Documentação detalhada disponível em `apps/backend/test/guides/`:

- **IMPLEMENTATION.md** - Guia de implementação RBAC
- **ROLES.md** - Documentação dos roles e permissões
- **CRIAR-ADMIN.md** - Como criar usuários admin
- **FRONTEND-INTEGRATION.md** - Integração frontend/backend
- **GUIA-RAPIDO.md** - Guia rápido de uso
- **MONOREPO-VS-MULTIREPO.md** - Decisões de arquitetura
- **SETUP-MONOREPO.md** - Setup do monorepo
- **HOMEPAGE.md** - Design da homepage

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia tudo (backend + frontend)
npm run dev:backend      # Apenas backend
npm run dev:web          # Apenas frontend

# Build
npm run build            # Build de tudo
npm run build:backend    # Build backend
npm run build:web        # Build frontend

# Linting
npm run lint             # Lint em tudo
npm run lint:fix         # Fix automático

# Outros
npm run clean            # Limpa node_modules e builds
```

## 🌐 Portas Padrão

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **MongoDB**: mongodb://localhost:27017

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Cookies httpOnly e secure
- ✅ CORS configurado
- ✅ Validação de DTOs
- ✅ Guards de proteção de rotas
- ✅ Prevenção de auto-registro como admin

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Samuel Paixão** - [@s4mp41xao](https://github.com/s4mp41xao)

## 🐛 Problemas Conhecidos

Consulte as [Issues](https://github.com/s4mp41xao/authentication-system-monorepo/issues) para ver problemas conhecidos e solicitar novas features.

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Verifique a documentação em `apps/backend/test/guides/`
2. Procure nas [Issues](https://github.com/s4mp41xao/authentication-system-monorepo/issues)
3. Abra uma nova Issue

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
