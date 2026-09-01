import { createHash } from 'node:crypto'

export const officialSources = [
  { id: 'nalog', title: 'ФНС России', url: 'https://www.nalog.gov.ru/' },
  { id: 'pravo', title: 'Официальное опубликование правовых актов', url: 'http://publication.pravo.gov.ru/' },
  { id: 'rkn', title: 'Роскомнадзор', url: 'https://rkn.gov.ru/' },
  { id: 'cbr', title: 'Банк России', url: 'https://cbr.ru/' },
]

type SourceSnapshot = { id: string; title: string; url: string; status: 'ready' | 'failed'; checkedAt: string; latencyMs: number; hash?: string; excerpt?: string; httpStatus?: number; error?: string }

export async function collectOfficialSources(): Promise<SourceSnapshot[]> {
  return Promise.all(officialSources.map(async source => {
    const started = Date.now()
    try {
      const response = await fetch(source.url, { signal: AbortSignal.timeout(7000), headers: { 'user-agent': 'PROF-SME-Boost/1.0 source-indexer' }, cache: 'no-store' })
      const body = (await response.text()).replace(/\s+/g, ' ').slice(0, 5000)
      return { ...source, status: response.ok ? 'ready' : 'failed', httpStatus: response.status, checkedAt: new Date().toISOString(), latencyMs: Date.now() - started, hash: createHash('sha256').update(body).digest('hex'), excerpt: body }
    } catch (error) { return { ...source, status: 'failed', checkedAt: new Date().toISOString(), latencyMs: Date.now() - started, error: error instanceof Error ? error.message : 'Unknown source error' } }
  }))
}

export function validateInn(value: string) {
  if (!/^\d{10}$|^\d{12}$/.test(value)) return { valid: false, reason: 'ИНН должен содержать 10 или 12 цифр' }
  const digits = value.split('').map(Number)
  const check = (weights: number[]) => weights.reduce((sum, weight, index) => sum + digits[index] * weight, 0) % 11 % 10
  const valid = digits.length === 10 ? check([2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[9] : check([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[10] && check([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === digits[11]
  return { valid, reason: valid ? undefined : 'Контрольная сумма ИНН не прошла проверку' }
}

export function buildIndexContext(sources: Awaited<ReturnType<typeof collectOfficialSources>>) { return sources.filter(source => source.status === 'ready').map(source => `[${source.title}] ${source.url}\n${source.excerpt}`).join('\n\n') }
