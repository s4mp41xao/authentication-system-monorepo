# 🚀 Guia de Deploy na Vercel

Este guia explica como fazer deploy do Sistema de Autenticação na Vercel, incluindo backend (NestJS) e frontend (React + Vite).

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (para banco de dados)
- Repositório no GitHub com o código
- Node.js 18+ instalado localmente

## 🗄️ 1. Configurar MongoDB Atlas

### 1.1 Criar Cluster

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com)
2. Crie um novo cluster (Free Tier M0 é suficiente para começar)
3. Configure o usuário do banco de dados:
   - Database Access → Add New Database User
   - Crie um usuário com senha forte
   - Salve as credenciais com segurança

### 1.2 Configurar Acesso de Rede

1. Network Access → Add IP Address
2. Clique em "Allow Access from Anywhere" (0.0.0.0/0)
   - Isso é necessário para a Vercel acessar seu banco
3. Confirme

### 1.3 Obter Connection String

1. Clusters → Connect → Connect your application
2. Copie a connection string (formato: `mongodb+srv://...`)
3. Substitua `<password>` pela senha do seu usuário
4. Adicione o nome do banco após `.net/`: `mongodb+srv://user:pass@cluster.net/authentication-system?retryWrites=true&w=majority`

## 🔐 2. Gerar Chave Secreta

Execute no terminal para gerar uma chave secreta forte:

```bash
openssl rand -base64 32
```

Guarde essa chave - você vai precisar dela nas variáveis de ambiente.

## 📦 3. Deploy do Backend

### 3.1 Criar Projeto na Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Importe seu repositório do GitHub
4. Configure o projeto:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Configurar Variáveis de Ambiente

Em "Settings" → "Environment Variables", adicione:

| Variable             | Value                                                 | Environment         |
| -------------------- | ----------------------------------------------------- | ------------------- |
| `MONGODB_URI`        | Sua connection string do MongoDB Atlas                | Production, Preview |
| `BETTER_AUTH_SECRET` | Chave gerada com openssl                              | Production, Preview |
| `BETTER_AUTH_URL`    | URL do backend (ex: `https://seu-backend.vercel.app`) | Production          |
| `FRONTEND_URL`       | URL do frontend (será criada no passo 4)              | Production, Preview |
| `NODE_ENV`           | `production`                                          | Production          |

**Importante:** Para `BETTER_AUTH_URL` e `FRONTEND_URL`, você pode usar URLs temporárias primeiro e atualizar depois do deploy.

### 3.3 Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Anote a URL gerada (ex: `https://seu-backend.vercel.app`)

## 🎨 4. Deploy do Frontend

### 4.1 Criar Segundo Projeto na Vercel

1. Volte ao [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Importe o **mesmo repositório** do GitHub
4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Configurar Variáveis de Ambiente

Em "Settings" → "Environment Variables", adicione:

| Variable       | Value                                                 | Environment         |
| -------------- | ----------------------------------------------------- | ------------------- |
| `VITE_API_URL` | URL do backend (ex: `https://seu-backend.vercel.app`) | Production, Preview |

### 4.3 Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Anote a URL gerada (ex: `https://seu-frontend.vercel.app`)

## 🔄 5. Atualizar Variáveis Cross-Reference

Agora que você tem ambas as URLs, atualize as variáveis:

### 5.1 Atualizar Backend

1. Vá para o projeto do backend na Vercel
2. Settings → Environment Variables
3. Atualize `FRONTEND_URL` com a URL do frontend
4. Clique em "Redeploy" para aplicar as mudanças

### 5.2 Verificar CORS

Verifique se o CORS está configurado para aceitar a URL do frontend no arquivo `apps/backend/src/main.ts`.

## 🌱 6. Popular Banco de Dados (Opcional)

Se quiser popular o banco com dados iniciais:

### 6.1 Localmente via Script

```bash
# Configure .env local com MONGODB_URI do Atlas
cd apps/backend

# Executar seed
npm run seed-with-auth
```

### 6.2 Criar Usuário Admin

```bash
npm run create-admin
```

Ou crie manualmente via API após o deploy.

## ✅ 7. Testar Aplicação

1. Acesse a URL do frontend: `https://seu-frontend.vercel.app`
2. Tente fazer signup de um novo usuário
3. Faça login com as credenciais criadas
4. Verifique se está redirecionando corretamente baseado no role

### Endpoints para Testar

```bash
# Health check
curl https://seu-backend.vercel.app/api/health

# Signup (via Postman ou frontend)
POST https://seu-backend.vercel.app/api/auth/signup
```

## 🔍 8. Troubleshooting

### Erro 500 no Backend

- Verifique os logs na Vercel: Project → Deployments → [seu deploy] → Functions
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o MongoDB Atlas permite conexões de qualquer lugar

### CORS Error

- Certifique-se de que `FRONTEND_URL` está configurada no backend
- Verifique se a URL do frontend está correta (sem trailing slash)
- Redeploy do backend após alterar variáveis

### Cookies não funcionam

- Certifique-se de que ambas as URLs usam HTTPS
- Verifique se `credentials: true` está configurado no CORS
- No Better Auth, confirme que `sameSite: 'none'` está configurado para produção

### Build Fail

- Verifique os logs de build
- Confirme que as dependências estão corretas no `package.json`
- Teste o build localmente: `npm run build`

## 📝 9. Configurações Adicionais Recomendadas

### 9.1 Domínio Customizado (Opcional)

1. Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções da Vercel

### 9.2 Deploy Automático

Por padrão, a Vercel já configura:

- ✅ Deploy automático quando você faz push na branch `main`
- ✅ Preview deployments para Pull Requests
- ✅ Rollback instantâneo se algo der errado

### 9.3 Monitoramento

- Analytics: Dashboard → Analytics (ver tráfego e performance)
- Logs: Deployments → Functions → View Function Logs
- Speed Insights: Ativar nas configurações para métricas de performance

## 🔒 10. Segurança

### Checklist de Segurança

- [ ] `BETTER_AUTH_SECRET` é uma string aleatória forte (32+ caracteres)
- [ ] Credenciais do MongoDB estão apenas nas variáveis de ambiente
- [ ] MongoDB Atlas permite apenas IPs necessários (ou 0.0.0.0/0 para Vercel)
- [ ] HTTPS está habilitado (automático na Vercel)
- [ ] Cookies têm `httpOnly: true` e `secure: true` em produção
- [ ] CORS está configurado apenas para seu frontend

## 🎉 Pronto!

Sua aplicação está no ar!

**URLs de exemplo:**

- Frontend: `https://seu-frontend.vercel.app`
- Backend: `https://seu-backend.vercel.app`
- API: `https://seu-backend.vercel.app/api`

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)

---

**Dúvidas?** Abra uma issue no repositório ou consulte a documentação oficial da Vercel.
