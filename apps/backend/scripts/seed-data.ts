// Script para popular o banco de dados com dados de teste
// Execute: npm run seed-data

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');

    const db = client.db();

    // Limpar dados existentes (opcional - comente se não quiser limpar)
    // await db.collection('influencers').deleteMany({});
    // await db.collection('brands').deleteMany({});
    // await db.collection('campaigns').deleteMany({});

    // Seed Influencers
    const influencers = [
      {
        userId: 'user_influencer_1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        bio: 'Influenciador de lifestyle e viagens com 5 anos de experiência',
        instagram: '@joaosilva',
        tiktok: '@joaosilvatiktok',
        youtube: 'joaosilvaofficial',
        followers: 150000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_influencer_2',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        bio: 'Criadora de conteúdo focada em moda e beleza',
        instagram: '@mariasantos',
        tiktok: '@msantos',
        youtube: 'mariasantosbeauty',
        followers: 280000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_influencer_3',
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        bio: 'Gamer e streamer profissional',
        instagram: '@pedrooliv',
        tiktok: '@pedroogamer',
        youtube: 'pedrooliveiragaming',
        followers: 500000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_influencer_4',
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        bio: 'Fitness e vida saudável',
        instagram: '@anacosta.fit',
        tiktok: '@anacostafit',
        youtube: 'anacostafitness',
        followers: 320000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_influencer_5',
        name: 'Lucas Ferreira',
        email: 'lucas.ferreira@email.com',
        bio: 'Tech reviewer e entusiasta de gadgets',
        instagram: '@lucastech',
        tiktok: '@lucasferreiratech',
        youtube: 'lucastechreview',
        followers: 420000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const influencersResult = await db
      .collection('influencers')
      .insertMany(influencers);
    console.log(`✅ ${influencersResult.insertedCount} influencers inseridos`);

    // Seed Brands
    const brands = [
      {
        userId: 'user_brand_1',
        name: 'TechStore Brasil',
        email: 'contato@techstore.com.br',
        description: 'Maior loja de tecnologia do Brasil',
        website: 'https://techstore.com.br',
        industry: 'Tecnologia',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_brand_2',
        name: 'Moda Urbana',
        email: 'marketing@modaurbana.com',
        description: 'Moda streetwear e urbana',
        website: 'https://modaurbana.com',
        industry: 'Moda',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_brand_3',
        name: 'FitLife Suplementos',
        email: 'contato@fitlife.com',
        description: 'Suplementos alimentares e nutrição esportiva',
        website: 'https://fitlife.com',
        industry: 'Saúde e Fitness',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_brand_4',
        name: 'GameZone',
        email: 'marketing@gamezone.com',
        description: 'Loja especializada em games e periféricos',
        website: 'https://gamezone.com',
        industry: 'Games',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user_brand_5',
        name: 'Beauty Brasil',
        email: 'contato@beautybrasil.com',
        description: 'Cosméticos e produtos de beleza',
        website: 'https://beautybrasil.com',
        industry: 'Beleza',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const brandsResult = await db.collection('brands').insertMany(brands);
    console.log(`✅ ${brandsResult.insertedCount} marcas inseridas`);

    // Pegar IDs inseridos para usar nas campanhas
    const insertedInfluencers = await db
      .collection('influencers')
      .find()
      .toArray();
    const insertedBrands = await db.collection('brands').find().toArray();

    // Seed Campaigns
    const campaigns = [
      {
        name: 'Lançamento Smartphone XYZ',
        brandId: insertedBrands[0]._id.toString(),
        description: 'Campanha de lançamento do novo smartphone flagship',
        status: 'active',
        budget: 150000,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-11-30'),
        assignedInfluencers: [
          insertedInfluencers[4]._id.toString(), // Lucas Ferreira (tech)
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coleção Primavera/Verão',
        brandId: insertedBrands[1]._id.toString(),
        description: 'Divulgação da nova coleção de moda',
        status: 'active',
        budget: 80000,
        startDate: new Date('2025-10-15'),
        endDate: new Date('2025-12-31'),
        assignedInfluencers: [
          insertedInfluencers[1]._id.toString(), // Maria Santos (moda)
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Desafio 30 Dias FitLife',
        brandId: insertedBrands[2]._id.toString(),
        description: 'Campanha de engajamento com desafio fitness',
        status: 'active',
        budget: 60000,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-12-01'),
        assignedInfluencers: [
          insertedInfluencers[3]._id.toString(), // Ana Costa (fitness)
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Torneio GameZone 2025',
        brandId: insertedBrands[3]._id.toString(),
        description: 'Torneio de e-sports patrocinado',
        status: 'active',
        budget: 200000,
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-20'),
        assignedInfluencers: [
          insertedInfluencers[2]._id.toString(), // Pedro Oliveira (gamer)
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Black Friday Beauty',
        brandId: insertedBrands[4]._id.toString(),
        description: 'Campanha especial de Black Friday',
        status: 'active',
        budget: 120000,
        startDate: new Date('2025-11-20'),
        endDate: new Date('2025-11-30'),
        assignedInfluencers: [
          insertedInfluencers[1]._id.toString(), // Maria Santos (beleza)
          insertedInfluencers[0]._id.toString(), // João Silva (lifestyle)
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Campanha Natal Tech',
        brandId: insertedBrands[0]._id.toString(),
        description: 'Promoções especiais de Natal',
        status: 'active',
        budget: 180000,
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-25'),
        assignedInfluencers: [
          insertedInfluencers[4]._id.toString(), // Lucas Ferreira (tech)
          insertedInfluencers[2]._id.toString(), // Pedro Oliveira (gamer)
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const campaignsResult = await db
      .collection('campaigns')
      .insertMany(campaigns);
    console.log(`✅ ${campaignsResult.insertedCount} campanhas inseridas`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - ${influencersResult.insertedCount} Influencers`);
    console.log(`   - ${brandsResult.insertedCount} Marcas`);
    console.log(`   - ${campaignsResult.insertedCount} Campanhas`);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
};

seedData();
