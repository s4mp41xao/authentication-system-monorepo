# 🌱 Script de Seed - Dados de Teste

Este script popula o banco de dados com dados de teste para facilitar o desenvolvimento e testes do sistema.

## 📦 O que o script cria?

### Influencers (5)

1. **João Silva** - Lifestyle e viagens (150k seguidores)
2. **Maria Santos** - Moda e beleza (280k seguidores)
3. **Pedro Oliveira** - Gamer e streamer (500k seguidores)
4. **Ana Costa** - Fitness (320k seguidores)
5. **Lucas Ferreira** - Tech reviewer (420k seguidores)

### Marcas (5)

1. **TechStore Brasil** - Tecnologia
2. **Moda Urbana** - Moda
3. **FitLife Suplementos** - Saúde e Fitness
4. **GameZone** - Games
5. **Beauty Brasil** - Beleza

### Campanhas (6)

1. **Lançamento Smartphone XYZ** - TechStore (ativa)
   - Influencer: Lucas Ferreira
   - Budget: R$ 150.000
2. **Coleção Primavera/Verão** - Moda Urbana (ativa)
   - Influencer: Maria Santos
   - Budget: R$ 80.000
3. **Desafio 30 Dias FitLife** - FitLife (ativa)
   - Influencer: Ana Costa
   - Budget: R$ 60.000
4. **Torneio GameZone 2025** - GameZone (ativa)
   - Influencer: Pedro Oliveira
   - Budget: R$ 200.000
5. **Black Friday Beauty** - Beauty Brasil (ativa)
   - Influencers: Maria Santos, João Silva
   - Budget: R$ 120.000
6. **Campanha Natal Tech** - TechStore (ativa)
   - Influencers: Lucas Ferreira, Pedro Oliveira
   - Budget: R$ 180.000

## 🚀 Como Usar

### 1. Certifique-se de que o MongoDB está rodando

```bash
# Verifique se o MongoDB está acessível
# Se estiver usando MongoDB Atlas, certifique-se de que o DATABASE_URL está correto no .env
```

### 2. Execute o script

```bash
cd apps/backend
npm run seed-data
```

### 3. Aguarde a confirmação

```
✅ Conectado ao MongoDB
✅ 5 influencers inseridos
✅ 5 marcas inseridas
✅ 6 campanhas inseridas

🎉 Seed concluído com sucesso!

📊 Resumo:
   - 5 Influencers
   - 5 Marcas
   - 6 Campanhas

🔌 Conexão fechada
```

## ⚠️ Observações Importantes

### 1. Limpeza de Dados

Por padrão, o script **NÃO** limpa dados existentes. Se quiser limpar antes de inserir, descomente estas linhas no arquivo `scripts/seed-data.ts`:

```typescript
// Linhas 15-17
await db.collection('influencers').deleteMany({});
await db.collection('brands').deleteMany({});
await db.collection('campaigns').deleteMany({});
```

### 2. IDs de Usuário

Os `userId` gerados são fictícios (`user_influencer_1`, `user_brand_1`, etc.).

Para conectar com usuários reais do sistema:

1. Primeiro crie usuários usando `/auth/signup` ou `/admin/users`
2. Pegue os IDs reais dos usuários
3. Modifique o script para usar esses IDs

### 3. Executar Múltiplas Vezes

Você pode executar o script múltiplas vezes. Cada execução criará novos registros (não sobrescreverá os existentes, a menos que você descomente a limpeza).

## 🧪 Testando com os Dados

Após executar o seed, você pode:

### 1. Verificar o Dashboard

```http
GET http://localhost:3000/admin/dashboard
```

Deve retornar:

```json
{
  "stats": {
    "activeCampaigns": 6,
    "totalInfluencers": 5,
    "totalBrands": 5
  }
}
```

### 2. Listar Influencers

```http
GET http://localhost:3000/admin/influencers
```

### 3. Listar Marcas

```http
GET http://localhost:3000/admin/brands
```

### 4. Listar Campanhas

```http
GET http://localhost:3000/admin/campaigns
```

## 🔄 Resetar o Banco de Dados

Se quiser começar do zero:

```bash
# Opção 1: Usar MongoDB Compass
# Conecte-se ao banco e delete as collections manualmente

# Opção 2: Via script (adicione este código ao seed-data.ts)
await db.collection('influencers').drop();
await db.collection('brands').drop();
await db.collection('campaigns').drop();
await db.collection('users').drop(); // Se quiser limpar usuários também
```

## 🎨 Personalizando os Dados

Você pode modificar o arquivo `scripts/seed-data.ts` para:

- Adicionar mais influencers
- Criar marcas específicas
- Ajustar campanhas
- Modificar budgets e datas
- Adicionar mais campos personalizados

## 📝 Próximos Passos

Depois de popular o banco:

1. ✅ Teste as rotas do admin
2. ✅ Implemente o frontend com os dados reais
3. ✅ Teste as funcionalidades de listagem
4. ✅ Implemente a interface de atribuição de campanhas

## 🐛 Problemas Comuns

### Erro de Conexão

```
❌ Erro ao fazer seed: MongoServerError: ...
```

**Solução**: Verifique se o `DATABASE_URL` no `.env` está correto.

### Dados Duplicados

Se você vir muitos dados duplicados, é porque executou o script múltiplas vezes.
**Solução**: Descomente as linhas de limpeza ou delete as collections manualmente.

### IDs Inválidos

Se os relacionamentos não funcionarem, verifique se os IDs estão sendo gerados corretamente.

## 💡 Dica

Use o MongoDB Compass para visualizar os dados inseridos de forma gráfica e facilitar o desenvolvimento!
