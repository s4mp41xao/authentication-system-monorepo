/**
 * Script para DELETAR o usuário admin antigo e criar um novo
 * Execute com: npx tsx scripts/recreate-admin.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

async function recreateAdmin() {
  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    console.log('🚀 Conectando ao MongoDB...\n');
    await client.connect();
    const db = client.db();

    const email = 'admin@ori.com';

    console.log('🗑️  Removendo usuário antigo (se existir)...');
    const deleteResult = await db.collection('user').deleteMany({ email });
    console.log(`   Removidos: ${deleteResult.deletedCount} documento(s)\n`);

    console.log('✅ Agora você pode criar um novo admin via /auth/signup');
    console.log('📝 Use estes dados no frontend:');
    console.log('   Email: admin@ori.com');
    console.log('   Password: (escolha uma senha forte)');
    console.log('   Name: Administrador ORI');
    console.log('   Role: ori\n');
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Conexão fechada');
  }
}

recreateAdmin()
  .then(() => {
    console.log('\n✨ Script finalizado!');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
