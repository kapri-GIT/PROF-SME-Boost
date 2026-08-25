'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = document.cookie.match(/(?:^|; )theme=(dark|light)/)?.[1]
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', isDark)
    setDark(isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    document.cookie = `theme=${next ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
    setDark(next)
  }

  return <button className="theme-toggle" onClick={toggle} aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'} title={dark ? 'Светлая тема' : 'Тёмная тема'}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
}
