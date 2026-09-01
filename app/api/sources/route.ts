import { NextResponse } from 'next/server'
import { collectOfficialSources } from '@/lib/open-sources'
import { Client } from 'pg'

export async function GET() {
  const sources = await collectOfficialSources()
  let persisted = false
  if (process.env.DATABASE_URL) { const client = new Client({ connectionString: process.env.DATABASE_URL }); try { await client.connect(); await client.query(`CREATE TABLE IF NOT EXISTS official_source_snapshots (id text primary key, title text not null, url text not null, status text not null, checked_at timestamptz not null, hash text, excerpt text)`); for (const source of sources) await client.query('INSERT INTO official_source_snapshots (id,title,url,status,checked_at,hash,excerpt) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET status=$4, checked_at=$5, hash=$6, excerpt=$7', [source.id, source.title, source.url, source.status, source.checkedAt, source.hash ?? null, source.excerpt ?? null]); persisted = true } catch { persisted = false } finally { await client.end().catch(() => undefined) } }
  return NextResponse.json({ checkedAt: new Date().toISOString(), persisted, sources, summary: { total: sources.length, ready: sources.filter(source => source.status === 'ready').length } })
}
