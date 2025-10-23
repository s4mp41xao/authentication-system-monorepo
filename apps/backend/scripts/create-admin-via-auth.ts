import { config } from 'dotenv';
config();

import { MongoClient } from 'mongodb';
import { createAuth } from '../src/lib/auth.js';

async function main() {
  const email = 'adm@admi.com';
  const password = 'Admin123!';
  const name = 'ORI Admin 2';

  console.log('🔧 Criando admin via Better Auth API (sem HTTP guards)');

  // Limpar registros existentes para esse email
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  const db = client.db();

  const existingUser = await db.collection('user').findOne({ email });
  if (existingUser) {
    console.log('   → Deletando registros existentes para', email);
    await db
      .collection('account')
      .deleteMany({ userId: existingUser.id || existingUser._id?.toString() });
    await db
      .collection('session')
      .deleteMany({ userId: existingUser.id || existingUser._id?.toString() });
    await db.collection('user').deleteOne({ _id: existingUser._id });
  }

  await client.close();

  // Criar via Better Auth diretamente
  const auth = await createAuth();

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: 'ori',
      callbackURL: '/',
    },
  });

  console.log('✅ Admin criado:', {
    id: result.user?.id,
    email: result.user?.email,
    role: result.user?.role,
    hasSession: !!result.session,
  });

  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Erro ao criar admin via auth:', e);
  process.exit(1);
});
