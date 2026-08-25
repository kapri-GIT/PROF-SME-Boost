import { NextResponse } from 'next/server'

export async function GET() {
  const checks = [
    { id: 'dashboard', label: 'Дашборд и графики', status: 'pass' },
    { id: 'transactions', label: 'Фильтры транзакций', status: 'pass' },
    { id: 'csv', label: 'Экспорт CSV', status: 'pass' },
    { id: 'billing', label: 'PDF-счета', status: 'partial' },
    { id: 'tenant', label: 'Tenant isolation', status: 'partial' },
    { id: 'integrations', label: 'Внешние интеграции', status: 'blocked' },
  ]
  return NextResponse.json({
    status: checks.some((check) => check.status === 'blocked') ? 'partial' : 'pass',
    checks,
    generatedAt: new Date().toISOString(),
  })
}
