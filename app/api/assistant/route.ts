import { gateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { buildIndexContext, collectOfficialSources } from '@/lib/open-sources'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const question = typeof body?.question === 'string' ? body.question.trim().slice(0, 1000) : ''
  if (!question) return NextResponse.json({ error: 'Введите вопрос' }, { status: 400 })
  const sources = await collectOfficialSources()
  const context = buildIndexContext(sources)
  const normalized = question.toLowerCase()
  const localAnswers = normalized.includes('пдн') || normalized.includes('персональ') ? 'Базовые шаги для оператора ПДн: определить цели и состав данных, правовое основание, сроки хранения и порядок отзыва согласия; назначить ответственного, описать меры защиты и проверить локализацию баз данных. Используйте официальные материалы Роскомнадзора и подтвердите итог у юриста.' : normalized.includes('инн') ? 'ИНН организации содержит 10 цифр, ИП или физического лица — 12 цифр. Система проверяет длину и контрольную сумму; при ошибке отчёт не должен считаться подтверждённым.' : normalized.includes('источник') || normalized.includes('парс') ? `Проверены официальные источники: ${sources.map(source => `${source.title} — ${source.status}`).join('; ')}. Недоступный источник не заменяется выдуманными данными.` : ''
  if (localAnswers) return NextResponse.json({ answer: `${localAnswers}\n\nИсточники и дата проверки: ${sources.map(source => `${source.title}: ${source.url} (${source.checkedAt})`).join('; ')}`, mode: 'local-grounded-fallback', sources })
  try {
    const result = await generateText({ model: gateway('openai/gpt-4o-mini'), system: `Ты — помощник PROF-SME Boost для МСП РФ. Отвечай только по контексту ниже. Не выдумывай нормы закона, реквизиты или данные компании. Для юридических выводов указывай, что нужна проверка юристом. В конце добавляй источники с URL и датой проверки. Если контекст пустой — честно скажи, что источники недоступны.\n\nКОНТЕКСТ:\n${context}`, prompt: question })
    return NextResponse.json({ answer: result.text, sources: sources.map(source => ({ title: source.title, url: source.url, status: source.status, checkedAt: source.checkedAt })) })
  } catch { return NextResponse.json({ answer: `AI Gateway временно недоступен. Ниже доступен проверенный индекс источников: ${sources.filter(source => source.status === 'ready').map(source => `${source.title} — ${source.url}`).join('; ') || 'официальные источники сейчас недоступны'}. Для юридически значимого ответа проверьте первоисточник и дату публикации.`, mode: 'source-index-fallback', sources: sources.map(source => ({ title: source.title, url: source.url, status: source.status, checkedAt: source.checkedAt })) }) }
}
