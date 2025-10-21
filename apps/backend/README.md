# 🚀 NestJS + Better Auth + MongoDB - Starter Kit

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

Um **starter kit completo** para autenticação em aplicações NestJS usando [Better Auth](https://better-auth.com) e MongoDB Atlas.

## 📋 Descrição

Este projeto é um template pronto para uso que implementa autenticação robusta com:

- 🔐 **Better Auth** - Sistema de autenticação moderno e seguro
- 🗄️ **MongoDB Atlas** - Banco de dados NoSQL na nuvem
- 🏗️ **NestJS** - Framework Node.js progressivo e escalável
- ✅ **Class Validator** - Validação automática de dados
- 🎯 **TypeScript** - Tipagem estática e autocompletar

## ⚡ Features

- ✅ Registro de usuários (Sign Up)
- ✅ Login de usuários (Sign In)
- ✅ Hash automático de senhas (bcrypt)
- ✅ Validação de dados (email, senha, etc)
- ✅ Gerenciamento de sessões
- ✅ Conexão com MongoDB Atlas
- ✅ DTOs com validação
- ✅ Estrutura modular e escalável

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Passo a passo

1. **Clone o repositório**

```bash
git clone <seu-repositorio>
cd nest-app
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Better Auth
BETTER_AUTH_SECRET="sua-chave-secreta-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# MongoDB Atlas
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/database?retryWrites=true&w=majority"
```

> 💡 **Dica**: Gere uma chave secreta segura com: `openssl rand -base64 32`

4. **Inicie o servidor**

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

O servidor estará rodando em `http://localhost:3000` 🚀

## 📡 Endpoints da API

### 1. Registro de Usuário (Sign Up)

```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123456",
  "name": "Nome do Usuário"
}
```

### 2. Login (Sign In)

```bash
POST /auth/signin
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123456"
}
```

## 🧪 Testando a API

### Opção 1: Usando o arquivo HTTP (REST Client)

Abra o arquivo `test-auth.http` e clique em "Send Request" acima de cada requisição.

### Opção 2: Usando cURL

Veja o arquivo `TEST-COMMANDS.md` para exemplos de comandos cURL.

### Opção 3: Usando Postman/Insomnia

Importe as requisições do arquivo `test-auth.http`.

## 📁 Estrutura do Projeto

```
src/
├── auth/
│   ├── auth.controller.ts    # Controller de autenticação
│   ├── auth.module.ts         # Módulo de autenticação
│   └── dto/
│       ├── signup.dto.ts      # DTO para registro
│       └── signin.dto.ts      # DTO para login
├── lib/
│   └── auth.ts                # Configuração do Better Auth
├── app.module.ts              # Módulo principal
├── app.controller.ts
├── app.service.ts
└── main.ts                    # Entry point

test/
├── test-auth.http             # Testes HTTP
└── TEST-COMMANDS.md           # Comandos de teste
```

## 🔧 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[Better Auth](https://better-auth.com/)** - Sistema de autenticação moderno
- **[MongoDB](https://www.mongodb.com/)** - Banco de dados NoSQL
- **[Mongoose](https://mongoosejs.com/)** - ODM para MongoDB
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem
- **[Class Validator](https://github.com/typestack/class-validator)** - Validação de dados
- **[Class Transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos

## 🚀 Próximos Passos

Este starter kit é uma base sólida. Você pode expandir com:

- [ ] Verificação de email
- [ ] Recuperação de senha
- [ ] OAuth (Google, GitHub, etc)
- [ ] Autenticação de dois fatores (2FA)
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Roles e permissões (RBAC)
- [ ] Testes unitários e E2E
- [ ] Docker e Docker Compose
- [ ] CI/CD

## 📚 Recursos Úteis

- [Documentação do NestJS](https://docs.nestjs.com)
- [Documentação do Better Auth](https://better-auth.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ usando NestJS, Better Auth e MongoDB**
