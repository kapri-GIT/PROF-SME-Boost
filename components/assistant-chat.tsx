'use client'

import { useState } from 'react'

export function AssistantChat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const ask = async () => { if (!question.trim()) return; setLoading(true); setAnswer(''); try { const response = await fetch('/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question }) }); const data = await response.json(); setAnswer(data.answer ?? data.error ?? 'Ответ не получен') } catch { setAnswer('Не удалось связаться с помощником. Повторите запрос позже.') } finally { setLoading(false) } }
  return <div className="assistant-chat"><div className="assistant-title"><strong>AI-помощник по источникам РФ</strong><small>ФНС, НПА, Роскомнадзор и ЦБ РФ</small></div><textarea value={question} onChange={event => setQuestion(event.target.value)} placeholder="Например: какие документы нужны оператору ПДн?" maxLength={1000} /><button className="primary-button" onClick={ask} disabled={loading}>{loading ? 'Проверяю источники...' : 'Задать вопрос'}</button>{answer && <div className="assistant-answer">{answer}</div>}</div>
}
