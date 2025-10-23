import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
config()

// This migration copies documents from legacy collections used by scripts
// (influencerProfile, brandProfile) into Mongoose collections actually used
// by the Nest services (influencers, brands), matching expected fields.

async function migrate() {
  const uri = process.env.DATABASE_URL!
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    console.log('🔄 Iniciando migração de perfis...')

    // 1) Influencers: influencerProfile -> influencers
    const legacyInfluencers = await db.collection('influencerProfile').find({}).toArray()
    console.log(`👤 Encontrados ${legacyInfluencers.length} perfis de influencer (legacy)`)

    let createdInf = 0
    let updatedInf = 0

    for (const legacy of legacyInfluencers) {
      try {
        const doc = {
          userId: legacy.userId,
          name: legacy.name,
          email: legacy.email,
          bio: legacy.bio || '',
          instagram: legacy.instagram || '',
          tiktok: legacy.tiktok || '',
          youtube: legacy.youtube || '',
          followers: legacy.followers ?? 0,
          active: legacy.active ?? true,
          createdAt: legacy.createdAt || new Date(),
          updatedAt: new Date()
        }

        // Match on userId OR email to respect unique email index
        const existing = await db
          .collection('influencers')
          .findOne({ $or: [{ userId: doc.userId }, { email: doc.email }] })
        if (existing) {
          await db.collection('influencers').updateOne({ _id: existing._id }, { $set: doc })
          updatedInf++
        } else {
          await db.collection('influencers').insertOne(doc)
          createdInf++
        }
      } catch (err) {
        console.error(`⚠️  Falha ao migrar influencer ${legacy?.email || legacy?.userId}:`, err)
      }
    }

    console.log(`✅ Influencers: ${createdInf} criados, ${updatedInf} atualizados`)

    // 2) Brands: brandProfile -> brands
    const legacyBrands = await db.collection('brandProfile').find({}).toArray()
    console.log(`🏢 Encontrados ${legacyBrands.length} perfis de brand (legacy)`)

    let createdBrand = 0
    let updatedBrand = 0

    for (const legacy of legacyBrands) {
      try {
        const doc = {
          userId: legacy.userId,
          name: legacy.name,
          email: legacy.email,
          description: legacy.description || '',
          website: legacy.website || '',
          industry: legacy.industry || '',
          active: legacy.active ?? true,
          createdAt: legacy.createdAt || new Date(),
          updatedAt: new Date()
        }

        // Match on userId OR email to avoid duplicates
        const existing = await db
          .collection('brands')
          .findOne({ $or: [{ userId: doc.userId }, { email: doc.email }] })
        if (existing) {
          await db.collection('brands').updateOne({ _id: existing._id }, { $set: doc })
          updatedBrand++
        } else {
          await db.collection('brands').insertOne(doc)
          createdBrand++
        }
      } catch (err) {
        console.error(`⚠️  Falha ao migrar brand ${legacy?.email || legacy?.userId}:`, err)
      }
    }

    console.log(`✅ Brands: ${createdBrand} criados, ${updatedBrand} atualizados`)

    console.log('🎉 Migração concluída com sucesso!')
  } catch (e) {
    console.error('❌ Erro na migração:', e)
    process.exit(1)
  } finally {
    await client.close()
  }
}

migrate().then(() => process.exit(0))
