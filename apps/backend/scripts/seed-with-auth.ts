/**
 * Script para popular o banco com usuários REAIS usando Better Auth
 * Este script cria usuários que podem fazer login normalmente
 * Execute com: npm run seed-with-auth
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { createAuth } from '../src/lib/auth.js';
import { randomBytes } from 'crypto';

dotenv.config();

// Função para gerar ID único
const generateId = () => randomBytes(12).toString('hex');

const seedWithAuth = async () => {
  let client: MongoClient | null = null;

  try {
    // Conectar ao MongoDB
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL não encontrada no .env');
    }

    console.log('🔌 Conectando ao MongoDB...');
    client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db();
    console.log('✅ Conectado ao MongoDB\n');

    // Limpar dados antigos
    console.log('🗑️  Limpando dados antigos...');
    await db.collection('user').deleteMany({});
    await db.collection('account').deleteMany({});
    await db.collection('session').deleteMany({});
    await db.collection('influencers').deleteMany({});
    await db.collection('brands').deleteMany({});
    await db.collection('campaigns').deleteMany({});

    // Criar instância do Better Auth
    const auth = await createAuth();

    // ========================================
    // 0. CRIAR ADMIN ORI
    // ========================================
    console.log('\n👨‍💼 Criando usuário admin ORI...');

    try {
      await auth.api.signUpEmail({
        body: {
          email: 'admin@ori.com',
          password: 'Admin@123',
          name: 'Administrador ORI',
          role: 'ori',
        },
      });
      console.log(
        '✅ Admin ORI criado (Email: admin@ori.com | Senha: Admin@123)',
      );
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️  Admin ORI já existe');
      } else {
        throw error;
      }
    }

    // ========================================
    // 1. CRIAR USUÁRIOS INFLUENCERS
    // ========================================
    console.log('\n👥 Criando usuários influencers...');

    const influencersData = [
      {
        email: 'maria.silva@instagram.com',
        name: 'Maria Silva',
        instagram: '@mariasilva',
        followers: 125000,
        niche: 'Lifestyle',
      },
      {
        email: 'joao.santos@tiktok.com',
        name: 'João Santos',
        instagram: '@joaosantos',
        followers: 89000,
        niche: 'Tech',
      },
      {
        email: 'ana.costa@youtube.com',
        name: 'Ana Costa',
        instagram: '@anacosta',
        followers: 310000,
        niche: 'Beauty',
      },
      {
        email: 'pedro.oliveira@insta.com',
        name: 'Pedro Oliveira',
        instagram: '@pedrooliveira',
        followers: 67000,
        niche: 'Fitness',
      },
      {
        email: 'julia.lima@social.com',
        name: 'Julia Lima',
        instagram: '@julialima',
        followers: 198000,
        niche: 'Travel',
      },
    ];

    const influencerIds: string[] = [];

    for (const data of influencersData) {
      const result = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: 'Senha@123',
          name: data.name,
          role: 'influencer',
        },
      });
      influencerIds.push(result.user.id);
      console.log(`   ✓ ${data.name} criado`);
    }

    console.log(`✅ ${influencerIds.length} usuários influencers criados`);

    // ========================================
    // 2. CRIAR PERFIS DE INFLUENCERS
    // ========================================
    console.log('\n📊 Criando perfis de influencers...');

    const influencersProfiles = influencersData.map((data, index) => ({
      id: generateId(),
      userId: influencerIds[index],
      name: data.name,
      email: data.email,
      bio: `Creator de conteúdo sobre ${data.niche.toLowerCase()}.`,
      instagram: data.instagram,
      tiktok: `@${data.name.toLowerCase().replace(' ', '')}`,
      youtube: data.name,
      followers: data.followers,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection('influencers').insertMany(influencersProfiles);
    console.log(
      `✅ ${influencersProfiles.length} perfis de influencers criados`,
    );

    // ========================================
    // 3. CRIAR USUÁRIOS MARCAS
    // ========================================
    console.log('\n🏢 Criando usuários marcas...');

    const brandsData = [
      {
        email: 'contato@techstyle.com',
        name: 'TechStyle',
        description: 'Marca de roupas e acessórios tech-fashion.',
        website: 'https://techstyle.com',
        industry: 'Moda e Tecnologia',
      },
      {
        email: 'marketing@fitlife.com',
        name: 'FitLife',
        description: 'Suplementos e equipamentos fitness de alta qualidade.',
        website: 'https://fitlife.com',
        industry: 'Saúde e Fitness',
      },
      {
        email: 'contato@beautyco.com',
        name: 'BeautyCo',
        description: 'Cosméticos naturais e veganos.',
        website: 'https://beautyco.com',
        industry: 'Beleza e Cosméticos',
      },
      {
        email: 'social@travelmore.com',
        name: 'TravelMore',
        description: 'Agência de viagens e experiências únicas.',
        website: 'https://travelmore.com',
        industry: 'Turismo',
      },
      {
        email: 'digital@gamezone.com',
        name: 'GameZone',
        description: 'Jogos e periféricos para gamers.',
        website: 'https://gamezone.com',
        industry: 'Games e Entretenimento',
      },
    ];

    const brandIds: string[] = [];

    for (const data of brandsData) {
      const result = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: 'Senha@123',
          name: data.name,
          role: 'brand',
        },
      });
      brandIds.push(result.user.id);
      console.log(`   ✓ ${data.name} criada`);
    }

    console.log(`✅ ${brandIds.length} usuários marcas criados`);

    // ========================================
    // 4. CRIAR PERFIS DE MARCAS
    // ========================================
    console.log('\n📊 Criando perfis de marcas...');

    const brandsProfiles = brandsData.map((data, index) => ({
      id: generateId(),
      userId: brandIds[index],
      name: data.name,
      email: data.email,
      description: data.description,
      website: data.website,
      industry: data.industry,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection('brands').insertMany(brandsProfiles);
    console.log(`✅ ${brandsProfiles.length} perfis de marcas criados`);

    // ========================================
    // 5. CRIAR CAMPANHAS
    // ========================================
    console.log('\n📢 Criando campanhas...');

    const campaigns = [
      {
        id: generateId(),
        brandId: brandIds[0],
        name: 'Lançamento Coleção Verão',
        description: 'Divulgação da nova coleção de roupas tech-fashion.',
        budget: 50000,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-28'),
        status: 'active',
        assignedInfluencers: [influencerIds[0], influencerIds[1]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        brandId: brandIds[1],
        name: 'Campanha Fitness 2025',
        description: 'Promoção de suplementos e equipamentos para o ano novo.',
        budget: 75000,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        status: 'active',
        assignedInfluencers: [influencerIds[3]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        brandId: brandIds[2],
        name: 'Beauty Week',
        description: 'Semana especial de cosméticos naturais.',
        budget: 35000,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-07'),
        status: 'active',
        assignedInfluencers: [influencerIds[2]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        brandId: brandIds[3],
        name: 'Descubra o Mundo',
        description: 'Pacotes de viagens com desconto especial.',
        budget: 60000,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-05-31'),
        status: 'active',
        assignedInfluencers: [influencerIds[4]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        brandId: brandIds[4],
        name: 'Game Fest 2025',
        description: 'Festival de lançamentos de jogos do ano.',
        budget: 90000,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-30'),
        status: 'active',
        assignedInfluencers: [influencerIds[1], influencerIds[3]],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('campaigns').insertMany(campaigns);
    console.log(`✅ ${campaigns.length} campanhas criadas`);

    // ========================================
    // RESUMO FINAL
    // ========================================
    console.log('\n🎉 Seed concluído com sucesso!\n');
    console.log('📊 RESUMO:');
    console.log(
      `   ✅ ${influencerIds.length} usuários influencers (podem fazer login)`,
    );
    console.log(`   ✅ ${influencersProfiles.length} perfis de influencers`);
    console.log(`   ✅ ${brandIds.length} usuários marcas (podem fazer login)`);
    console.log(`   ✅ ${brandsProfiles.length} perfis de marcas`);
    console.log(`   ✅ ${campaigns.length} campanhas ativas`);

    console.log('\n🔑 CREDENCIAIS DE LOGIN:');
    console.log('\n📱 INFLUENCERS:');
    influencersData.forEach((u) => {
      console.log(`   Email: ${u.email} | Senha: Senha@123`);
    });

    console.log('\n🏢 MARCAS:');
    brandsData.forEach((u) => {
      console.log(`   Email: ${u.email} | Senha: Senha@123`);
    });
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
};

seedWithAuth();
