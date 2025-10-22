# Documentação das Rotas Administrativas (ORI)

Este documento descreve as rotas disponíveis para administradores (role ORI) no sistema.

## 📊 Dashboard

### GET `/admin/dashboard`

Retorna estatísticas gerais do sistema para o painel administrativo.

**Response:**

```json
{
  "message": "Dashboard administrativo",
  "stats": {
    "activeCampaigns": 5,
    "totalInfluencers": 120,
    "totalBrands": 35
  }
}
```

## 👥 Gerenciamento de Influencers

### GET `/admin/influencers`

Lista todos os influencers registrados no sistema.

**Response:**

```json
{
  "message": "Lista de todos os influencers registrados",
  "total": 120,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "name": "João Silva",
      "email": "joao@example.com",
      "bio": "Influenciador digital",
      "instagram": "@joaosilva",
      "tiktok": "@joaosilva",
      "youtube": "joaosilvaofficial",
      "followers": 150000,
      "active": true,
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  ]
}
```

## 🏢 Gerenciamento de Marcas

### GET `/admin/brands`

Lista todas as marcas registradas no sistema.

**Response:**

```json
{
  "message": "Lista de todas as marcas registradas",
  "total": 35,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "user456",
      "name": "Marca XYZ",
      "email": "contato@marcaxyz.com",
      "description": "Empresa de tecnologia",
      "website": "https://marcaxyz.com",
      "industry": "Tecnologia",
      "active": true,
      "createdAt": "2025-10-20T11:00:00.000Z",
      "updatedAt": "2025-10-20T11:00:00.000Z"
    }
  ]
}
```

## 📢 Gerenciamento de Campanhas

### GET `/admin/campaigns`

Lista todas as campanhas ativas no sistema.

**Response:**

```json
{
  "message": "Lista de todas as campanhas ativas",
  "total": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Campanha Verão 2025",
      "brandId": "507f1f77bcf86cd799439012",
      "description": "Campanha de verão para promover novos produtos",
      "status": "active",
      "budget": 50000,
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-03-31T23:59:59.000Z",
      "assignedInfluencers": ["507f1f77bcf86cd799439011"],
      "createdAt": "2025-10-20T12:00:00.000Z",
      "updatedAt": "2025-10-20T12:00:00.000Z"
    }
  ],
  "note": "Funcionalidade de atribuir campanhas a influencers será implementada em breve"
}
```

### GET `/admin/campaigns/:id`

Retorna detalhes de uma campanha específica.

**Parameters:**

- `id` - ID da campanha

**Response:**

```json
{
  "message": "Detalhes da campanha",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Campanha Verão 2025",
    "brandId": "507f1f77bcf86cd799439012",
    "description": "Campanha de verão para promover novos produtos",
    "status": "active",
    "budget": 50000,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-03-31T23:59:59.000Z",
    "assignedInfluencers": ["507f1f77bcf86cd799439011"]
  }
}
```

### POST `/admin/campaigns`

Cria uma nova campanha.

**Request Body:**

```json
{
  "name": "Nova Campanha",
  "brandId": "507f1f77bcf86cd799439012",
  "description": "Descrição da campanha",
  "status": "active",
  "budget": 30000,
  "startDate": "2025-11-01T00:00:00.000Z",
  "endDate": "2025-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
  "message": "Campanha criada com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Nova Campanha",
    "brandId": "507f1f77bcf86cd799439012",
    "description": "Descrição da campanha",
    "status": "active",
    "budget": 30000,
    "startDate": "2025-11-01T00:00:00.000Z",
    "endDate": "2025-12-31T23:59:59.000Z",
    "assignedInfluencers": []
  }
}
```

### POST `/admin/campaigns/:campaignId/assign/:influencerId`

Atribui um influencer a uma campanha específica.

**Parameters:**

- `campaignId` - ID da campanha
- `influencerId` - ID do influencer

**Response:**

```json
{
  "message": "Influencer atribuído à campanha com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Campanha Verão 2025",
    "assignedInfluencers": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439015"
    ]
  }
}
```

## 👤 Gerenciamento de Usuários

### POST `/admin/users`

Cria um novo usuário com qualquer role (incluindo ORI).

**Request Body:**

```json
{
  "email": "novo@example.com",
  "password": "senha123",
  "name": "Novo Usuário",
  "role": "INFLUENCER"
}
```

**Response:**

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "507f1f77bcf86cd799439016",
    "email": "novo@example.com",
    "name": "Novo Usuário",
    "role": "INFLUENCER"
  }
}
```

### GET `/admin/users`

Lista todos os usuários do sistema.

### PATCH `/admin/users/:id/role`

Atualiza o role de um usuário específico.

**Parameters:**

- `id` - ID do usuário

**Request Body:**

```json
{
  "role": "BRAND"
}
```

### DELETE `/admin/users/:id`

Remove um usuário do sistema.

**Parameters:**

- `id` - ID do usuário

## 🔐 Autenticação

Todas as rotas `/admin/*` são protegidas e requerem:

1. Token de autenticação válido
2. Role ORI (administrador)

## 📝 Status de Campanha

Os status disponíveis para campanhas são:

- `active` - Campanha ativa
- `inactive` - Campanha inativa
- `completed` - Campanha concluída

## 🚀 Próximas Implementações

- Interface completa para atribuição de influencers a campanhas
- Sistema de métricas e relatórios
- Dashboard com gráficos e estatísticas avançadas
- Filtros e busca nas listagens
- Paginação para grandes volumes de dados
