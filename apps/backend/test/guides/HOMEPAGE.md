# 🏠 HomePage - ORI Platform

Página inicial landing page da plataforma de autenticação.

## 🎨 Design

### Layout
- **Header**: Logo + Links de navegação (Entrar/Cadastrar)
- **Hero Section**: Título, descrição e CTAs principais
- **Cards de Usuários**: 3 tipos de perfis (Influenciador, Marca, ORI)
- **Footer**: Copyright

### Cores
- Fundo: Branco (`bg-white`)
- Texto principal: Preto (`text-black`)
- Texto secundário: Cinza 600 (`text-gray-600`)
- Botão primário: Preto com hover cinza 800
- Botão secundário: Borda cinza com hover cinza 50

### Ícones (Lucide React)
- 👥 **Users**: Influenciador
- 🏢 **Building**: Marca
- 🛡️ **Shield**: ORI
- ➡️ **ArrowRight**: CTA "Começar Agora"

## 📐 Especificações

### Cards
- **Tamanho do círculo do ícone**: 80px (w-20 h-20)
- **Tamanho dos ícones**: 40px (h-10 w-10)
- **Padding**: 32px (p-8)
- **Border radius**: 12px (rounded-xl)
- **Gap entre cards**: 24px (gap-6)

### Espaçamentos
- **Hero padding vertical**: 80px (py-20)
- **Margem bottom dos botões**: 64px (mb-16)
- **Margem top dos cards**: 64px (mt-16)
- **Margem top do footer**: 128px (mt-32)

### Tipografia
- **Título principal**: 48px (text-5xl) bold
- **Descrição**: 20px (text-xl)
- **Títulos dos cards**: 20px (text-xl) semibold
- **Descrição dos cards**: 14px (text-sm)

## 🔗 Navegação

### Links do Header
- **"Entrar"** → `/signin`
- **"Cadastrar"** → `/signup`

### CTAs Principais
- **"Começar Agora"** → `/signup`
- **"Fazer Login"** → `/signin`

## 📱 Responsividade

### Grid dos Cards
- **Mobile**: 1 coluna (`grid-cols-1`)
- **Desktop**: 3 colunas (`md:grid-cols-3`)

### Container
- **Max width**: 1280px (`max-w-7xl`)
- **Cards max width**: 1024px (`max-w-5xl`)

## 🎯 Estados Interativos

### Hover States
- **Cards**: `hover:shadow-lg` - Sombra aparece no hover
- **Botão preto**: `hover:bg-gray-800` - Escurece no hover
- **Botão branco**: `hover:bg-gray-50` - Fundo cinza claro no hover

### Transições
- Todas as transições usam `transition-all` ou `transition-colors`

## 🚀 Uso

```tsx
import { HomePage } from './pages/HomePage';

// No App.tsx
<Route path="/" element={<HomePage />} />
```

---

**Criado em**: 20 de Outubro de 2025
**Design baseado em**: Referência do projeto nestjs-mongo-auth
