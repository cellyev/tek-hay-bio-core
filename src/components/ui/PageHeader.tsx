import React from 'react'
import { Container } from './Layout'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumb?: React.ReactNode
}

export function PageHeader({ title, description, breadcrumb }: PageHeaderProps) {
  return (
    <div className="bg-stone-50 border-b border-stone-200 py-12 md:py-16">
      <Container>
        <div className="max-w-3xl space-y-4">
          {breadcrumb && <div className="mb-4 text-sm text-stone-500">{breadcrumb}</div>}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </Container>
    </div>
  )
}
