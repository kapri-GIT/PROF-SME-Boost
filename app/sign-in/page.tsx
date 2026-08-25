'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); const result = await authClient.signIn.email({ email, password }); if (result.error) setError('Не удалось выполнить вход. Проверьте данные.'); else window.location.href = '/' }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand"><div className="brand-mark">P</div><div><b>PROF<span>•</span>SME</b><small>BOOST PLATFORM</small></div></div><p className="eyebrow">ЗАЩИЩЁННЫЙ ДОСТУП</p><h1>Вход в кабинет</h1><p className="muted">Управляйте прогнозами, платежами и арендаторами.</p><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Пароль<input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" type="submit">Войти</button><button className="secondary-button" type="button" onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/' })}>Продолжить через Google</button><p className="auth-note">OAuth-провайдеры активируются после добавления credentials.</p></form></main>
}
