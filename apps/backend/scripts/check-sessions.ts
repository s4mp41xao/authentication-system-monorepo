// Script para verificar sessões no MongoDB
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const checkSessions = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');
    
    const db = client.db();
    
    // Listar todas as collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections no banco:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Verificar sessões
    console.log('\n🔍 Verificando sessões:');
    const sessions = await db.collection('session').find().toArray();
    console.log(`Total de sessões: ${sessions.length}`);
    
    if (sessions.length > 0) {
      console.log('\n📋 Sessões encontradas:');
      sessions.forEach(session => {
        console.log(`  - ID: ${session._id}`);
        console.log(`    Token: ${session.token}`);
        console.log(`    User ID: ${session.userId}`);
        console.log(`    Expires: ${session.expiresAt}`);
        console.log('');
      });
    }
    
    // Verificar usuários
    console.log('\n👥 Verificando usuários:');
    const users = await db.collection('user').find().toArray();
    console.log(`Total de usuários: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n📋 Usuários encontrados:');
      users.forEach(user => {
        console.log(`  - Email: ${user.email}`);
        console.log(`    Role: ${user.role}`);
        console.log(`    ID: ${user._id}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
};

checkSessions();
