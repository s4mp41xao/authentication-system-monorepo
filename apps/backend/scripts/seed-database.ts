/**
 * Script para popular o banco de dados com dados de teste
 * Execute com: npx tsx scripts/seed-database.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    console.log('🚀 Conectando ao MongoDB...\n');
    await client.connect();
    const db = client.db();

    console.log('🗑️  Limpando dados antigos...');
    await db.collection('user').deleteMany({});
    await db.collection('influencer').deleteMany({});
    await db.collection('brand').deleteMany({});
    await db.collection('campaign').deleteMany({});
    console.log('✅ Banco limpo!\n');

    console.log('📝 Criando usuários via API do backend...\n');

    // Usar a API do Vercel em produção
    const API_URL = 'https://authentication-system-monorepo-back.vercel.app';

    // 1. Criar Admin ORI
    console.log('👤 Criando Admin ORI...');
    const adminResponse = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ori.com',
        password: 'Admin123!',
        name: 'Administrador ORI',
        role: 'ori',
      }),
    });

    if (adminResponse.ok) {
      console.log('✅ Admin criado: admin@ori.com / Admin123!\n');
    } else {
      const error = await adminResponse.text();
      console.log('⚠️  Admin:', error, '\n');
    }

    // 2. Criar Influencers
    const influencers = [
      {
        email: 'maria.silva@instagram.com',
        password: 'Maria123!',
        name: 'Maria Silva',
        role: 'influencer',
        instagram: '@mariasilva',
        followers: 50000,
        bio: 'Influenciadora de moda e lifestyle',
      },
      {
        email: 'joao.santos@instagram.com',
        password: 'Joao123!',
        name: 'João Santos',
        role: 'influencer',
        instagram: '@joaosantos',
        followers: 120000,
        bio: 'Creator de conteúdo tech',
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
        console.log(`✅ ${inf.name} criado: ${inf.email} / ${inf.password}`);
      } else {
        const error = await response.text();
        console.log(`⚠️  ${inf.name}:`, error);
      }
    }
    console.log();

    // 3. Criar Brands
    const brands = [
      {
        email: 'contato@lojavirtual.com',
        password: 'Loja123!',
        name: 'Loja Virtual',
        role: 'brand',
        website: 'https://lojavirtual.com',
        industry: 'E-commerce',
        description: 'Loja virtual de produtos variados',
      },
      {
        email: 'marketing@techbrand.com',
        password: 'Tech123!',
        name: 'Tech Brand',
        role: 'brand',
        website: 'https://techbrand.com',
        industry: 'Tecnologia',
        description: 'Marca de tecnologia e inovação',
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
        console.log(
          `✅ ${brand.name} criado: ${brand.email} / ${brand.password}`,
        );
      } else {
        const error = await response.text();
        console.log(`⚠️  ${brand.name}:`, error);
      }
    }
    console.log();

    console.log('📊 Resumo das credenciais criadas:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔑 ADMIN ORI:');
    console.log('   Email: admin@ori.com');
    console.log('   Senha: Admin123!');
    console.log();
    console.log('👤 INFLUENCERS:');
    console.log('   1. maria.silva@instagram.com / Maria123!');
    console.log('   2. joao.santos@instagram.com / Joao123!');
    console.log();
    console.log('🏢 BRANDS:');
    console.log('   1. contato@lojavirtual.com / Loja123!');
    console.log('   2. marketing@techbrand.com / Tech123!');
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
