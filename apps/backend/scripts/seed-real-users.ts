import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

dotenv.config();

// Função para gerar ID único (mesmo formato do Better Auth)
const generateId = () => randomBytes(12).toString('hex');

// Função para criar usuário com senha hasheada
const createUser = async (
  email: string,
  name: string,
  password: string,
  role: string,
) => {
  const userId = generateId();
  const accountId = generateId();

  // Better Auth usa hash próprio - vamos usar o formato direto
  const hashedPassword = await bcrypt.hash(password, 10);

  return {
    user: {
      id: userId,
      email,
      name,
      role,
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    account: {
      id: accountId,
      userId: userId,
      accountId: email, // ✅ O email é o identificador para login
      providerId: 'credential',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
};
const seedRealUsers = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');

    const db = client.db();

    // Limpar dados existentes (opcional)
    console.log('\n🗑️  Limpando dados antigos...');
    await db.collection('influencers').deleteMany({});
    await db.collection('brands').deleteMany({});
    await db.collection('campaigns').deleteMany({});

    // ========================================
    // 1. CRIAR USUÁRIOS INFLUENCERS
    // ========================================
    console.log('\n👥 Criando usuários influencers...');

    const influencerData = [
      await createUser(
        'maria.silva@instagram.com',
        'Maria Silva',
        'Senha@123',
        'influencer',
      ),
      await createUser(
        'joao.santos@tiktok.com',
        'João Santos',
        'Senha@123',
        'influencer',
      ),
      await createUser(
        'ana.costa@youtube.com',
        'Ana Costa',
        'Senha@123',
        'influencer',
      ),
      await createUser(
        'pedro.oliveira@insta.com',
        'Pedro Oliveira',
        'Senha@123',
        'influencer',
      ),
      await createUser(
        'julia.lima@social.com',
        'Julia Lima',
        'Senha@123',
        'influencer',
      ),
    ];

    // Separar users e accounts
    const influencerUsers = influencerData.map((d) => d.user);
    const influencerAccounts = influencerData.map((d) => d.account);

    // Inserir usuários e accounts no banco
    await db.collection('user').insertMany(influencerUsers);
    await db.collection('account').insertMany(influencerAccounts);
    console.log(`✅ ${influencerUsers.length} usuários influencers criados`);

    // Criar perfis de influencers
    const influencers = [
      {
        userId: influencerUsers[0].id,
        name: influencerUsers[0].name,
        email: influencerUsers[0].email,
        bio: 'Influenciadora de moda e lifestyle. Apaixonada por fotografia e viagens.',
        instagram: '@maria.silva',
        tiktok: null,
        youtube: null,
        followers: 150000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: influencerUsers[1].id,
        name: influencerUsers[1].name,
        email: influencerUsers[1].email,
        bio: 'Creator de conteúdo sobre tecnologia e games.',
        instagram: '@joaosantos',
        tiktok: '@joaosantos_tech',
        youtube: 'João Santos Tech',
        followers: 85000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: influencerUsers[2].id,
        name: influencerUsers[2].name,
        email: influencerUsers[2].email,
        bio: 'Fitness e bem-estar. Personal trainer e nutricionista.',
        instagram: '@anacosta.fit',
        tiktok: '@anacosta',
        youtube: 'Ana Costa Fitness',
        followers: 220000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: influencerUsers[3].id,
        name: influencerUsers[3].name,
        email: influencerUsers[3].email,
        bio: 'Fotógrafo profissional e influencer de viagens.',
        instagram: '@pedro.oliveira',
        tiktok: null,
        youtube: null,
        followers: 95000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: influencerUsers[4].id,
        name: influencerUsers[4].name,
        email: influencerUsers[4].email,
        bio: 'Beauty & Makeup. Maquiadora profissional.',
        instagram: '@julia.makeup',
        tiktok: '@julia.lima',
        youtube: 'Julia Lima Beauty',
        followers: 180000,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('influencers').insertMany(influencers);
    console.log(`✅ ${influencers.length} perfis de influencers criados`);

    // ========================================
    // 2. CRIAR USUÁRIOS MARCAS
    // ========================================
    console.log('\n🏢 Criando usuários marcas...');

    const brandData = [
      await createUser(
        'contato@techstyle.com',
        'TechStyle',
        'Senha@123',
        'brand',
      ),
      await createUser(
        'marketing@fitlife.com',
        'FitLife',
        'Senha@123',
        'brand',
      ),
      await createUser(
        'contato@beautyco.com',
        'BeautyCo',
        'Senha@123',
        'brand',
      ),
      await createUser(
        'social@travelmore.com',
        'TravelMore',
        'Senha@123',
        'brand',
      ),
      await createUser(
        'digital@gamezone.com',
        'GameZone',
        'Senha@123',
        'brand',
      ),
    ];

    // Separar users e accounts
    const brandUsers = brandData.map((d) => d.user);
    const brandAccounts = brandData.map((d) => d.account);

    // Inserir usuários e accounts no banco
    await db.collection('user').insertMany(brandUsers);
    await db.collection('account').insertMany(brandAccounts);
    console.log(`✅ ${brandUsers.length} usuários marcas criados`);

    // Criar perfis de marcas
    const brands = [
      {
        userId: brandUsers[0].id,
        name: brandUsers[0].name,
        email: brandUsers[0].email,
        description: 'Marca de roupas e acessórios tech-fashion.',
        website: 'https://techstyle.com',
        industry: 'Moda e Tecnologia',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: brandUsers[1].id,
        name: brandUsers[1].name,
        email: brandUsers[1].email,
        description: 'Produtos para saúde, fitness e bem-estar.',
        website: 'https://fitlife.com.br',
        industry: 'Saúde e Fitness',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: brandUsers[2].id,
        name: brandUsers[2].name,
        email: brandUsers[2].email,
        description: 'Cosméticos e produtos de beleza premium.',
        website: 'https://beautyco.com',
        industry: 'Beleza e Cosméticos',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: brandUsers[3].id,
        name: brandUsers[3].name,
        email: brandUsers[3].email,
        description: 'Agência de viagens e turismo.',
        website: 'https://travelmore.com.br',
        industry: 'Turismo',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: brandUsers[4].id,
        name: brandUsers[4].name,
        email: brandUsers[4].email,
        description: 'Loja de games, periféricos e acessórios gamer.',
        website: 'https://gamezone.com.br',
        industry: 'Games e Tecnologia',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const brandsResult = await db.collection('brands').insertMany(brands);
    console.log(`✅ ${brands.length} perfis de marcas criados`);

    // Buscar os IDs reais inseridos
    const insertedBrands = await db.collection('brands').find().toArray();

    // ========================================
    // 3. CRIAR CAMPANHAS
    // ========================================
    console.log('\n📢 Criando campanhas...');

    const campaigns = [
      {
        name: 'Campanha Verão 2025',
        brandId: insertedBrands[0]._id.toString(),
        description: 'Lançamento da coleção verão com influencers de moda',
        status: 'active',
        budget: 50000,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        assignedInfluencers: [influencers[0].userId, influencers[4].userId],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'FitLife Challenge',
        brandId: insertedBrands[1]._id.toString(),
        description: 'Desafio fitness de 30 dias com personal trainers',
        status: 'active',
        budget: 35000,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-03-02'),
        assignedInfluencers: [influencers[2].userId],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Beauty Month',
        brandId: insertedBrands[2]._id.toString(),
        description: 'Mês da beleza com tutoriais e reviews',
        status: 'active',
        budget: 40000,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-31'),
        assignedInfluencers: [influencers[4].userId],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Destinos Incríveis',
        brandId: insertedBrands[3]._id.toString(),
        description: 'Campanha de divulgação de pacotes de viagem',
        status: 'active',
        budget: 60000,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-06-30'),
        assignedInfluencers: [influencers[3].userId, influencers[0].userId],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'GameZone Streamers',
        brandId: insertedBrands[4]._id.toString(),
        description: 'Parcerias com streamers e gamers',
        status: 'active',
        budget: 45000,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-31'),
        assignedInfluencers: [influencers[1].userId],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('campaigns').insertMany(campaigns);
    console.log(`✅ ${campaigns.length} campanhas criadas`);

    // ========================================
    // RESUMO
    // ========================================
    console.log('\n🎉 Seed concluído com sucesso!\n');
    console.log('📊 RESUMO:');
    console.log(
      `   ✅ ${influencerUsers.length} usuários influencers (podem fazer login)`,
    );
    console.log(`   ✅ ${influencers.length} perfis de influencers`);
    console.log(
      `   ✅ ${brandUsers.length} usuários marcas (podem fazer login)`,
    );
    console.log(`   ✅ ${brands.length} perfis de marcas`);
    console.log(`   ✅ ${campaigns.length} campanhas ativas`);

    console.log('\n🔑 CREDENCIAIS DE LOGIN:');
    console.log('\n📱 INFLUENCERS:');
    influencerUsers.forEach((u) => {
      console.log(`   Email: ${u.email} | Senha: Senha@123`);
    });

    console.log('\n🏢 MARCAS:');
    brandUsers.forEach((u) => {
      console.log(`   Email: ${u.email} | Senha: Senha@123`);
    });
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
};

seedRealUsers();
