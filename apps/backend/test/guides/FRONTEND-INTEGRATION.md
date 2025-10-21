# 🎨 Guia de Integração com Front-end

## ✅ Backend Pronto!

Seu backend já está 100% preparado para receber requisições de um front-end com:
- ✅ Endpoint de registro (`/auth/signup`)
- ✅ Endpoint de login (`/auth/signin`)
- ✅ Sistema de roles (influencer, brand, ori)
- ✅ Validação automática de dados
- ✅ CORS habilitado

---

## 📡 Endpoints Disponíveis

### 1. Registro de Usuário
**Endpoint**: `POST http://localhost:3000/auth/signup`

**Request Body**:
```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "influencer"
}
```

**Roles aceitos**: `"influencer"` ou `"brand"`
❌ `"ori"` é bloqueado para registro público

**Response Success (200)**:
```json
{
  "token": "abc123...",
  "user": {
    "id": "123",
    "email": "usuario@example.com",
    "name": "Nome do Usuário",
    "role": "influencer",
    "emailVerified": false,
    "createdAt": "2025-10-20T14:33:03.791Z",
    "updatedAt": "2025-10-20T14:33:03.791Z"
  }
}
```

**Response Error (400)**:
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be at least 6 characters"],
  "error": "Bad Request"
}
```

---

### 2. Login de Usuário
**Endpoint**: `POST http://localhost:3000/auth/signin`

**Request Body**:
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response Success (200)**:
```json
{
  "token": "xyz789...",
  "user": {
    "id": "123",
    "email": "usuario@example.com",
    "name": "Nome do Usuário",
    "role": "influencer"
  }
}
```

**Response Error (401)**:
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

## 🚀 Exemplos de Integração

### React / Next.js

#### Componente de Registro

```tsx
'use client'; // Next.js 13+

import { useState } from 'react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'influencer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para cookies de sessão
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      // Sucesso! Redirecionar ou salvar sessão
      console.log('Usuário criado:', data);
      // router.push('/dashboard'); // Next.js
      // navigate('/dashboard'); // React Router
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Criar Conta</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Nome
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Senha
        </label>
        <input
          type="password"
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tipo de Conta
        </label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="influencer">Influenciador</option>
          <option value="brand">Marca</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>
    </form>
  );
}
```

#### Componente de Login

```tsx
'use client';

import { useState } from 'react';

export default function SigninForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para cookies
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Sucesso! Salvar dados do usuário e redirecionar
      console.log('Login bem-sucedido:', data);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirecionar baseado no role
      if (data.user.role === 'ori') {
        window.location.href = '/admin/dashboard';
      } else if (data.user.role === 'brand') {
        window.location.href = '/brand/dashboard';
      } else {
        window.location.href = '/influencer/dashboard';
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Entrar</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border rounded-lg"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Senha
        </label>
        <input
          type="password"
          required
          className="w-full px-3 py-2 border rounded-lg"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Registre-se
        </a>
      </p>
    </form>
  );
}
```

---

### Vue.js 3 (Composition API)

```vue
<template>
  <form @submit.prevent="handleSignup" class="space-y-4">
    <h2 class="text-2xl font-bold">Criar Conta</h2>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Nome</label>
      <input
        v-model="formData.name"
        type="text"
        required
        class="w-full px-3 py-2 border rounded-lg"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Email</label>
      <input
        v-model="formData.email"
        type="email"
        required
        class="w-full px-3 py-2 border rounded-lg"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Senha</label>
      <input
        v-model="formData.password"
        type="password"
        required
        minlength="6"
        class="w-full px-3 py-2 border rounded-lg"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Tipo de Conta</label>
      <select v-model="formData.role" class="w-full px-3 py-2 border rounded-lg">
        <option value="influencer">Influenciador</option>
        <option value="brand">Marca</option>
      </select>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {{ loading ? 'Criando conta...' : 'Criar Conta' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const formData = ref({
  email: '',
  password: '',
  name: '',
  role: 'influencer'
});

const handleSignup = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar conta');
    }

    console.log('Usuário criado:', data);
    router.push('/dashboard');
    
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
```

