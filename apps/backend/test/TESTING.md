# Testes de Autenticação - Better Auth

Este documento contém instruções para testar a API de autenticação.

## 📋 Pré-requisitos

1. Servidor rodando em `http://localhost:3000`
2. MongoDB conectado e funcionando

## 🧪 Testes Disponíveis

### 1️⃣ Usando REST Client (VS Code Extension)

Instale a extensão **REST Client** e abra o arquivo `test-auth.http`.

Clique em "Send Request" acima de cada requisição.

### 2️⃣ Usando cURL (Terminal)

#### Criar usuário (Sign Up)

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456",
    "name": "Usuário Teste"
  }'
```

#### Fazer login (Sign In)

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456"
  }'
```

### 3️⃣ Usando Postman/Insomnia

**Endpoint:** `POST http://localhost:3000/auth/signup`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "teste@example.com",
  "password": "senha123456",
  "name": "Usuário Teste"
}
```

---

**Endpoint:** `POST http://localhost:3000/auth/signin`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "teste@example.com",
  "password": "senha123456"
}
```

## ✅ Validações Implementadas

- ✅ Email deve ser válido
- ✅ Senha deve ter no mínimo 6 caracteres
- ✅ Nome é obrigatório no signup
- ✅ Campos não permitidos serão rejeitados

## 🔍 Respostas Esperadas

### Sign Up (Sucesso)

Status: `200 OK`

```json
{
  "user": {
    "id": "...",
    "email": "teste@example.com",
    "name": "Usuário Teste"
  },
  "session": {
    "token": "...",
    "expiresAt": "..."
  }
}
```

### Sign In (Sucesso)

Status: `200 OK`

```json
{
  "user": {
    "id": "...",
    "email": "teste@example.com",
    "name": "Usuário Teste"
  },
  "session": {
    "token": "...",
    "expiresAt": "..."
  }
}
```

### Erro de Validação

Status: `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

## 🔐 Checklist de Testes

- [ ] Criar usuário com dados válidos
- [ ] Tentar criar usuário com email duplicado
- [ ] Tentar criar usuário com email inválido
- [ ] Tentar criar usuário com senha curta
- [ ] Fazer login com credenciais válidas
- [ ] Tentar login com senha incorreta
- [ ] Tentar login com usuário inexistente
- [ ] Verificar se os tokens são gerados corretamente
- [ ] Verificar se os dados são salvos no MongoDB
