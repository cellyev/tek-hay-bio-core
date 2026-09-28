import React from 'react'
import { getGlobal } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { RichText } from '@/components/ui/RichText'
import { notFound } from 'next/navigation'

export async function AboutPage({ locale }: { locale: 'id' | 'en' }) {
  const history = await getGlobal('history', locale)
  
  if (!history) {
    notFound()
  }

  return (
    <>
      <PageHeader 
        title={history.title as string || (locale === 'id' ? 'Tentang Kami' : 'About Us')}
        description={history.shortDescription as string}
      />
      <Section className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <RichText content={history.content} />
          </div>
        </Container>
      </Section>
    </>
  )
}
