import { MongoClient, ObjectId } from 'mongodb'
import { config } from 'dotenv'

config()

const rawUri = process.env.DATABASE_URL

if (!rawUri) {
  console.error('❌ DATABASE_URL não configurada')
  process.exit(1)
}

const uri = rawUri

interface LegacyCampaign {
  _id: ObjectId
  name: string
  description?: string
  status?: string
  budget?: number
  startDate?: Date | string
  endDate?: Date | string
  brandId: string
  assignedInfluencers?: string[]
  createdAt?: Date
  updatedAt?: Date
}

function toDate(value?: Date | string): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

async function migrateCampaigns() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  const legacyCollection = db.collection<LegacyCampaign>('campaign')
  const targetCollection = db.collection<LegacyCampaign>('campaigns')
  const backupCollection = db.collection('campaigns_legacy')

  console.log('🗃️  Iniciando migração de campanhas...')

  // Backup da collection atual "campaigns"
  const existingCampaigns = await targetCollection.find({}).toArray()
  if (existingCampaigns.length > 0) {
    await backupCollection.deleteMany({})
    await backupCollection.insertMany(existingCampaigns)
    console.log(`📦 Backup criado em "campaigns_legacy" (${existingCampaigns.length} docs) `)
  } else {
    console.log('ℹ️  Nenhuma campanha atual para backup (collection "campaigns" vazia).')
  }

  // Limpar coleção de destino antes de inserir dados corretos
  await targetCollection.deleteMany({})

  const legacyCampaigns = await legacyCollection.find({}).toArray()
  console.log(`📥 Encontradas ${legacyCampaigns.length} campanhas na coleção legacy "campaign"`)

  let inserted = 0
  for (const legacy of legacyCampaigns) {
    const doc = {
      _id: legacy._id,
      name: legacy.name,
      description: legacy.description ?? '',
      status: legacy.status ?? 'active',
      budget: legacy.budget ?? null,
      startDate: toDate(legacy.startDate),
      endDate: toDate(legacy.endDate),
      brandId: legacy.brandId,
      assignedInfluencers: Array.isArray(legacy.assignedInfluencers)
        ? legacy.assignedInfluencers
        : [],
      createdAt: legacy.createdAt ?? new Date(),
      updatedAt: new Date()
    }

    await targetCollection.insertOne(doc as any)
    inserted++
  }

  console.log(`✅ Campanhas migradas para "campaigns": ${inserted}`)
  console.log('🎉 Migração de campanhas concluída com sucesso!')

  await client.close()
}

migrateCampaigns().catch(err => {
  console.error('❌ Erro ao migrar campanhas:', err)
  process.exit(1)
})
