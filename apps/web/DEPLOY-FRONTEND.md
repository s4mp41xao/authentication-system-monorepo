# 🚀 Deploy do Frontend no Vercel

## Passo a Passo

### 1️⃣ Acessar Vercel Dashboard
Acesse: https://vercel.com/new

### 2️⃣ Importar Projeto
- Clique em **"Add New..."** → **"Project"**
- Selecione o repositório: **`s4mp41xao/authentication-system-monorepo`**
- Clique em **Import**

### 3️⃣ Configurar Deploy do Frontend

**Configure as seguintes opções:**

#### 📁 **Project Settings:**
```
Project Name: authentication-system-monorepo-front
Framework Preset: Vite
Root Directory: apps/web
```

#### ⚙️ **Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 🌍 **Environment Variables:**

Adicione as seguintes variáveis:

```
VITE_API_URL = https://authentication-system-monorepo-back.vercel.app
```

### 4️⃣ Deploy
- Clique em **"Deploy"**
- Aguarde ~2-3 minutos

### 5️⃣ Após Deploy Completar

#### Atualizar Backend com URL do Frontend:

Você vai receber uma URL tipo:
```
https://authentication-system-monorepo-front.vercel.app
```

Vá até as **Environment Variables do BACKEND**:
https://vercel.com/s4mp41xao/authentication-system-monorepo-back/settings/environment-variables

E **atualize** a variável:
```
FRONTEND_URL = https://authentication-system-monorepo-front.vercel.app
```

⚠️ **IMPORTANTE:** Isso vai fazer o backend fazer redeploy automático para atualizar o CORS.

---

## ✅ Checklist Final

- [ ] Frontend deployado no Vercel
- [ ] `VITE_API_URL` configurado apontando para o backend
- [ ] `FRONTEND_URL` no backend atualizado com a URL do frontend
- [ ] CORS atualizado automaticamente
- [ ] Testar signup/signin no frontend

---

## 🧪 Testando a Integração

Após ambos deployados:

1. Acesse: `https://authentication-system-monorepo-front.vercel.app`
2. Vá para **/signup**
3. Crie uma conta de teste
4. Faça login
5. Acesse o dashboard correspondente ao seu role

---

## 🎯 URLs Finais

| Serviço | URL |
|---------|-----|
| **Backend API** | https://authentication-system-monorepo-back.vercel.app |
| **Frontend Web** | https://authentication-system-monorepo-front.vercel.app _(após deploy)_ |
| **MongoDB** | MongoDB Atlas (configurado) |

---

## 🔧 Troubleshooting

### ❌ Erro de CORS
**Sintoma:** `Access-Control-Allow-Origin` error

**Solução:**
1. Verifique se `FRONTEND_URL` está correto no backend
2. Force redeploy do backend após mudar a variável
3. Verifique se a URL não tem `/` no final

### ❌ API não responde
**Sintoma:** `Failed to fetch` ou timeout

**Solução:**
1. Verifique se `VITE_API_URL` está correto
2. Teste o backend direto: `curl https://authentication-system-monorepo-back.vercel.app/`
3. Verifique os logs do backend no Vercel

### ❌ Build falha
**Sintoma:** Deploy failed durante build

**Solução:**
1. Verifique se `Root Directory: apps/web` está correto
2. Rode `npm run build` localmente primeiro
3. Verifique os logs do build no Vercel

---

## 📚 Documentação de Referência

- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Monorepo Setup](https://vercel.com/docs/monorepos)

