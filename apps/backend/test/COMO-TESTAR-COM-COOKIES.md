# 🔐 Como Testar Rotas Protegidas no VS Code REST Client

## Problema
O VS Code REST Client não compartilha cookies automaticamente entre diferentes arquivos `.http`, então você precisa passar o token manualmente.

## 📋 Solução: Passo a Passo

### **Passo 1: Fazer Login**

1. Abra o arquivo `test/test-auth.http`
2. Execute a requisição de login do admin ORI:

```http
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@ori.com",
  "password": "?cN^3Yyb/4@GkbH"
}
```

### **Passo 2: Copiar o Token da Resposta**

Após executar o login, você verá uma resposta **NO BODY** (não no header):

```json
{
  "redirect": false,
  "token": "taLdStEHaqXlSNW5GYXGfTwIiAiXGVot",  // <- COPIE ESTE TOKEN
  "user": {
    "id": "68f6481fe6f24c080f73ebb2",
    "email": "admin@ori.com",
    "name": "Administrador ORI",
    "role": "ORI"
  }
}
```

**COPIE** apenas o valor do campo `token` (sem as aspas):

```
taLdStEHaqXlSNW5GYXGfTwIiAiXGVot
```

⚠️ **IMPORTANTE:** O token vem no **BODY** da resposta, não no header Set-Cookie!

### **Passo 3: Colar o Token no Arquivo de Testes**

1. Abra o arquivo `test/test-admin-routes.http`
2. No início do arquivo, localize a variável `@sessionToken`
3. Cole o token copiado:

```http
@sessionToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzE3YTgyZTY0YWJjZGVmMTIzNDU2NzgiLCJpYXQiOjE3Mjk2MTc4NzAsImV4cCI6MTczMjIwOTg3MH0.abcd1234efgh5678ijkl
```

### **Passo 4: Executar as Requisições**

Agora você pode executar qualquer requisição do arquivo! O token será enviado automaticamente:

```http
### Obter estatísticas do dashboard
GET http://localhost:3000/admin/dashboard
Content-Type: application/json
Cookie: better-auth.session_token={{sessionToken}}
```

---

## 🎯 Exemplo Completo

### 1. Login (test-auth.http)
```http
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@ori.com",
  "password": "?cN^3Yyb/4@GkbH"
}
```

**Resposta:**
```
HTTP/1.1 200 OK
Set-Cookie: better-auth.session_token=TOKEN_AQUI; Path=/; HttpOnly
...
{
  "user": {
    "id": "...",
    "email": "admin@ori.com",
    "role": "ORI"
  }
}
```

### 2. Copiar Token
```
TOKEN_AQUI = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Usar Token (test-admin-routes.http)
```http
@sessionToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### Testar dashboard
GET http://localhost:3000/admin/dashboard
Content-Type: application/json
Cookie: better-auth.session_token={{sessionToken}}
```

**Resposta esperada:**
```json
{
  "message": "Dashboard administrativo",
  "stats": {
    "activeCampaigns": 0,
    "totalInfluencers": 0,
    "totalBrands": 0
  }
}
```

---

## ⚠️ Problemas Comuns

### Erro 403 Forbidden
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

**Causas:**
1. ❌ Token não foi copiado corretamente
2. ❌ Token expirou (faça login novamente)
3. ❌ Usuário não tem role ORI
4. ❌ Variável `@sessionToken` não foi definida

**Solução:**
- Refaça o login e copie um novo token
- Verifique se copiou o token completo (sem espaços extras)
- Certifique-se de que está logado com um usuário ORI

### Erro 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Causa:** Token inválido ou não foi enviado

**Solução:**
- Verifique se a linha `Cookie: better-auth.session_token={{sessionToken}}` está presente
- Faça login novamente e pegue um novo token

### Token Expirado
Os tokens do Better Auth têm validade limitada. Se você receber erro 401 depois de algum tempo:
1. Faça login novamente
2. Copie o novo token
3. Atualize a variável `@sessionToken`

---

## 💡 Dica: Extensão REST Client

Se quiser que os cookies sejam mantidos automaticamente, você pode:

1. **Usar a mesma sessão no arquivo**: Coloque todas as requisições no mesmo arquivo `.http`
2. **Usar Postman ou Insomnia**: Essas ferramentas gerenciam cookies automaticamente
3. **Usar o script de compartilhamento de cookies** (avançado)

---

## 🔄 Alternativa: Usar um Único Arquivo

Você pode colocar o login e os testes no mesmo arquivo para que o REST Client mantenha os cookies:

```http
### 1. Fazer Login
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@ori.com",
  "password": "?cN^3Yyb/4@GkbH"
}

### 2. Testar Dashboard (use os cookies da requisição anterior)
GET http://localhost:3000/admin/dashboard
Content-Type: application/json

### 3. Listar Influencers
GET http://localhost:3000/admin/influencers
Content-Type: application/json
```

**Nota:** Isso só funciona se você executar as requisições em sequência dentro do mesmo arquivo.

---

## ✅ Checklist de Teste

- [ ] Backend está rodando (`npm run start:dev`)
- [ ] Usuário ORI foi criado (`npm run create-admin`)
- [ ] Fez login no `test-auth.http`
- [ ] Copiou o token do header `Set-Cookie`
- [ ] Colou o token na variável `@sessionToken` no `test-admin-routes.http`
- [ ] Executou a requisição e obteve sucesso (status 200)

---

## 🎓 Para Desenvolvedores Frontend

No frontend (React/Next.js), os cookies são gerenciados automaticamente pelo navegador quando você usa `credentials: 'include'` ou `withCredentials: true`:

```typescript
// Fetch API
fetch('http://localhost:3000/admin/dashboard', {
  method: 'GET',
  credentials: 'include', // Envia cookies automaticamente
});

// Axios
axios.get('http://localhost:3000/admin/dashboard', {
  withCredentials: true, // Envia cookies automaticamente
});
```

O navegador gerencia os cookies automaticamente, então você não precisa copiar/colar tokens manualmente! 🎉
