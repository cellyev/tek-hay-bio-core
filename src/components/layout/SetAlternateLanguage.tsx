'use client'

import { useEffect } from 'react'
import { useLanguageSwitcher } from './LanguageSwitcherContext'

export function SetAlternateLanguage({ path }: { path: string | null | undefined }) {
  const { setAlternatePath } = useLanguageSwitcher()

  useEffect(() => {
    if (path) {
      setAlternatePath(path)
    }
    return () => {
      setAlternatePath(null)
    }
  }, [path, setAlternatePath])

  return null
}
