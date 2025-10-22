# Guia de Integração Frontend - Dashboard ORI

Este guia explica como integrar o frontend com as novas rotas administrativas.

## 📊 Implementação do Dashboard

### 1. Buscar Estatísticas do Dashboard

```typescript
// src/services/adminService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/admin/dashboard`, {
    withCredentials: true,
  });
  return response.data;
};
```

### 2. Componente Dashboard

```typescript
// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  activeCampaigns: number;
  totalInfluencers: number;
  totalBrands: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard Administrativo</h1>
      
      <div className="stats-grid">
        {/* Card Campanhas Ativas */}
        <div 
          className="stat-card clickable"
          onClick={() => navigate('/admin/campaigns')}
        >
          <h3>Campanhas Ativas</h3>
          <p className="stat-number">{stats?.activeCampaigns || 0}</p>
          <span className="stat-label">campanhas em execução</span>
        </div>

        {/* Card Influencers */}
        <div 
          className="stat-card clickable"
          onClick={() => navigate('/admin/influencers')}
        >
          <h3>Influencers</h3>
          <p className="stat-number">{stats?.totalInfluencers || 0}</p>
          <span className="stat-label">influenciadores registrados</span>
        </div>

        {/* Card Marcas */}
        <div 
          className="stat-card clickable"
          onClick={() => navigate('/admin/brands')}
        >
          <h3>Marcas</h3>
          <p className="stat-number">{stats?.totalBrands || 0}</p>
          <span className="stat-label">marcas registradas</span>
        </div>
      </div>
    </div>
  );
};
```

## 📋 Listagem de Influencers

### Service

```typescript
// src/services/adminService.ts
export const getInfluencers = async () => {
  const response = await axios.get(`${API_URL}/admin/influencers`, {
    withCredentials: true,
  });
  return response.data;
};
```

### Componente

```typescript
// src/pages/admin/InfluencersListPage.tsx
import { useEffect, useState } from 'react';
import { getInfluencers } from '../../services/adminService';

interface Influencer {
  _id: string;
  name: string;
  email: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  followers: number;
  active: boolean;
}

export const InfluencersListPage = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    try {
      const data = await getInfluencers();
      setInfluencers(data.data);
    } catch (error) {
      console.error('Erro ao carregar influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="page-container">
      <h1>Influencers Registrados</h1>
      <p>Total: {influencers.length}</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Instagram</th>
            <th>TikTok</th>
            <th>YouTube</th>
            <th>Seguidores</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((influencer) => (
            <tr key={influencer._id}>
              <td>{influencer.name}</td>
              <td>{influencer.email}</td>
              <td>{influencer.instagram || '-'}</td>
              <td>{influencer.tiktok || '-'}</td>
              <td>{influencer.youtube || '-'}</td>
              <td>{influencer.followers.toLocaleString()}</td>
              <td>
                <span className={`badge ${influencer.active ? 'active' : 'inactive'}`}>
                  {influencer.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 🏢 Listagem de Marcas

```typescript
// src/pages/admin/BrandsListPage.tsx
import { useEffect, useState } from 'react';
import { getBrands } from '../../services/adminService';

interface Brand {
  _id: string;
  name: string;
  email: string;
  description?: string;
  website?: string;
  industry?: string;
  active: boolean;
}

export const BrandsListPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/brands`, {
        withCredentials: true,
      });
      setBrands(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="page-container">
      <h1>Marcas Registradas</h1>
      <p>Total: {brands.length}</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Descrição</th>
            <th>Website</th>
            <th>Indústria</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand._id}>
              <td>{brand.name}</td>
              <td>{brand.email}</td>
              <td>{brand.description || '-'}</td>
              <td>
                {brand.website ? (
                  <a href={brand.website} target="_blank" rel="noopener noreferrer">
                    {brand.website}
                  </a>
                ) : '-'}
              </td>
              <td>{brand.industry || '-'}</td>
              <td>
                <span className={`badge ${brand.active ? 'active' : 'inactive'}`}>
                  {brand.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 📢 Listagem de Campanhas

```typescript
// src/pages/admin/CampaignsListPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Campaign {
  _id: string;
  name: string;
  brandId: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  budget?: number;
  startDate?: string;
  endDate?: string;
  assignedInfluencers: string[];
}

export const CampaignsListPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/campaigns', {
        withCredentials: true,
      });
      setCampaigns(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="page-container">
      <h1>Campanhas Ativas</h1>
      <p>Total: {campaigns.length}</p>
      <p className="note">
        💡 Funcionalidade de atribuir campanhas a influencers será implementada em breve
      </p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Budget</th>
            <th>Data Início</th>
            <th>Data Fim</th>
            <th>Influencers</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.name}</td>
              <td>{campaign.description || '-'}</td>
              <td>
                {campaign.budget 
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(campaign.budget)
                  : '-'}
              </td>
              <td>
                {campaign.startDate 
                  ? new Date(campaign.startDate).toLocaleDateString('pt-BR')
                  : '-'}
              </td>
              <td>
                {campaign.endDate 
                  ? new Date(campaign.endDate).toLocaleDateString('pt-BR')
                  : '-'}
              </td>
              <td>{campaign.assignedInfluencers.length}</td>
              <td>
                <span className={`badge status-${campaign.status}`}>
                  {campaign.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 🛣️ Configuração de Rotas

```typescript
// src/App.tsx ou router config
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './pages/admin/Dashboard';
import { InfluencersListPage } from './pages/admin/InfluencersListPage';
import { BrandsListPage } from './pages/admin/BrandsListPage';
import { CampaignsListPage } from './pages/admin/CampaignsListPage';

// Dentro do seu Routes
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/influencers" element={<InfluencersListPage />} />
<Route path="/admin/brands" element={<BrandsListPage />} />
<Route path="/admin/campaigns" element={<CampaignsListPage />} />
```

## 🎨 Estilos CSS (exemplo)

```css
/* Dashboard */
.dashboard-container {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #2563eb;
  margin: 0.5rem 0;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Tabelas */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.active {
  background: #d1fae5;
  color: #065f46;
}

.badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.badge.status-active {
  background: #dbeafe;
  color: #1e40af;
}

.note {
  padding: 1rem;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  margin: 1rem 0;
}
```

## 🔐 Proteção de Rotas

Certifique-se de adicionar proteção às rotas administrativas:

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface User {
  role: 'ORI' | 'BRAND' | 'INFLUENCER';
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  user: User | null;
}

export const ProtectedRoute = ({ children, allowedRoles, user }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// Uso:
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute user={currentUser} allowedRoles={['ORI']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

## 📝 Próximos Passos

1. Implementar as páginas no frontend seguindo os exemplos acima
2. Adicionar tratamento de erros e feedback visual
3. Implementar paginação para grandes volumes de dados
4. Adicionar filtros e busca nas tabelas
5. Criar interface para atribuir influencers a campanhas
