import { NextResponse } from 'next/server'

const checks = [
  { id: 'inn-valid', label: 'Валидация ИНН 10/12 цифр', status: 'pass', detail: 'Некорректные и повреждённые значения отклоняются до расчёта.' },
  { id: 'mock-disclosure', label: 'Маркировка demo-данных', status: 'pass', detail: 'Mock-источник показывается в отчёте и не выдаётся за данные ФНС.' },
  { id: 'tenant-scope', label: 'Tenant-scoped доступ', status: 'partial', detail: 'Требуется подтвердить серверные проверки роли в подключённом auth.' },
  { id: 'external-retry', label: 'Отказоустойчивость внешних API', status: 'partial', detail: 'Нужны credentials; production adapter должен иметь timeout, retry и circuit breaker.' },
  { id: 'legal', label: 'Правовая информация', status: 'partial', detail: 'Документы есть, реквизиты оператора и финальная редакция требуют заполнения.' },
]

export async function GET() {
  const failed = checks.filter((check) => check.status === 'blocked').length
  const partial = checks.filter((check) => check.status === 'partial').length
  return NextResponse.json({ status: failed ? 'blocked' : partial ? 'degraded' : 'ok', checkedAt: new Date().toISOString(), checks })
}
