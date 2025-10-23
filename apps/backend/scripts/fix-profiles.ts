import { MongoClient, ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Carregar variáveis de ambiente do .env
config();

const MONGODB_URI = process.env.DATABASE_URL || '';

if (!MONGODB_URI) {
  console.error('❌ DATABASE_URL não encontrado no .env');
  process.exit(1);
}

async function fixProfiles() {
  console.log('🔧 CORRIGINDO PERFIS E ADMIN ORI\n');
  console.log('═══════════════════════════════════════════════════════\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    // ============================================
    // 1. CORRIGIR ADMIN ORI
    // ============================================
    console.log('👤 ADMIN ORI\n');

    const adminEmail = 'admin@ori.com';
    const adminPassword = 'Admin123!';
    const adminRole = 'ori';

    // 1.1 Encontrar ou criar usuário admin
    let adminUser = await db.collection('user').findOne({ email: adminEmail });

    if (adminUser) {
      console.log('   ✅ Usuário admin já existe:', adminUser._id);
      // Garantir que tem role correto
      await db
        .collection('user')
        .updateOne(
          { _id: adminUser._id },
          { $set: { role: adminRole, name: 'ORI Admin' } },
        );
      console.log('   ✅ Role e nome atualizados');
    } else {
      // Criar novo usuário
      adminUser = {
        _id: new ObjectId(),
        email: adminEmail,
        emailVerified: false,
        name: 'ORI Admin',
        role: adminRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection('user').insertOne(adminUser);
      console.log('   ✅ Usuário admin criado:', adminUser._id);
    }

    // 1.2 Recriar credenciais do admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('   ✅ Hash gerado');

    // Deletar credenciais antigas
    await db.collection('account').deleteMany({
      userId: adminUser._id.toString(),
    });
    console.log('   ✅ Credenciais antigas removidas');

    // Criar novas credenciais
    await db.collection('account').insertOne({
      _id: new ObjectId(),
      userId: adminUser._id.toString(),
      accountId: adminEmail,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('   ✅ Credenciais criadas\n');

    console.log('   🎉 ADMIN ORI CORRIGIDO!');
    console.log(`   📌 Credenciais: ${adminEmail} / ${adminPassword}\n`);

    // ============================================
    // 2. CRIAR PERFIS PARA INFLUENCERS
    // ============================================
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('👤 INFLUENCERS\n');

    const influencers = [
      {
        email: 'maria.silva@instagram.com',
        name: 'Maria Silva',
        instagram: '@mariasilva',
        followers: 85000,
        bio: 'Fashion & Lifestyle | 📍 São Paulo',
      },
      {
        email: 'joao.santos@tiktok.com',
        name: 'João Santos',
        instagram: '@joaosantos',
        followers: 120000,
        bio: 'Tech Content Creator | Gaming & Reviews',
      },
      {
        email: 'ana.costa@youtube.com',
        name: 'Ana Costa',
        instagram: '@anacosta',
        followers: 200000,
        bio: 'Travel Vlogger | ✈️ Exploring the World',
      },
      {
        email: 'pedro.oliveira@insta.com',
        name: 'Pedro Oliveira',
        instagram: '@pedrooliveira',
        followers: 65000,
        bio: 'Fitness Coach | 💪 Healthy Lifestyle',
      },
      {
        email: 'julia.lima@social.com',
        name: 'Julia Lima',
        instagram: '@julialima',
        followers: 95000,
        bio: 'Beauty & Makeup Artist | ✨',
      },
    ];

    for (const inf of influencers) {
      console.log(`   Processando: ${inf.name} (${inf.email})`);

      // Buscar usuário
      const user = await db.collection('user').findOne({ email: inf.email });

      if (!user) {
        console.log(`   ⚠️  Usuário não encontrado - pulando\n`);
        continue;
      }

      // Verificar se já tem perfil
      const existingProfile = await db
        .collection('influencerProfile')
        .findOne({ userId: user._id.toString() });

      if (existingProfile) {
        console.log(`   ✅ Perfil já existe - atualizando dados`);
        await db.collection('influencerProfile').updateOne(
          { _id: existingProfile._id },
          {
            $set: {
              name: inf.name,
              email: inf.email,
              instagram: inf.instagram,
              followers: inf.followers,
              bio: inf.bio,
              updatedAt: new Date(),
            },
          },
        );
      } else {
        console.log(`   🆕 Criando novo perfil`);
        await db.collection('influencerProfile').insertOne({
          _id: new ObjectId(),
          userId: user._id.toString(),
          name: inf.name,
          email: inf.email,
          instagram: inf.instagram,
          tiktok: '',
          youtube: '',
          followers: inf.followers,
          bio: inf.bio,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(`   ✅ ${inf.name} - perfil OK\n`);
    }

    // ============================================
    // 3. CRIAR PERFIS PARA BRANDS
    // ============================================
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('🏢 BRANDS\n');

    const brands = [
      {
        email: 'contato@techstyle.com',
        name: 'TechStyle',
        website: 'https://techstyle.com',
        industry: 'Fashion Tech',
        description: 'Moda tecnológica e inovadora para o público jovem',
      },
      {
        email: 'marketing@fitlife.com',
        name: 'FitLife',
        website: 'https://fitlife.com',
        industry: 'Health & Fitness',
        description: 'Produtos e suplementos para vida fitness',
      },
      {
        email: 'contato@beautyco.com',
        name: 'BeautyCo',
        website: 'https://beautyco.com',
        industry: 'Beauty & Cosmetics',
        description: 'Cosméticos premium e cruelty-free',
      },
      {
        email: 'social@travelmore.com',
        name: 'TravelMore',
        website: 'https://travelmore.com',
        industry: 'Travel & Tourism',
        description: 'Agência de viagens e experiências únicas',
      },
      {
        email: 'digital@gamezone.com',
        name: 'GameZone',
        website: 'https://gamezone.com',
        industry: 'Gaming & Entertainment',
        description: 'Loja de games e acessórios gamer',
      },
    ];

    for (const brand of brands) {
      console.log(`   Processando: ${brand.name} (${brand.email})`);

      // Buscar usuário
      const user = await db.collection('user').findOne({ email: brand.email });

      if (!user) {
        console.log(`   ⚠️  Usuário não encontrado - pulando\n`);
        continue;
      }

      // Verificar se já tem perfil
      const existingProfile = await db
        .collection('brandProfile')
        .findOne({ userId: user._id.toString() });

      if (existingProfile) {
        console.log(`   ✅ Perfil já existe - atualizando dados`);
        await db.collection('brandProfile').updateOne(
          { _id: existingProfile._id },
          {
            $set: {
              name: brand.name,
              email: brand.email,
              website: brand.website,
              industry: brand.industry,
              description: brand.description,
              updatedAt: new Date(),
            },
          },
        );
      } else {
        console.log(`   🆕 Criando novo perfil`);
        await db.collection('brandProfile').insertOne({
          _id: new ObjectId(),
          userId: user._id.toString(),
          name: brand.name,
          email: brand.email,
          website: brand.website,
          industry: brand.industry,
          description: brand.description,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(`   ✅ ${brand.name} - perfil OK\n`);
    }

    // ============================================
    // 4. VERIFICAÇÃO FINAL
    // ============================================
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📊 VERIFICAÇÃO FINAL\n');

    const totalInfluencers = await db
      .collection('influencerProfile')
      .countDocuments();
    const totalBrands = await db.collection('brandProfile').countDocuments();
    const totalCampaigns = await db.collection('campaign').countDocuments();

    console.log(`   ✅ Influencer Profiles: ${totalInfluencers}`);
    console.log(`   ✅ Brand Profiles: ${totalBrands}`);
    console.log(`   ✅ Campanhas: ${totalCampaigns}`);
    console.log(`   ✅ Admin ORI: Credenciais corrigidas`);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📋 RESUMO DAS CREDENCIAIS');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('🔑 ADMIN ORI:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Senha: ${adminPassword}`);
    console.log();
    console.log('📱 INFLUENCERS:');
    console.log('   Todos: Senha@123');
    console.log('   - maria.silva@instagram.com');
    console.log('   - joao.santos@tiktok.com');
    console.log('   - ana.costa@youtube.com');
    console.log('   - pedro.oliveira@insta.com');
    console.log('   - julia.lima@social.com');
    console.log();
    console.log('🏢 BRANDS:');
    console.log('   Todos: Senha@123');
    console.log('   - contato@techstyle.com');
    console.log('   - marketing@fitlife.com');
    console.log('   - contato@beautyco.com');
    console.log('   - social@travelmore.com');
    console.log('   - digital@gamezone.com');
    console.log('\n═══════════════════════════════════════════════════════');
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
}

fixProfiles()
  .then(() => {
    console.log('\n✨ Perfis corrigidos com sucesso!');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
