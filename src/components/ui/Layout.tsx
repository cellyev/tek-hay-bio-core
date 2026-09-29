/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

export function Container({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl ${className}`}>
      {children}
    </div>
  )
}

export function Section({ 
  children, 
  className = '',
  id
}: { 
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`py-12 md:py-16 lg:py-24 ${className}`}>
      {children}
    </section>
  )
}
