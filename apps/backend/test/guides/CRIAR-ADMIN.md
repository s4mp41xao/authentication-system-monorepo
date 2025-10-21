# 🔑 Guia: Como Criar um Usuário Admin (ORI)

## Método 1: Usando o Script Automatizado (Recomendado) 🚀

### Passo 1: Execute o script

```bash
npm run create-admin
```

### Passo 2: Dados padrão criados

- **Email**: `admin@ori.com`
- **Senha**: `Admin@123456`
- **Nome**: `Administrador ORI`
- **Role**: `ori`

⚠️ **IMPORTANTE**: Altere estes dados no arquivo `scripts/create-admin.ts` antes de executar, ou mude a senha após o primeiro login!

---

## Método 2: Via HTTP Request (Desabilitando Guard Temporariamente)

### Opção A: Comentar o Guard temporariamente

1. Abra `src/auth/auth.controller.ts`
2. Comente o guard `@UseGuards(PreventOriSignupGuard)` no endpoint signup
3. Faça a requisição:

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ori.com",
    "password": "Admin@123456",
    "name": "Administrador ORI",
    "role": "ori"
  }'
```

4. Descomente o guard novamente
5. Faça login:

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ori.com",
    "password": "Admin@123456"
  }'
```

---

## Método 3: Usando o AdminController (após ter um admin)

Uma vez que você tenha um admin criado, pode criar outros admins usando o endpoint:

```bash
POST http://localhost:3000/admin/users
Authorization: Bearer <token_do_admin>
Content-Type: application/json

{
  "email": "outro-admin@ori.com",
  "password": "SenhaSegura123",
  "name": "Outro Administrador",
  "role": "ori"
}
```

---

## Método 4: Diretamente no MongoDB (Manualmente)

### Passo 1: Conecte-se ao MongoDB

```bash
mongosh "mongodb://localhost:27017/seu_database"
```

### Passo 2: Crie o usuário

```javascript
// Primeiro, gere um hash da senha (você precisará fazer isso em um script Node.js separado)
// Ou use uma ferramenta online de bcrypt hash

db.user.insertOne({
  email: 'admin@ori.com',
  name: 'Administrador ORI',
  role: 'ori',
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Depois, crie a conta com a senha
// Substitua <USER_ID> pelo ID retornado acima
// Substitua <HASHED_PASSWORD> pelo hash bcrypt da senha

db.account.insertOne({
  userId: '<USER_ID>',
  accountId: 'admin@ori.com',
  providerId: 'credential',
  password: '<HASHED_PASSWORD>',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

---

## ✅ Verificar se o Admin foi criado

### Via MongoDB:

```bash
mongosh "mongodb://localhost:27017/seu_database"
```

```javascript
db.user.findOne({ email: 'admin@ori.com' });
```

### Via Login:

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ori.com",
    "password": "Admin@123456"
  }'
```

Se retornar sucesso, o admin foi criado corretamente!

---

## 🛡️ Segurança - Melhores Práticas

### 1. Altere a senha padrão imediatamente

Após criar o primeiro admin, faça login e altere a senha para algo mais seguro.

### 2. Use senhas fortes

- Mínimo 12 caracteres
- Letras maiúsculas e minúsculas
- Números
- Caracteres especiais

### 3. Não commite senhas no Git

Sempre use variáveis de ambiente para dados sensíveis:

```typescript
const adminData = {
  email: process.env.ADMIN_EMAIL || 'admin@ori.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  name: process.env.ADMIN_NAME || 'Administrador ORI',
  role: 'ori',
};
```

### 4. Limite criação de admins

O guard `PreventOriSignupGuard` já está ativo. Apenas admins existentes podem criar novos admins via `/admin/users`.

---

## 🐛 Troubleshooting

### Erro: "Email already exists"

O usuário já foi criado. Use as credenciais existentes ou escolha outro email.

### Erro: "DATABASE_URL is not defined"

Verifique se o arquivo `.env` existe e tem a variável `DATABASE_URL` configurada.

### Erro: "Cannot connect to MongoDB"

1. Verifique se o MongoDB está rodando
2. Verifique se a URL de conexão está correta
3. Teste a conexão manualmente: `mongosh "sua_url_do_mongodb"`

### Script não executa

Instale o tsx se necessário:

```bash
npm install -D tsx
```

Ou execute diretamente:

```bash
npx tsx scripts/create-admin.ts
```

---

## 📝 Exemplo Completo: Criar e Fazer Login

```bash
# 1. Criar o admin
npm run create-admin

# 2. Fazer login
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ori.com",
    "password": "Admin@123456"
  }'

# 3. Usar o token retornado para acessar rotas protegidas
# Copie o token do resultado e use nas próximas requisições
```

---

## 🎯 Próximos Passos

Depois de criar o admin:

1. ✅ Faça login com as credenciais
2. ✅ Teste o acesso às rotas administrativas (`/admin/*`)
3. ✅ Altere a senha padrão
4. ✅ Crie outros usuários (brands e influencers) se necessário
5. ✅ Configure um sistema de convite para futuros admins

---

**Dúvidas?** Consulte os arquivos de documentação ou verifique os logs do servidor para mais detalhes!
