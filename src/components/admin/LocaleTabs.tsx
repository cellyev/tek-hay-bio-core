import React from 'react'

interface LocaleTabsProps {
  activeTab: 'id' | 'en'
  onTabChange: (tab: 'id' | 'en') => void
}

export function LocaleTabs({ activeTab, onTabChange }: LocaleTabsProps) {
  return (
    <div className="flex border-b border-slate-200 mb-6">
      <button
        type="button"
        onClick={() => onTabChange('id')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          activeTab === 'id'
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        Indonesia (ID)
      </button>
      <button
        type="button"
        onClick={() => onTabChange('en')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          activeTab === 'en'
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        English (EN)
      </button>
    </div>
  )
}
