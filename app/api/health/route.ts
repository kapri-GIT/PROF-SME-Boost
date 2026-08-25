import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'degraded',
    checkedAt: new Date().toISOString(),
    integrations: {
      database: 'connected',
      auth: 'configured',
      googleDrive: 'not_configured',
      email: 'not_configured',
      telegram: 'not_configured',
      max: 'not_configured',
      oneC: 'not_configured',
      crm: 'not_configured',
      sbp: 'not_configured',
    },
    message: 'Внешние подключения работают в демо-режиме до добавления credentials.',
  })
}
