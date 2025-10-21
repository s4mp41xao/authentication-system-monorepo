# 🇧🇷 Guia Rápido - Sistema de Roles

## 🎯 Resumo da Implementação

Implementei um sistema completo de roles (cargos) no seu projeto NestJS com Better Auth. Agora você tem **3 tipos de usuários**:

### 👥 Tipos de Usuários

1. **`influencer`** - Influenciadores (acesso normal)
2. **`brand`** - Marcas (acesso normal com funcionalidades específicas)
3. **`ori`** - Administradores (acesso total ao sistema)

## 📁 Arquivos Criados/Modificados

### ✨ Novos Arquivos

```
src/
  auth/
    enums/
      user-role.enum.ts          # Enum e funções helper de roles
    guards/
      roles.guard.ts             # Guard para proteger rotas
    decorators/
      roles.decorator.ts         # Decorator @Roles()
    middleware/
      auth.middleware.ts         # Middleware de autenticação
    index.ts                     # Exportações centralizadas
  types/
    better-auth.d.ts            # Tipos estendidos do Better Auth
  example/
    example.controller.ts        # Exemplos de uso

test/
  test-roles.http               # Testes HTTP

ROLES.md                        # Documentação completa
IMPLEMENTATION.md               # Resumo da implementação
```

### 🔧 Arquivos Modificados

```
src/
  auth/
    dto/signup.dto.ts           # Adicionado campo role com validação
    auth.controller.ts          # Passa role no signup
    auth.module.ts              # Exporta RolesGuard
  lib/
    auth.ts                     # Configurado campos customizados
  app.module.ts                 # Aplica middleware global
```

## 🚀 Como Testar

### 1. Certifique-se que o servidor está rodando

```bash
npm run start:dev
```

### 2. Criar Usuários de Teste

**Criar Influencer:**

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@example.com",
    "password": "senha123",
    "name": "João Influencer",
    "role": "influencer"
  }'
```

**Criar Brand:**

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@example.com",
    "password": "senha123",
    "name": "Marca XYZ",
    "role": "brand"
  }'
```

**Criar Admin (ORI):**

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "senha123",
    "name": "Admin ORI",
    "role": "ori"
  }'
```

### 3. Fazer Login

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@example.com",
    "password": "senha123"
  }'
```

## 💻 Como Usar no Código

### Proteger uma Rota (Apenas Admin)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserRole } from './auth/enums/user-role.enum';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(UserRole.ORI)
  getDashboard() {
    return { message: 'Dashboard de administrador' };
  }
}
```

### Proteger Rota (Múltiplos Roles)

```typescript
@Controller('campaigns')
@UseGuards(RolesGuard)
export class CampaignsController {
  // Apenas Brands e Admins podem criar campanhas
  @Post()
  @Roles(UserRole.BRAND, UserRole.ORI)
  createCampaign() {
    return { message: 'Campanha criada' };
  }

  // Apenas Influencers e Admins podem se candidatar
  @Post(':id/apply')
  @Roles(UserRole.INFLUENCER, UserRole.ORI)
  applyToCampaign() {
    return { message: 'Candidatura enviada' };
  }
}
```

### Verificar Permissões no Service

```typescript
import { Injectable, ForbiddenException } from '@nestjs/common';
import { getRolePermissions, UserRole } from './auth/enums/user-role.enum';

@Injectable()
export class CampaignService {
  async createCampaign(user: { role: UserRole }) {
    const permissions = getRolePermissions(user.role);

    if (!permissions.canCreateCampaigns) {
      throw new ForbiddenException(
        'Você não tem permissão para criar campanhas',
      );
    }

    // Lógica para criar campanha...
  }
}
```

## 🎨 Estrutura de Permissões

### ORI (Administrador) ✨

```typescript
{
  isAdmin: true,
  canManageUsers: true,
  canManageBrands: true,
  canManageInfluencers: true,
  canViewAnalytics: true,
}
```

### BRAND (Marca) 🏢

```typescript
{
  isAdmin: false,
  canViewAnalytics: true,
  canCreateCampaigns: true,
}
```

### INFLUENCER (Influenciador) 📱

```typescript
{
  isAdmin: false,
  canViewAnalytics: true,
  canApplyToCampaigns: true,
}
```

## ⚡ Helpers Úteis

```typescript
import {
  isAdminRole,
  hasAdminAccess,
  getRolePermissions,
} from './auth/enums/user-role.enum';

