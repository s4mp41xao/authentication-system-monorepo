# 🔧 Debug Final - Verificação de Sessões

## O Problema Identificado

O cookie está sendo enviado corretamente, mas o Better Auth retorna `session: null`. Isso significa que **a sessão não está sendo salva no MongoDB** quando você faz login.

## 🚀 Correções Aplicadas

### 1. **Instância do Auth Corrigida**
   - Agora armazena a instância completa do `auth` (não apenas `api`)
   - Adicionada configuração de sessão explícita

### 2. **Logs Melhorados**
   - Login mostra: userId, email, role, token
   - Middleware mostra: headers completos, sessão retornada

### 3. **Script de Verificação**
   - Novo comando: `npm run check-sessions`
   - Verifica collections, sessões e usuários no banco

## 🧪 Como Testar Agora

### Passo 1: Reinicie o Backend

```bash
cd apps/backend
# Pare com Ctrl+C se estiver rodando
npm run start:dev
```

### Passo 2: Verifique o Banco de Dados

Em outro terminal:

```bash
npm run check-sessions
```

Você verá:
- Collections existentes
- Sessões salvas
- Usuários cadastrados

### Passo 3: Faça Login

No arquivo `test/test-admin-completo.http`:

```http
POST http://localhost:3000/auth/signin
Content-Type: application/json

{
  "email": "admin@ori.com",
  "password": "?cN^3Yyb/4@GkbH"
}
```

**Observe os logs no terminal do backend:**

```
🔐 Tentando fazer login com: admin@ori.com
✅ Login bem-sucedido: {
  userId: '68f6481fe6f24c080f73ebb2',
  email: 'admin@ori.com',
  role: 'ORI',
  token: 'presente'
}
🍪 Definindo cookie com token: LjhDRfnmBobFFFYvLNEf1Oo6ink77aJk
```

### Passo 4: Verifique Se a Sessão Foi Criada

Execute novamente:

```bash
npm run check-sessions
```

Agora deve aparecer a sessão criada!

### Passo 5: Teste a Rota Admin

No mesmo arquivo, execute:

```http
GET http://localhost:3000/admin/dashboard
Content-Type: application/json
```

**Logs esperados:**

```
🔍 Headers recebidos: better-auth.session_token=LjhDRfnmBobFFFYvLNEf1Oo6ink77aJk
🔍 Sessão retornada: { "user": { "id": "...", "email": "admin@ori.com", "role": "ORI" } }
🔍 Sessão encontrada: Sim
👤 Usuário: admin@ori.com Role: ORI
```

## 🐛 Se Ainda Não Funcionar

### Problema Possível: Collection "session" não existe

Se ao executar `npm run check-sessions` você não ver uma collection chamada `session`, o Better Auth pode estar usando outro nome.

**Solução:**
1. Execute o script: `npm run check-sessions`
2. Veja quais collections existem
3. Se houver algo como `sessions` (plural) ou `_session`, me avise

### Problema Possível: Better Auth não está criando sessões

Se após fazer login, o script não mostrar nenhuma sessão:

**Solução:**
1. Verifique se o `BETTER_AUTH_SECRET` no `.env` está configurado
2. Verifique se a conexão com o MongoDB está OK
3. Tente fazer logout e login novamente

## 📋 Comandos Úteis

```bash
# Verificar sessões no banco
npm run check-sessions

# Criar um admin se necessário
npm run create-admin

# Popular com dados de teste
npm run seed-data

# Ver logs em tempo real
npm run start:dev
```

## 🎯 O que Esperar

Depois dessas correções:

1. ✅ Login cria sessão no MongoDB
2. ✅ Cookie é definido automaticamente
3. ✅ Middleware encontra a sessão
4. ✅ Rotas admin funcionam sem erro 403

## 📞 Próximos Passos

1. **Reinicie o backend**
2. **Execute `npm run check-sessions`** antes do login
3. **Faça login**
4. **Execute `npm run check-sessions`** depois do login
5. **Envie a saída** dos dois comandos se houver problema

Isso vai mostrar se a sessão está sendo criada ou não! 🔍
