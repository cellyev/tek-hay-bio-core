import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMediaUsage } from '@/lib/media/getMediaUsage'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const collection = searchParams.get('collection')
    const id = searchParams.get('id')

    if (!collection || !id) {
      return NextResponse.json({ error: 'Missing collection or id' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const usage = await getMediaUsage(payload, collection, id)

    return NextResponse.json(usage)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
