# 🎨 Frontend - React + Vite + Tailwind

Sistema de autenticação com dashboards personalizados para 3 tipos de usuários.

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# URL da API (deixe vazio para usar proxy do Vite)
VITE_API_URL=
```

### 3. Rodar o Servidor de Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx     # Formulário de registro
│   │   └── SigninForm.tsx     # Formulário de login
│   └── common/
│       ├── Button.tsx          # Botão reutilizável
│       └── Input.tsx           # Input reutilizável
├── pages/
│   ├── auth/
│   │   ├── SignupPage.tsx
│   │   └── SigninPage.tsx
│   ├── influencer/
│   │   └── Dashboard.tsx       # Dashboard do Influencer
│   ├── brand/
│   │   └── Dashboard.tsx       # Dashboard da Brand
│   └── admin/
│       └── Dashboard.tsx       # Dashboard do Admin
├── services/
│   └── authService.ts          # Serviço de autenticação
├── types/
│   └── index.ts                # TypeScript types
├── App.tsx                     # Rotas principais
└── main.tsx                    # Entry point
```

---

## 🎯 Funcionalidades

### ✅ Implementado

- [x] Formulário de registro (Signup)
- [x] Formulário de login (Signin)
- [x] Dashboard do Influencer
- [x] Dashboard da Brand
- [x] Dashboard do Admin (ORI)
- [x] Roteamento com React Router
- [x] Integração com Backend via proxy
- [x] Estilização com Tailwind CSS
- [x] Componentes reutilizáveis (Button, Input)
- [x] TypeScript types compartilhados
- [x] Loading states
- [x] Error handling

### 🚧 A Fazer

- [ ] Autenticação protegida (ProtectedRoute)
- [ ] Persistência de sessão
- [ ] Refresh automático de token
- [ ] Logout automático
- [ ] Testes unitários
- [ ] Testes E2E

---

## 🔐 Autenticação

### Fluxo de Registro

1. Usuário preenche formulário em `/signup`
2. Escolhe o tipo de conta (Influencer ou Brand)
3. Sistema valida dados (email, senha min 6 caracteres)
4. Envia para `POST /auth/signup`
5. Armazena usuário no localStorage
6. Redireciona para dashboard apropriado

### Fluxo de Login

1. Usuário preenche formulário em `/signin`
2. Envia para `POST /auth/signin`
3. Armazena usuário no localStorage
4. Redireciona baseado no role:
   - `influencer` → `/influencer/dashboard`
   - `brand` → `/brand/dashboard`
   - `ori` → `/admin/dashboard`

---

## 🎨 Tailwind CSS

### Classes Customizadas

```css
.btn-primary        - Botão primário azul
.btn-secondary      - Botão secundário cinza
.input-field        - Input estilizado
.card               - Card com sombra
.container-center   - Container centralizado
```

### Cores do Tema

```javascript
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  ...
  600: '#2563eb',  // Cor principal
  ...
  900: '#1e3a8a',
}
```

---

## 🔌 Integração com Backend

### Proxy Configurado

O Vite está configurado para fazer proxy das requisições:

```typescript
'/auth' → 'http://localhost:3000/auth'
'/admin' → 'http://localhost:3000/admin'
'/api' → 'http://localhost:3000/api'
```

### Exemplo de Uso

```typescript
// Signup
const response = await fetch('/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Importante para cookies
  body: JSON.stringify(data)
})

// Login
const response = await fetch('/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(data)
})
```

---

## 📦 Tipos TypeScript

### UserRole

```typescript
enum UserRole {
  INFLUENCER = 'influencer',
  BRAND = 'brand',
  ORI = 'ori'
}
```

### User

```typescript
interface User {
  id: string
  email: string
  name: string
  role: UserRole
  emailVerified: boolean
  createdAt: Date | string
  updatedAt: Date | string
}
```

### SignupDto

```typescript
interface SignupDto {
  email: string
  password: string
  name: string
  role: UserRole
}
```

---

## 🧩 Componentes

### Button

```tsx
<Button
  variant="primary" // primary | secondary | danger
  isLoading={false}
  onClick={handleClick}
>
  Clique Aqui
</Button>
```

### Input

```tsx
<Input
  label="Email"
  type="email"
  required
  value={email}
  onChange={e => setEmail(e.target.value)}
  error="Email inválido"
  helperText="Digite seu melhor email"
/>
```

---

## 🛣️ Rotas

| Rota                    | Componente           | Descrição               |
| ----------------------- | -------------------- | ----------------------- |
| `/`                     | Redirect → `/signup` | Página inicial          |
| `/signup`               | SignupPage           | Registro de usuário     |
| `/signin`               | SigninPage           | Login de usuário        |
| `/influencer/dashboard` | InfluencerDashboard  | Dashboard do influencer |
| `/brand/dashboard`      | BrandDashboard       | Dashboard da brand      |
| `/admin/dashboard`      | AdminDashboard       | Dashboard do admin      |
| `*`                     | Redirect → `/signup` | 404                     |

---

## 🧪 Testar a Aplicação

### 1. Certifique-se que o backend está rodando

```bash
# No workspace do backend
cd /Users/samuelpaixao/Documents/projects/new-authentication-system/system-authentication-prototype
npm run start:dev
```

Backend deve estar em: `http://localhost:3000`

### 2. Rode o frontend

```bash
# No workspace do frontend
cd apps/web
npm run dev
```

Frontend estará em: `http://localhost:5173`

### 3. Teste o fluxo

1. Acesse `http://localhost:5173`
2. Crie uma conta (Influencer ou Brand)
3. Faça login
4. Veja o dashboard apropriado

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'react-router-dom'"

```bash
npm install react-router-dom
```

### Erro: Tailwind não está funcionando

1. Verifique se `tailwind.config.js` existe
2. Verifique se `postcss.config.js` existe
3. Verifique se `index.css` tem as diretivas do Tailwind

### Erro: CORS

Certifique-se que o backend tem CORS configurado:

```typescript
// apps/backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

### Erro: Proxy não funciona

1. Reinicie o servidor Vite
2. Verifique se o backend está rodando
3. Verifique `vite.config.ts`

---

## 📝 Scripts

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

---

## 🎯 Próximos Passos

1. **Autenticação Protegida**
   - Criar componente ProtectedRoute
   - Verificar sessão antes de renderizar

2. **Melhorias de UX**
   - Loading skeletons
   - Transições de página
   - Toasts de notificação

3. **Features**
   - Editar perfil
   - Upload de foto
   - Configurações de conta

4. **Testes**
   - Testes unitários com Vitest
   - Testes E2E com Playwright

---

## 🔗 Links Úteis

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind**
