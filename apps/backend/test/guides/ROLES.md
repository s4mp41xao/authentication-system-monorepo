# Sistema de Roles - Documentação

## Visão Geral

Este projeto implementa um sistema de roles (cargos) com três tipos de usuários:

- **influencer**: Usuários influenciadores (acesso normal)
- **brand**: Usuários de marcas (acesso normal com diferenças específicas)
- **ori**: Administradores do sistema (acesso total)

## Estrutura

### Enum de Roles

Localizado em: `src/auth/enums/user-role.enum.ts`

```typescript
export enum UserRole {
  INFLUENCER = 'influencer',
  BRAND = 'brand',
  ORI = 'ori',
}
```

### Funções Helper

- `isAdminRole(role)`: Verifica se o role é administrativo
- `hasAdminAccess(role)`: Verifica se o usuário tem acesso administrativo
- `getRolePermissions(role)`: Retorna as permissões do role

## Como Usar

### 1. Criar um Novo Usuário

**Endpoint**: `POST /auth/signup`

**Body**:

```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "influencer"
}
```

**Roles válidos**: `influencer`, `brand`, `ori`

### 2. Proteger Rotas com Roles

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserRole } from './auth/enums/user-role.enum';

@Controller('api')
@UseGuards(RolesGuard)
export class MyController {
  // Apenas administradores
  @Get('admin')
  @Roles(UserRole.ORI)
  adminRoute() {
    return { message: 'Admin only' };
  }

  // Brands e Admins
  @Get('brands')
  @Roles(UserRole.BRAND, UserRole.ORI)
  brandRoute() {
    return { message: 'Brands and Admins' };
  }

  // Influencers e Admins
  @Get('influencers')
  @Roles(UserRole.INFLUENCER, UserRole.ORI)
  influencerRoute() {
    return { message: 'Influencers and Admins' };
  }
}
```

### 3. Verificar Permissões no Código

```typescript
import { getRolePermissions, UserRole } from './auth/enums/user-role.enum';

const user = { role: UserRole.ORI };
const permissions = getRolePermissions(user.role);

if (permissions.isAdmin) {
  // Código para administradores
}

if (permissions.canCreateCampaigns) {
  // Código para quem pode criar campanhas
}
```

## Permissões por Role

### ORI (Administrador)

- ✅ isAdmin: true
- ✅ canManageUsers: true
- ✅ canManageBrands: true
- ✅ canManageInfluencers: true
- ✅ canViewAnalytics: true
- ✅ Acesso total ao sistema

### BRAND (Marca)

- ❌ isAdmin: false
- ❌ canManageUsers: false
- ✅ canViewAnalytics: true
- ✅ canCreateCampaigns: true
- Pode criar e gerenciar campanhas
- Pode visualizar analytics

### INFLUENCER (Influenciador)

- ❌ isAdmin: false
- ❌ canManageUsers: false
- ✅ canViewAnalytics: true
- ✅ canApplyToCampaigns: true
- Pode se candidatar a campanhas
- Pode visualizar suas próprias métricas

## Testes

### Teste de Criação de Usuário

```bash
# Criar Influencer
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@test.com",
    "password": "senha123",
    "name": "Influencer Teste",
    "role": "influencer"
  }'

# Criar Brand
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@test.com",
    "password": "senha123",
    "name": "Brand Teste",
    "role": "brand"
  }'

# Criar Admin (ORI)
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "senha123",
    "name": "Admin Teste",
    "role": "ori"
  }'
```

## Próximos Passos

1. **Implementar Middleware de Autenticação**: Adicione um middleware para verificar se o usuário está autenticado antes de verificar roles
2. **Adicionar Validação no Backend**: Validar que apenas ORI pode promover usuários a admin
3. **Criar Rotas de Gerenciamento**: Rotas para ORI gerenciar usuários, brands e influencers
4. **Implementar Auditoria**: Log de ações administrativas
5. **Adicionar Testes Unitários**: Testes para guards e decorators

## Segurança

⚠️ **IMPORTANTE**:

- Nunca permita que usuários comuns se registrem como ORI sem validação adicional
- Considere implementar um sistema de convite para roles administrativos
- Implemente rate limiting nos endpoints de autenticação
- Use HTTPS em produção
- Mantenha o `BETTER_AUTH_SECRET` seguro

## Exemplo de Regra de Negócio

```typescript
// No seu service
async createCampaign(userId: string) {
  const user = await this.getUserById(userId);
  const permissions = getRolePermissions(user.role);

  if (!permissions.canCreateCampaigns) {
    throw new ForbiddenException('Você não tem permissão para criar campanhas');
  }

  // Criar campanha...
}
```
