/**
 * Script para criar o primeiro usuário administrador (ORI)
 * Execute com: npx tsx scripts/create-admin.ts
 */

import { createAuth } from '../src/lib/auth';
import * as dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    console.log('🚀 Iniciando criação do usuário administrador...\n');

    const auth = await createAuth();

    // Dados do administrador
    const adminData = {
      email: 'admin@ori.com',
      password: '?cN^3Yyb/4@GkbH',
      name: 'Administrador ORI',
      role: 'ori',
      callbackURL: '/dashboard',
    };

    console.log('📝 Dados do admin:');
    console.log('Email:', adminData.email);
    console.log('Nome:', adminData.name);
    console.log('Role:', adminData.role);
    console.log('Senha:', adminData.password);
    console.log('\n🔄 Criando usuário...\n');

    // Cria o usuário usando a API do Better Auth
    const result = await auth.api.signUpEmail({
      body: adminData,
    });

    console.log('🎉 Usuário administrador criado com sucesso!\n');
    console.log('✅ Resultado:', JSON.stringify(result, null, 2));
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    console.log('\n📌 Use estas credenciais para fazer login:');
    console.log('Email:', adminData.email);
    console.log('Senha:', adminData.password);
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário admin:');
    console.error(error.message || error);

    if (
      error.message?.includes('already exists') ||
      error.message?.includes('duplicate')
    ) {
      console.log('\n⚠️  Este email já está registrado.');
      console.log(
        '💡 Tente usar um email diferente ou faça login com as credenciais existentes.',
      );
    }

    throw error;
  }
}

// Executa o script
createAdminUser()
  .then(() => {
    console.log('\n✨ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script finalizado com erro');
    process.exit(1);
  });