// Verificar se é admin
if (isAdminRole(user.role)) {
  // Lógica para admins
}

// Obter todas as permissões
const permissions = getRolePermissions(user.role);
if (permissions.canCreateCampaigns) {
  // Usuário pode criar campanhas
}
```

## 🔐 Dicas de Segurança

### ⚠️ IMPORTANTE: Prevenir Auto-Registro como ORI

Adicione esta validação no controller:

```typescript
@Post('signup')
async register(@Body() signupDto: SignupDto, @Res() res) {
  // Previne que usuários se registrem como ORI
  if (signupDto.role === UserRole.ORI) {
    throw new ForbiddenException(
      'Registro como administrador não é permitido. Entre em contato com o suporte.'
    );
  }

  const auth = await createAuth();
  // ... resto do código
}
```

### 🛡️ Outras Recomendações

1. **Sistema de Convites**: Crie um sistema de convite para roles ORI
2. **Rate Limiting**: Implemente rate limiting nos endpoints de autenticação
3. **Auditoria**: Registre ações administrativas em logs
4. **HTTPS**: Use sempre HTTPS em produção
5. **Secrets**: Mantenha `BETTER_AUTH_SECRET` seguro e nunca commite no Git

## 📖 Exemplo Completo de Controller

```typescript
import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserRole, getRolePermissions } from './auth/enums/user-role.enum';

@Controller('api')
@UseGuards(RolesGuard)
export class ApiController {
  // Rota pública (sem @Roles)
  @Get('public')
  publicRoute() {
    return { message: 'Rota pública' };
  }

  // Apenas admins
  @Get('admin/users')
  @Roles(UserRole.ORI)
  listUsers() {
    return { message: 'Lista de usuários' };
  }

  // Brands e admins
  @Get('campaigns')
  @Roles(UserRole.BRAND, UserRole.ORI)
  listCampaigns() {
    return { message: 'Lista de campanhas' };
  }

  // Influencers e admins
  @Get('opportunities')
  @Roles(UserRole.INFLUENCER, UserRole.ORI)
  listOpportunities() {
    return { message: 'Oportunidades disponíveis' };
  }

  // Todos os usuários autenticados
  @Get('profile')
  @Roles(UserRole.INFLUENCER, UserRole.BRAND, UserRole.ORI)
  getProfile(@Request() req) {
    const permissions = getRolePermissions(req.user.role);
    return {
      user: req.user,
      permissions,
    };
  }
}
```

## 🧪 Testar com VS Code REST Client

Use o arquivo `test/test-roles.http` no VS Code com a extensão REST Client para testar facilmente.

## 📚 Documentação Adicional

- **`ROLES.md`** - Documentação completa com todos os detalhes
- **`IMPLEMENTATION.md`** - Resumo técnico da implementação
- **`test/test-roles.http`** - Exemplos de requisições HTTP

## 🤝 Próximos Passos Recomendados

1. ✅ **Testar o sistema** - Execute os testes HTTP
2. ✅ **Adicionar validação ORI** - Previna auto-registro como admin
3. ✅ **Implementar suas rotas** - Use os exemplos fornecidos
4. ✅ **Criar testes unitários** - Teste guards e permissões
5. ✅ **Adicionar auditoria** - Log de ações administrativas

## ❓ Dúvidas?

Se tiver dúvidas ou precisar de ajustes, consulte os arquivos de documentação ou me pergunte!

---

✨ **Sistema de Roles implementado com sucesso!** ✨
