const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;

async function testConnection() {
  console.log('Testando conexão com MongoDB...');
  console.log('URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Oculta senha

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    const admin = client.db().admin();
    const dbInfo = await admin.listDatabases();
    console.log('Databases disponíveis:', dbInfo.databases.map(db => db.name));
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();
