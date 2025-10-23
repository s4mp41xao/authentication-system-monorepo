/**
 * Script para resetar a senha do admin ORI
 * Usa diretamente o MongoDB para criar/atualizar as credenciais
 * Execute com: npx tsx scripts/reset-admin-password.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function resetAdminPassword() {
  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    console.log('🚀 Conectando ao MongoDB...\n');
    await client.connect();
    const db = client.db();

    // Dados do admin
    const adminEmail = 'admin@ori.com';
    const newPassword = 'Admin123!';
    const adminName = 'Administrador ORI';

    console.log('🔍 Verificando usuário admin...');

    // 1. Buscar ou criar usuário na collection 'user'
    let adminUser = await db.collection('user').findOne({
      email: adminEmail,
    });

    if (!adminUser) {
      console.log('📝 Criando usuário admin na collection user...');
      const userResult = await db.collection('user').insertOne({
        email: adminEmail,
        name: adminName,
        role: 'ori',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      adminUser = { _id: userResult.insertedId, email: adminEmail };
      console.log('✅ Usuário criado:', adminUser._id);
    } else {
      console.log('✅ Usuário já existe:', adminUser._id);
    }

    // 2. Hash da senha
    console.log('\n🔐 Gerando hash da senha...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('✅ Hash gerado');

    // 3. Deletar account existente (se houver)
    console.log('\n🗑️  Removendo credenciais antigas...');
    await db.collection('account').deleteMany({
      userId: adminUser._id.toString(),
    });
    console.log('✅ Credenciais antigas removidas');

    // 4. Criar novo account com Better Auth
    console.log('\n📝 Criando novas credenciais...');
    await db.collection('account').insertOne({
      userId: adminUser._id.toString(),
      accountId: adminEmail,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Credenciais criadas');

    // 5. Remover sessões antigas
    console.log('\n🗑️  Removendo sessões antigas...');
    await db.collection('session').deleteMany({
      userId: adminUser._id.toString(),
    });
    console.log('✅ Sessões antigas removidas');

    console.log('\n' + '═'.repeat(60));
    console.log('🎉 SENHA DO ADMIN RESETADA COM SUCESSO!');
    console.log('═'.repeat(60));
    console.log('\n📌 Credenciais do Admin ORI:');
    console.log('   Email: ' + adminEmail);
    console.log('   Senha: ' + newPassword);
    console.log('\n✨ Você já pode fazer login!');
    console.log('═'.repeat(60));
  } catch (error) {
    console.error('\n❌ Erro:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
}

resetAdminPassword()
  .then(() => {
    console.log('\n✨ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
