import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

const rawUri = process.env.DATABASE_URL

if (!rawUri) {
  console.error('❌ DATABASE_URL não configurada')
  process.exit(1)
}

const uri = rawUri

function short(id?: string | null) {
  if (!id) return 'n/a'
  return `${id}`.slice(0, 8)
}

async function run() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  console.log('📊 Coleções disponíveis:')
  const collections = await db.listCollections().toArray()
  for (const col of collections) {
    console.log(` - ${col.name}`)
  }

  console.log('\n🏢 Marcas (brands):')
  const brands = await db.collection('brands').find({}).toArray()
  for (const brand of brands) {
    console.log(
  ` • ${brand.name} | _id=${short(String(brand._id))} | userId=${brand.userId}`
    )
  }

  console.log('\n👤 Influenciadores (influencers):')
  const influencers = await db.collection('influencers').find({}).toArray()
  for (const inf of influencers) {
    console.log(
  ` • ${inf.name} | _id=${short(String(inf._id))} | userId=${inf.userId}`
    )
  }

  const campaignCollections = ['campaigns', 'campaign']

  for (const colName of campaignCollections) {
    if (!(collections.find(col => col.name === colName))) {
      continue
    }

    console.log(`\n📣 Campanhas (${colName}):`)
    const campaigns = await db.collection(colName).find({}).toArray()
    for (const campaign of campaigns) {
      const brandMatch = brands.find(b => b.userId === campaign.brandId)
      const assigned = Array.isArray(campaign.assignedInfluencers)
        ? campaign.assignedInfluencers
        : []
      const influencerMatches = assigned.map((id: string) => {
        const info = influencers.find(inf => inf.userId === id)
        return info ? `${id} ✅ ${info.name}` : `${id} ⚠️ sem correspondência`
      })
      console.log(
        ` • ${campaign.name} | brandId=${campaign.brandId} | ` +
          `brandMatch=${brandMatch ? 'OK' : 'NÃO ENCONTRADA'} | ` +
          `assigned=${assigned.length}`
      )
      if (influencerMatches.length > 0) {
        influencerMatches.forEach(match => console.log(`    - ${match}`))
      }
    }
  }

  await client.close()
  console.log('\n✅ Análise concluída')
}

run().catch(err => {
  console.error('❌ Erro na análise:', err)
  process.exit(1)
})