---

### Angular

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: 'influencer' | 'brand';
}

interface SigninData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  signup(data: SignupData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data, {
      withCredentials: true
    });
  }

  signin(data: SigninData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, data, {
      withCredentials: true
    });
  }
}

// signup.component.ts
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  template: `
    <form (ngSubmit)="onSubmit()">
      <h2>Criar Conta</h2>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <input
        type="text"
        [(ngModel)]="formData.name"
        name="name"
        placeholder="Nome"
        required
      />
      
      <input
        type="email"
        [(ngModel)]="formData.email"
        name="email"
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        [(ngModel)]="formData.password"
        name="password"
        placeholder="Senha"
        minlength="6"
        required
      />
      
      <select [(ngModel)]="formData.role" name="role">
        <option value="influencer">Influenciador</option>
        <option value="brand">Marca</option>
      </select>
      
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Criando...' : 'Criar Conta' }}
      </button>
    </form>
  `
})
export class SignupComponent {
  formData = {
    email: '',
    password: '',
    name: '',
    role: 'influencer' as 'influencer' | 'brand'
  };
  
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.signup(this.formData).subscribe({
      next: (data) => {
        console.log('Usuário criado:', data);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error.message || 'Erro ao criar conta';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

---

## 🔧 Configuração Necessária

### 1. Adicione no seu `.env`:

```bash
# URL do front-end (para CORS)
FRONTEND_URL=http://localhost:3001

# Outras variáveis já existentes
DATABASE_URL=mongodb://localhost:27017/seu_database
BETTER_AUTH_SECRET=seu_secret_aqui
BETTER_AUTH_URL=http://localhost:3000
```

### 2. Reinicie o servidor:

```bash
npm run start:dev
```

---

## 🎯 Validações Automáticas

O backend já valida automaticamente:

✅ **Email**: Deve ser um email válido  
✅ **Senha**: Mínimo 6 caracteres  
✅ **Nome**: Campo obrigatório  
✅ **Role**: Apenas `influencer` ou `brand` (ori é bloqueado)

**Exemplo de erro de validação**:
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "Role must be one of: influencer, brand, or ori"
  ],
  "error": "Bad Request"
}
```

---

## 🍪 Gerenciamento de Sessão

O **Better Auth** usa cookies automaticamente. No front-end:

1. **Use `credentials: 'include'`** em todas as requisições fetch
2. **Cookies são gerenciados automaticamente** pelo navegador
3. **Sessão persiste** mesmo após refresh da página

---

## 📱 Exemplo de App Completo (React)

### Estrutura de pastas sugerida:

```
src/
  components/
    auth/
      SignupForm.tsx
      SigninForm.tsx
  services/
    authService.ts
  pages/
    SignupPage.tsx
    SigninPage.tsx
    DashboardPage.tsx
```

### authService.ts (centralizado):

```typescript
const API_URL = 'http://localhost:3000/auth';

export const authService = {
  async signup(data: any) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    
    return response.json();
  },

  async signin(data: any) {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  }
};
```

---

## ✅ Checklist Final

Antes de conectar o front-end:

- [x] Backend rodando (`npm run start:dev`)
- [x] MongoDB conectado
- [x] CORS habilitado
- [x] Endpoints testados (use `test/test-roles.http`)
- [ ] Front-end configurado para fazer requisições
- [ ] Tratamento de erros implementado
- [ ] Redirecionamento após login/registro

---

## 🚀 Pronto para o Front-end!

Seu backend está **100% pronto** para receber um front-end. Você pode usar:
- ✅ React
- ✅ Next.js
- ✅ Vue.js
- ✅ Angular
- ✅ Svelte
- ✅ Ou qualquer framework/biblioteca

Todos os exemplos acima estão prontos para usar. Basta copiar, adaptar para seu framework e começar! 🎨
