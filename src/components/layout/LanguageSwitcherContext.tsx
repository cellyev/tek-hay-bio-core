'use client'

import React, { createContext, useContext, useState } from 'react'

interface LanguageSwitcherContextType {
  alternatePath: string | null
  setAlternatePath: (path: string | null) => void
}

const LanguageSwitcherContext = createContext<LanguageSwitcherContextType>({
  alternatePath: null,
  setAlternatePath: () => {},
})

export function LanguageSwitcherProvider({ children }: { children: React.ReactNode }) {
  const [alternatePath, setAlternatePath] = useState<string | null>(null)

  return (
    <LanguageSwitcherContext.Provider value={{ alternatePath, setAlternatePath }}>
      {children}
    </LanguageSwitcherContext.Provider>
  )
}

export function useLanguageSwitcher() {
  return useContext(LanguageSwitcherContext)
}
