# Comandos de Teste - Better Auth API

## 1. Criar novo usuário (Sign Up)

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456",
    "name": "Usuário Teste"
  }'
```

## 2. Fazer login (Sign In)

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456"
  }'
```

## 3. Testar validação - email inválido

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-invalido",
    "password": "senha123",
    "name": "Teste"
  }'
```

## 4. Testar validação - senha muito curta

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "outro@example.com",
    "password": "123",
    "name": "Teste"
  }'
```

## 5. Verificar servidor

```bash
curl http://localhost:3000
```
