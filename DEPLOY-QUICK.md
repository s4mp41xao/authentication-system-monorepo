# 🚀 Deploy Rápido - Vercel

## ⚡ Quick Start (5 minutos)

### 1️⃣ MongoDB Atlas

```bash
# 1. Crie conta em https://cloud.mongodb.com
# 2. Crie cluster gratuito (M0)
# 3. Database Access → Crie usuário
# 4. Network Access → Adicione 0.0.0.0/0
# 5. Copie connection string
```

### 2️⃣ Gerar Secret

```bash
openssl rand -base64 32
```

### 3️⃣ Deploy Backend

```
1. Vercel.com → New Project → Import do GitHub
2. Root Directory: apps/backend
3. Framework: Other
4. Adicione variáveis:
   - MONGODB_URI=mongodb+srv://user:pass@cluster.net/dbname
   - BETTER_AUTH_SECRET=(resultado do openssl)
   - BETTER_AUTH_URL=https://SEU-BACKEND.vercel.app
   - FRONTEND_URL=https://SEU-FRONTEND.vercel.app (adicionar depois)
   - NODE_ENV=production
5. Deploy
```

### 4️⃣ Deploy Frontend

```
1. Vercel.com → New Project → Mesmo repo
2. Root Directory: apps/web
3. Framework: Vite
4. Adicione variável:
   - VITE_API_URL=https://SEU-BACKEND.vercel.app
5. Deploy
```

### 5️⃣ Atualizar Backend

```
1. Volte no projeto do backend
2. Settings → Environment Variables
3. Atualize FRONTEND_URL com URL real do frontend
4. Redeploy
```

## ✅ Testar

```
Acesse: https://seu-frontend.vercel.app
Faça signup de um usuário
Teste login
```

## 📖 Documentação Completa

Ver [DEPLOY.md](./DEPLOY.md) para guia detalhado.

---

**Checklist:**

- [ ] MongoDB Atlas configurado
- [ ] Backend deployado na Vercel
- [ ] Frontend deployado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] CORS atualizado
- [ ] Signup/Login testado
