import React from 'react'
import { getCollection } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import type { CMSRecord } from '@/types'
import Link from 'next/link'

export async function NewsListPage({ locale }: { locale: 'id' | 'en' }) {
  const posts = await getCollection('posts', locale, { 
    where: { status: { equals: 'published' } },
    sort: '-publishedAt'
  })

  return (
    <>
      <PageHeader 
        title={locale === 'id' ? 'Berita & Informasi' : 'News & Information'}
        description={locale === 'id' ? 'Informasi terbaru seputar Klenteng Tek Hay Bio.' : 'Latest information about Tek Hay Bio Temple.'}
      />
      <Section className="bg-stone-50">
        <Container>
          {posts.length === 0 ? (
             <div className="py-12 text-center text-stone-500 italic bg-white rounded-lg border border-stone-100 shadow-sm">
               {locale === 'id' ? 'Belum ada berita.' : 'No news available.'}
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link href={`/${locale}/${locale === 'id' ? 'berita' : 'news'}/${post.slug}`} key={post.id as string} className="group space-y-4">
                  <div className="aspect-[3/2] relative bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                    <MediaImage media={post.featuredImage as CMSRecord} fill sizes="(max-width: 768px) 100vw, 33vw" className="transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-stone-500">
                      {post.publishedAt ? new Date(post.publishedAt as string).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                      {Boolean(post.category) && <span className="ml-2 px-2 py-1 bg-stone-200 rounded-full text-stone-700">{post.category as string}</span>}
                    </div>
                    <h2 className="font-bold text-xl text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title as string}
                    </h2>
                    <p className="text-stone-600 line-clamp-3 text-sm">{post.excerpt as string}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
