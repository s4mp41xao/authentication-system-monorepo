# 📋 Lista Completa de Rotas do Backend

## 🌐 Root

- `GET /` - Retorna mensagem de boas-vindas

---

## 🔐 Autenticação (`/auth`)

Rotas públicas para gerenciamento de autenticação:

| Método | Rota            | Descrição                | Guards                  |
| ------ | --------------- | ------------------------ | ----------------------- |
| `POST` | `/auth/signup`  | Registro de novo usuário | `PreventOriSignupGuard` |
| `POST` | `/auth/signin`  | Login de usuário         | -                       |
| `POST` | `/auth/signout` | Logout de usuário        | -                       |

### Body Examples:

```json
// Signup
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "INFLUENCER" // ou "BRAND"
}

// Signin
{
  "email": "user@example.com",
  "password": "senha123"
}
```

---

## 👑 Administração (`/admin`)

**🔒 Todas as rotas protegidas - apenas ORI (administradores)**

### Dashboard e Estatísticas

| Método | Rota               | Descrição                                                          |
| ------ | ------------------ | ------------------------------------------------------------------ |
| `GET`  | `/admin/dashboard` | Dashboard com estatísticas (campanhas ativas, influencers, marcas) |

### Gerenciamento de Usuários

| Método   | Rota                    | Descrição                           |
| -------- | ----------------------- | ----------------------------------- |
| `POST`   | `/admin/users`          | Criar novo usuário (incluindo ORIs) |
| `GET`    | `/admin/users`          | Listar todos os usuários            |
| `PATCH`  | `/admin/users/:id/role` | Atualizar role de um usuário        |
| `DELETE` | `/admin/users/:id`      | Remover um usuário                  |

### Gerenciamento de Influencers

| Método | Rota                 | Descrição                               |
| ------ | -------------------- | --------------------------------------- |
| `GET`  | `/admin/influencers` | Listar todos os influencers registrados |

**Response Example:**

```json
{
  "message": "Lista de todos os influencers registrados",
  "total": 120,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "name": "João Silva",
      "email": "joao@example.com",
      "bio": "Influenciador digital",
      "instagram": "@joaosilva",
      "tiktok": "@joaosilva",
      "youtube": "joaosilvaofficial",
      "followers": 150000,
      "active": true,
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  ]
}
```

### Gerenciamento de Marcas

| Método | Rota            | Descrição                          |
| ------ | --------------- | ---------------------------------- |
| `GET`  | `/admin/brands` | Listar todas as marcas registradas |

**Response Example:**

```json
{
  "message": "Lista de todas as marcas registradas",
  "total": 35,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "name": "Marca XYZ",
      "email": "contato@marcaxyz.com",
      "description": "Empresa de tecnologia",
      "website": "https://marcaxyz.com",
      "industry": "Tecnologia",
      "active": true,
      "createdAt": "2025-10-20T11:00:00.000Z",
      "updatedAt": "2025-10-20T11:00:00.000Z"
    }
  ]
}
```

### Gerenciamento de Campanhas

| Método | Rota                                                | Descrição                           |
| ------ | --------------------------------------------------- | ----------------------------------- |
| `GET`  | `/admin/campaigns`                                  | Listar todas as campanhas ativas    |
| `GET`  | `/admin/campaigns/:id`                              | Detalhes de uma campanha específica |
| `POST` | `/admin/campaigns`                                  | Criar nova campanha                 |
| `POST` | `/admin/campaigns/:campaignId/assign/:influencerId` | Atribuir influencer a campanha      |

**Create Campaign Body:**

```json
{
  "name": "Campanha Verão 2025",
  "brandId": "507f1f77bcf86cd799439012",
  "description": "Campanha de verão para promover novos produtos",
  "status": "active", // "active", "inactive", "completed"
  "budget": 50000,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-03-31T23:59:59.000Z"
}
```

---

## 🧪 Exemplos (`/example`)

Rotas de exemplo para demonstrar controle de acesso por roles:

| Método | Rota                             | Roles Permitidos             | Descrição                      |
| ------ | -------------------------------- | ---------------------------- | ------------------------------ |
| `GET`  | `/example/admin-only`            | `ORI`                        | Apenas administradores         |
| `GET`  | `/example/brands-and-admin`      | `BRAND`, `ORI`               | Marcas e administradores       |
| `GET`  | `/example/influencers-and-admin` | `INFLUENCER`, `ORI`          | Influencers e administradores  |
| `GET`  | `/example/all-users`             | `INFLUENCER`, `BRAND`, `ORI` | Todos os usuários autenticados |
| `GET`  | `/example/test-auth`             | `INFLUENCER`, `BRAND`, `ORI` | Teste de autenticação          |

---

## 👥 Roles Disponíveis

| Role         | Descrição                |
| ------------ | ------------------------ |
| `ORI`        | Administrador do sistema |
| `BRAND`      | Marca/Empresa            |
| `INFLUENCER` | Influenciador            |

---

## 🔒 Autenticação e Autorização

### Middleware Global

- `AuthMiddleware` - Aplicado em todas as rotas (`*`)

### Guards por Controller

- `/auth/*` - Rotas públicas (exceto signup que tem `PreventOriSignupGuard`)
- `/admin/*` - `RolesGuard` + `@Roles(UserRole.ORI)`
- `/example/*` - `RolesGuard` + `@Roles(...)` conforme a rota

### Como Funciona

1. Todas as requisições passam pelo `AuthMiddleware`
2. O middleware verifica e anexa informações do usuário à requisição
3. Os Guards verificam se o usuário tem as roles necessárias
4. Se não autorizado, retorna erro 403 (Forbidden)

---

## 📊 Status de Campanhas

| Status      | Descrição                        |
| ----------- | -------------------------------- |
| `active`    | Campanha ativa e em execução     |
| `inactive`  | Campanha temporariamente inativa |
| `completed` | Campanha finalizada              |

---

## 🗄️ Schemas do Banco de Dados

### Influencer

```typescript
{
  userId: string;
  name: string;
  email: string;
  bio?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  followers: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Brand

```typescript
{
  userId: string;
  name: string;
  email: string;
  description?: string;
  website?: string;
  industry?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Campaign

```typescript
{
  name: string;
  brandId: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  assignedInfluencers: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Próximas Implementações

- [ ] Paginação nas listagens
- [ ] Filtros e busca avançada
- [ ] Sistema de métricas e relatórios
- [ ] Interface completa de atribuição de campanhas
- [ ] Notificações em tempo real
- [ ] Upload de imagens/arquivos
- [ ] Sistema de aprovação de campanhas
- [ ] Dashboard com gráficos interativos

---

## 📝 Notas Importantes

1. **Criação de ORI**: Apenas administradores existentes podem criar novos ORIs via `/admin/users`
2. **Auto-registro**: Usuários públicos só podem se registrar como `INFLUENCER` ou `BRAND`
3. **Cookies**: As sessões são gerenciadas via cookies (`better-auth.session_token`)
4. **CORS**: Configure adequadamente para ambiente de produção
5. **Ambiente**: Certifique-se de ter o `.env` configurado corretamente

---

## 🔗 Links Úteis

- [Documentação Completa Admin Routes](./src/admin/ADMIN-ROUTES.md)
- [Guia de Integração Frontend](./test/guides/FRONTEND-ADMIN-INTEGRATION.md)
- [Guia de Criação de Admin](./test/guides/CRIAR-ADMIN.md)
- [Documentação de Roles](./test/guides/ROLES.md)
