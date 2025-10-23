import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { UserRole } from '../auth/enums/user-role.enum';

// Singleton to reuse the same client and auth instance
let authInstance: any = null;
let clientInstance: MongoClient | null = null;

async function createAuth() {
  // Return existing instance if already created
  if (authInstance) {
    return authInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in .env file');
  }

  console.log('🔌 Conectando Better Auth ao MongoDB...');

  try {
    // Create and connect MongoDB client
    clientInstance = new MongoClient(databaseUrl);
    await clientInstance.connect();

    const db = clientInstance.db();

    console.log('✅ Better Auth conectado ao MongoDB com sucesso!');

    const auth = betterAuth({
      database: mongodbAdapter(db, { client: clientInstance }),
      emailAndPassword: {
        enabled: true,
      },
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      // Configuração de campos customizados do usuário
      user: {
        additionalFields: {
          role: {
            type: 'string',
            required: true,
            defaultValue: UserRole.INFLUENCER,
            input: true, // Permite que o campo seja passado no registro
          },
        },
      },
      // Configuração de sessão
      session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 dias
        updateAge: 60 * 60 * 24, // Atualiza a cada 1 dia
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5, // 5 minutos de cache
        },
      },
      // Configuração explícita de cookies
      advanced: {
        cookieOptions: {
          sameSite: 'lax', // Permite cross-origin em desenvolvimento
          secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
          httpOnly: true,
        },
        useSecureCookies: process.env.NODE_ENV === 'production',
      },
    });

    // Ensure methods exist
    if (!auth.api?.signUpEmail || !auth.api?.signInEmail) {
      throw new Error(
        'Methods signUpEmail and signInEmail not found in auth.api',
      );
    }

    authInstance = auth; // Armazena a instância completa do auth
    return authInstance;
  } catch (error) {
    console.error('❌ Erro ao conectar Better Auth:', error);
    throw error;
  }
}

// Function to close the connection (useful for tests or shutdown)
async function closeAuthConnection() {
  if (clientInstance) {
    await clientInstance.close();
    clientInstance = null;
    authInstance = null;
    console.log('🔌 Conexão do Better Auth fechada');
  }
}

export { createAuth, closeAuthConnection };
