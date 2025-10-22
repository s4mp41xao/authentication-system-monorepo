# 🔍 Debug do Problema de Autenticação

## 📋 O que está acontecendo

Quando você faz login, o Better Auth retorna:

```json
{
  "token": "taLdStEHaqXlSNW5GYXGfTwIiAiXGVot",
  "user": { ... }
}
```

Esse token precisa ser enviado como cookie nas próximas requisições.

## 🧪 Como Testar (Com Debug)

### Passo 1: Reinicie o Backend

```bash
cd apps/backend
npm run start:dev
```

### Passo 2: Faça Login e Observe os Logs

Execute no `test-auth.http`:

```http
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@ori.com",
  "password": "?cN^3Yyb/4@GkbH"
}
```

**Copie o token do response:**

```json
{
  "token": "SEU_TOKEN_AQUI" // <- Copie isso
}
```

### Passo 3: Teste a Rota Admin

No arquivo `test-admin-routes.http`, atualize o token:

```http
@sessionToken = SEU_TOKEN_AQUI

### Teste
GET http://localhost:3000/admin/dashboard
Content-Type: application/json
Cookie: better-auth.session_token={{sessionToken}}
```

### Passo 4: Verifique os Logs no Terminal

Quando você executar a requisição, verá logs como:

```
🔍 Headers recebidos: better-auth.session_token=SEU_TOKEN_AQUI
🔍 Sessão encontrada: Sim
👤 Usuário: admin@ori.com Role: ORI
```

**Se der erro:**

```
🔍 Headers recebidos: better-auth.session_token=SEU_TOKEN_AQUI
🔍 Sessão encontrada: Não
⚠️ Nenhuma sessão válida encontrada
```

## 🐛 Problemas Possíveis

### Problema 1: Token Inválido

**Sintoma:** Logs mostram "Sessão encontrada: Não"

**Solução:**

1. Faça logout: `POST /auth/signout`
2. Faça login novamente
3. Copie o novo token

### Problema 2: Token Copiado Incorretamente

**Sintoma:** Erro 403 ou sessão não encontrada

**Solução:**

- Certifique-se de copiar APENAS o token (sem aspas, espaços ou caracteres extras)
- Exemplo correto: `taLdStEHaqXlSNW5GYXGfTwIiAiXGVot`
- Exemplo errado: `"taLdStEHaqXlSNW5GYXGfTwIiAiXGVot"` (com aspas)

### Problema 3: Cookie Não Está Sendo Enviado

**Sintoma:** Logs mostram "Headers recebidos: undefined"

**Solução:**

- Verifique se a linha `Cookie: better-auth.session_token={{sessionToken}}` está presente
- Certifique-se de que a variável `@sessionToken` está definida

### Problema 4: Usuário Não Tem Role ORI

**Sintoma:** Logs mostram usuário, mas erro 403

**Solução:**

- Verifique no log: `👤 Usuário: ... Role: ...`
- Se o role não for "ORI", você não tem permissão
- Use `npm run create-admin` para criar um admin

## 📝 Exemplo Completo de Teste

```http
# 1. Defina o token (cole o valor do login)
@sessionToken = taLdStEHaqXlSNW5GYXGfTwIiAiXGVot

# 2. Teste uma rota simples primeiro
GET http://localhost:3000/example/test-auth
Content-Type: application/json
Cookie: better-auth.session_token={{sessionToken}}

# 3. Se funcionar, teste a rota admin
GET http://localhost:3000/admin/dashboard
Content-Type: application/json
Cookie: better-auth.session_token={{sessionToken}}
```

## 🎯 Checklist de Debug

Execute estes passos em ordem:

- [ ] Backend está rodando com `npm run start:dev`
- [ ] Fez login e copiou o token do body (não do header)
- [ ] Colou o token na variável `@sessionToken` (sem aspas)
- [ ] Executou uma requisição e verificou os logs no terminal
- [ ] Logs mostram "Sessão encontrada: Sim"
- [ ] Logs mostram "Role: ORI"
- [ ] Requisição retorna 200 OK (não 403)

## 🔧 Se Nada Funcionar

Teste a solução alternativa no arquivo `test-admin-completo.http` que mantém o contexto da sessão:

```http
### 1. Login
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@ori.com",
  "password": "?cN^3Yyb/4@GkbH"
}

### 2. Imediatamente teste (cookies mantidos automaticamente)
GET http://localhost:3000/admin/dashboard
Content-Type: application/json
```

Execute as requisições **em sequência** no mesmo arquivo e o REST Client manterá os cookies.

## 📞 O que Enviar se Precisar de Ajuda

1. **Logs do terminal** quando executa a requisição
2. **Response do login** (mascare dados sensíveis)
3. **Exatamente como está passando o token** na requisição
4. **Status code** da resposta (403, 401, etc)
