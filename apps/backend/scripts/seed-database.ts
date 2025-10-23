/**
 * Script para popular o banco de dados com dados de teste
 * Execute com: npx tsx scripts/seed-database.ts
 */

import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    console.log('🚀 Conectando ao MongoDB...\n');
    await client.connect();
    const db = client.db();

    console.log('🗑️  LIMPANDO TODOS OS DADOS (exceto Admin ORI)...');

    // 1. Buscar o ID do admin ORI para preservá-lo
    const adminUser = await db.collection('user').findOne({
      email: 'admin@ori.com',
      role: 'ori',
    });

    let adminUserId: string | null = null;
    if (adminUser) {
      adminUserId = adminUser._id.toString();
      console.log(
        `✅ Admin ORI encontrado: ${adminUser.email} (ID: ${adminUserId})`,
      );
    } else {
      console.log('⚠️  Admin ORI não encontrado no banco');
    }

    // 2. Deletar todas as coleções (exceto registros do admin)
    console.log('   → Deletando users (exceto ORI)...');
    const deletedUsers = await db.collection('user').deleteMany({
      role: { $ne: 'ori' },
    });
    console.log(`   ✓ ${deletedUsers.deletedCount} usuários deletados`);

    console.log('   → Deletando accounts (exceto ORI)...');
    if (adminUserId) {
      const deletedAccounts = await db.collection('account').deleteMany({
        userId: { $ne: adminUserId },
      });
      console.log(`   ✓ ${deletedAccounts.deletedCount} contas deletadas`);
    } else {
      const deletedAccounts = await db.collection('account').deleteMany({});
      console.log(`   ✓ ${deletedAccounts.deletedCount} contas deletadas`);
    }

    console.log('   → Deletando sessions (exceto ORI)...');
    if (adminUserId) {
      const deletedSessions = await db.collection('session').deleteMany({
        userId: { $ne: adminUserId },
      });
      console.log(`   ✓ ${deletedSessions.deletedCount} sessões deletadas`);
    } else {
      const deletedSessions = await db.collection('session').deleteMany({});
      console.log(`   ✓ ${deletedSessions.deletedCount} sessões deletadas`);
    }

    console.log('   → Deletando influencers...');
    const deletedInfluencers = await db.collection('influencer').deleteMany({});
    console.log(
      `   ✓ ${deletedInfluencers.deletedCount} influencers deletados`,
    );

    console.log('   → Deletando brands...');
    const deletedBrands = await db.collection('brand').deleteMany({});
    console.log(`   ✓ ${deletedBrands.deletedCount} marcas deletadas`);

    console.log('   → Deletando campaigns...');
    const deletedCampaigns = await db.collection('campaign').deleteMany({});
    console.log(`   ✓ ${deletedCampaigns.deletedCount} campanhas deletadas`);

    console.log('✅ Banco limpo!\n');

    console.log('📝 Criando usuários via API do backend...\n');

    // Usar a API do Vercel em produção
    const API_URL = 'https://authentication-system-monorepo-back.vercel.app';

    // Armazenar IDs dos usuários criados
    const createdInfluencers: Array<{
      id: string;
      email: string;
      name: string;
    }> = [];
    const createdBrands: Array<{ id: string; email: string; name: string }> =
      [];

    // 1. Criar Influencers
    const influencers = [
      {
        email: 'maria.silva@instagram.com',
        password: 'Senha@123',
        name: 'Maria Silva',
        role: 'influencer',
        instagram: '@mariasilva',
        followers: 85000,
        bio: 'Fashion & Lifestyle | 📍 São Paulo',
      },
      {
        email: 'joao.santos@tiktok.com',
        password: 'Senha@123',
        name: 'João Santos',
        role: 'influencer',
        instagram: '@joaosantos',
        followers: 120000,
        bio: 'Tech Content Creator | Gaming & Reviews',
      },
      {
        email: 'ana.costa@youtube.com',
        password: 'Senha@123',
        name: 'Ana Costa',
        role: 'influencer',
        instagram: '@anacosta',
        followers: 200000,
        bio: 'Travel Vlogger | ✈️ Exploring the World',
      },
      {
        email: 'pedro.oliveira@insta.com',
        password: 'Senha@123',
        name: 'Pedro Oliveira',
        role: 'influencer',
        instagram: '@pedrooliveira',
        followers: 65000,
        bio: 'Fitness Coach | 💪 Healthy Lifestyle',
      },
      {
        email: 'julia.lima@social.com',
        password: 'Senha@123',
        name: 'Julia Lima',
        role: 'influencer',
        instagram: '@julialima',
        followers: 95000,
        bio: 'Beauty & Makeup Artist | ✨',
      },
    ];

    for (const inf of influencers) {
      console.log(`👤 Criando Influencer: ${inf.name}...`);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inf),
      });

      if (response.ok) {
        const data = await response.json();
        createdInfluencers.push({
          id: data.user.id,
          email: inf.email,
          name: inf.name,
        });
        console.log(`✅ ${inf.name} criado: ${inf.email} / ${inf.password}`);
      } else {
        const error = await response.text();
        console.log(`⚠️  ${inf.name}:`, error);
      }
    }
    console.log();

    // 2. Criar Brands
    const brands = [
      {
        email: 'contato@techstyle.com',
        password: 'Senha@123',
        name: 'TechStyle',
        role: 'brand',
        website: 'https://techstyle.com',
        industry: 'Fashion Tech',
        description: 'Moda tecnológica e inovadora para o público jovem',
      },
      {
        email: 'marketing@fitlife.com',
        password: 'Senha@123',
        name: 'FitLife',
        role: 'brand',
        website: 'https://fitlife.com',
        industry: 'Health & Fitness',
        description: 'Produtos e suplementos para vida fitness',
      },
      {
        email: 'contato@beautyco.com',
        password: 'Senha@123',
        name: 'BeautyCo',
        role: 'brand',
        website: 'https://beautyco.com',
        industry: 'Beauty & Cosmetics',
        description: 'Cosméticos premium e cruelty-free',
      },
      {
        email: 'social@travelmore.com',
        password: 'Senha@123',
        name: 'TravelMore',
        role: 'brand',
        website: 'https://travelmore.com',
        industry: 'Travel & Tourism',
        description: 'Agência de viagens e experiências únicas',
      },
      {
        email: 'digital@gamezone.com',
        password: 'Senha@123',
        name: 'GameZone',
        role: 'brand',
        website: 'https://gamezone.com',
        industry: 'Gaming & Entertainment',
        description: 'Loja de games e acessórios gamer',
      },
    ];

    for (const brand of brands) {
      console.log(`🏢 Criando Brand: ${brand.name}...`);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });

      if (response.ok) {
        const data = await response.json();
        createdBrands.push({
          id: data.user.id,
          email: brand.email,
          name: brand.name,
        });
        console.log(
          `✅ ${brand.name} criado: ${brand.email} / ${brand.password}`,
        );
      } else {
        const error = await response.text();
        console.log(`⚠️  ${brand.name}:`, error);
      }
    }
    console.log();

    // 3. Criar Campanhas com Influencers Vinculados
    // IMPORTANTE: 3 influencers (Maria, Ana, João) aparecem em pelo menos 2 campanhas cada
    console.log('📢 Criando 5 campanhas com influencers vinculados...\n');

    const campaigns = [
      {
        brandEmail: 'contato@techstyle.com',
        name: 'Lançamento Coleção Primavera 2025',
        description: 'Divulgação da nova coleção de roupas tech-wear',
        budget: 50000,
        status: 'active',
        startDate: '2025-10-01',
        endDate: '2025-12-31',
        // Maria (1ª) + Ana (1ª) + Julia
        influencerEmails: [
          'maria.silva@instagram.com',
          'ana.costa@youtube.com',
          'julia.lima@social.com',
        ],
      },
      {
        brandEmail: 'marketing@fitlife.com',
        name: 'Desafio FitLife 30 Dias',
        description: 'Campanha de engajamento com desafio fitness',
        budget: 35000,
        status: 'active',
        startDate: '2025-10-15',
        endDate: '2025-11-15',
        // Maria (2ª) + João (1ª) + Pedro
        influencerEmails: [
          'maria.silva@instagram.com',
          'joao.santos@tiktok.com',
          'pedro.oliveira@insta.com',
        ],
      },
      {
        brandEmail: 'contato@beautyco.com',
        name: 'Nova Linha de Maquiagem Vegana',
        description: 'Lançamento de produtos cruelty-free',
        budget: 45000,
        status: 'active',
        startDate: '2025-10-20',
        endDate: '2025-12-20',
        // Ana (2ª) + Julia
        influencerEmails: ['ana.costa@youtube.com', 'julia.lima@social.com'],
      },
      {
        brandEmail: 'social@travelmore.com',
        name: 'Roteiros Exclusivos Nordeste',
        description:
          'Promoção de pacotes turísticos para o Nordeste brasileiro',
        budget: 60000,
        status: 'active',
        startDate: '2025-11-01',
        endDate: '2026-01-31',
        // João (2ª) + Pedro
        influencerEmails: [
          'joao.santos@tiktok.com',
          'pedro.oliveira@insta.com',
        ],
      },
      {
        brandEmail: 'digital@gamezone.com',
        name: 'Black Friday Gamer 2025',
        description: 'Maior campanha de vendas do ano com descontos exclusivos',
        budget: 80000,
        status: 'active',
        startDate: '2025-11-15',
        endDate: '2025-11-30',
        // Pedro + Julia
        influencerEmails: ['pedro.oliveira@insta.com', 'julia.lima@social.com'],
      },
    ];

    for (const campaign of campaigns) {
      console.log(`📢 Criando campanha: ${campaign.name}...`);

      // Buscar brand ID e influencer IDs
      const brandId = createdBrands.find(
        (b) => b.email === campaign.brandEmail,
      )?.id;
      const assignedInfluencers = campaign.influencerEmails
        .map(
          (email) => createdInfluencers.find((inf) => inf.email === email)?.id,
        )
        .filter((id): id is string => id !== undefined);

      const campaignDoc = {
        _id: new ObjectId(),
        name: campaign.name,
        description: campaign.description,
        brandId: brandId,
        budget: campaign.budget,
        status: campaign.status,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
        assignedInfluencers,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('campaign').insertOne(campaignDoc);
      console.log(
        `✅ Campanha criada com ${assignedInfluencers.length} influencers vinculados`,
      );
    }
    console.log();

    // 4. Estatísticas de vinculação
    console.log('📊 Estatísticas de vinculação de influencers:');
    console.log('═══════════════════════════════════════════════════════');

    const influencerStats = new Map<string, number>();
    for (const campaign of campaigns) {
      for (const email of campaign.influencerEmails) {
        influencerStats.set(email, (influencerStats.get(email) || 0) + 1);
      }
    }

    console.log('Influencers em múltiplas campanhas:');
    influencerStats.forEach((count, email) => {
      const inf = createdInfluencers.find((i) => i.email === email);
      console.log(`   • ${inf?.name}: ${count} campanhas`);
    });
    console.log();

    console.log('📋 Resumo das credenciais criadas:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔑 ADMIN ORI:');
    console.log('   Email: admin@ori.com');
    console.log('   Senha: Admin123!');
    console.log();
    console.log('📱 INFLUENCERS:');
    console.log('   1. maria.silva@instagram.com / Senha@123 (2 campanhas)');
    console.log('   2. joao.santos@tiktok.com / Senha@123 (2 campanhas)');
    console.log('   3. ana.costa@youtube.com / Senha@123 (2 campanhas)');
    console.log('   4. pedro.oliveira@insta.com / Senha@123 (3 campanhas)');
    console.log('   5. julia.lima@social.com / Senha@123 (3 campanhas)');
    console.log();
    console.log('🏢 MARCAS (todas com 1 campanha ativa):');
    console.log('   1. contato@techstyle.com / Senha@123');
    console.log('   2. marketing@fitlife.com / Senha@123');
    console.log('   3. contato@beautyco.com / Senha@123');
    console.log('   4. social@travelmore.com / Senha@123');
    console.log('   5. digital@gamezone.com / Senha@123');
    console.log();
    console.log('📢 CAMPANHAS CRIADAS: 5 campanhas ativas');
    console.log(
      '   ✅ 3 influencers em pelo menos 2 campanhas (Maria, Ana, João)',
    );
    console.log('═══════════════════════════════════════════════════════');
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
}

seedDatabase()
  .then(() => {
    console.log('\n✨ Banco populado com sucesso!');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
