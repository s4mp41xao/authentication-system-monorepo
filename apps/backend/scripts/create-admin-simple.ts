import { config } from 'dotenv';
config();

async function createAdminORI() {
  console.log('🔧 CRIANDO ADMIN ORI - MÉTODO GARANTIDO\n');
  console.log('⚠️  CRIANDO DIRETAMENTE NO MONGODB DE PRODUÇÃO\n');

  const adminData = {
    email: 'admin@ori.com',
    password: 'Admin123!',
    name: 'ORI Admin',
    role: 'ori',
  };

  console.log('📧 Email:', adminData.email);
  console.log('🔑 Senha:', adminData.password);
  console.log();

  // Criar diretamente no MongoDB (funciona tanto local quanto produção)
  await createAdminDirectMongo(adminData);
}

async function createAdminDirectMongo(adminData: {
  email: string;
  password: string;
  name: string;
  role: string;
}) {
  const { MongoClient, ObjectId } = await import('mongodb');
  const bcrypt = await import('bcrypt');

  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    await client.connect();
    const db = client.db();

    console.log('🔍 Verificando se admin já existe...');

    // 1. Deletar admin antigo se existir
    const existingUser = await db
      .collection('user')
      .findOne({ email: adminData.email });
    if (existingUser) {
      console.log('   → Deletando usuário antigo...');
      await db.collection('user').deleteOne({ email: adminData.email });
      await db
        .collection('account')
        .deleteMany({ userId: existingUser._id.toString() });
      await db
        .collection('session')
        .deleteMany({ userId: existingUser._id.toString() });
    }

    // 2. Criar novo usuário
    console.log('📝 Criando novo usuário na coleção "user"...');
    const userId = new ObjectId();
    await db.collection('user').insertOne({
      _id: userId,
      id: userId.toString(),
      email: adminData.email,
      emailVerified: false,
      name: adminData.name,
      role: adminData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('   ✅ Usuário criado:', userId);

    // 3. Criar credenciais
    console.log('🔐 Criando credenciais na coleção "account"...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await db.collection('account').insertOne({
      _id: new ObjectId(),
      userId: userId.toString(),
      accountId: adminData.email,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('   ✅ Credenciais criadas');

    console.log();
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 ADMIN ORI CRIADO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Senha: ${adminData.password}`);
    console.log(`   User ID: ${userId}`);
    console.log('═══════════════════════════════════════════════════════');
  } finally {
    await client.close();
  }
}

createAdminORI()
  .then(() => {
    console.log('\n✨ Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
