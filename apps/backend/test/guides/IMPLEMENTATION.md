# 🎯 Sistema de Roles Implementado

## ✅ O que foi criado

### 1. **Estrutura de Roles**

- ✅ `src/auth/enums/user-role.enum.ts` - Enum com os 3 tipos: `influencer`, `brand`, `ori`
- ✅ Funções helper para verificar permissões e acesso admin

### 2. **DTOs Atualizados**

- ✅ `src/auth/dto/signup.dto.ts` - Agora inclui validação do campo `role`

### 3. **Better Auth Configurado**

- ✅ `src/lib/auth.ts` - Configurado para aceitar campo customizado `role`
- ✅ `src/types/better-auth.d.ts` - Tipos TypeScript estendidos

### 4. **Sistema de Autorização**

- ✅ `src/auth/guards/roles.guard.ts` - Guard para proteger rotas
- ✅ `src/auth/decorators/roles.decorator.ts` - Decorator `@Roles()`
- ✅ `src/auth/middleware/auth.middleware.ts` - Middleware de autenticação

### 5. **Módulos Atualizados**

- ✅ `src/auth/auth.module.ts` - Exporta RolesGuard
- ✅ `src/app.module.ts` - Aplica middleware em todas as rotas
- ✅ `src/auth/auth.controller.ts` - Passa role no signup

### 6. **Documentação e Exemplos**

- ✅ `ROLES.md` - Documentação completa do sistema
- ✅ `test/test-roles.http` - Exemplos de requisições HTTP
- ✅ `src/example/example.controller.ts` - Controller de exemplo

## 🚀 Como Usar

### Criar Usuário com Role

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "senha123",
    "name": "User Name",
    "role": "influencer"
  }'
```

### Proteger Rotas

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserRole } from './auth/enums/user-role.enum';

@Controller('api')
@UseGuards(RolesGuard)
export class MyController {
  @Get('admin')
  @Roles(UserRole.ORI)
  adminOnly() {
    return { message: 'Somente admins' };
  }

  @Get('brands')
  @Roles(UserRole.BRAND, UserRole.ORI)
  brandsOnly() {
    return { message: 'Brands e Admins' };
  }
}
```

## 📊 Permissões por Role

| Permissão            | ORI (Admin) | BRAND | INFLUENCER |
| -------------------- | ----------- | ----- | ---------- |
| isAdmin              | ✅          | ❌    | ❌         |
| canManageUsers       | ✅          | ❌    | ❌         |
| canManageBrands      | ✅          | ❌    | ❌         |
| canManageInfluencers | ✅          | ❌    | ❌         |
| canViewAnalytics     | ✅          | ✅    | ✅         |
| canCreateCampaigns   | ✅          | ✅    | ❌         |
| canApplyToCampaigns  | ✅          | ❌    | ✅         |

## 🔐 Segurança

- ✅ Validação automática de roles no DTO
- ✅ Type-safety com TypeScript
- ✅ Guards para proteger rotas
- ✅ Middleware de autenticação global
- ✅ Integração com Better Auth

## 📝 Próximos Passos

1. **Testar** - Execute o servidor e teste os endpoints
2. **Validar ORI** - Adicione lógica para prevenir auto-registro como ORI
3. **Implementar Rotas** - Crie rotas específicas para cada role
4. **Testes Unitários** - Adicione testes para guards e permissões

## 🐛 Troubleshooting

Se encontrar erros, verifique:

- ✅ `.env` tem `DATABASE_URL` e `BETTER_AUTH_SECRET`
- ✅ MongoDB está rodando
- ✅ Dependências instaladas: `npm install`
- ✅ Tipos do TypeScript atualizados: `npm run build`

## 📚 Documentação Completa

Veja `ROLES.md` para documentação detalhada com exemplos e melhores práticas.
