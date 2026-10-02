import React from 'react'
import { getBySlug } from './queries'
import { Container, Section } from '@/components/ui/Layout'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import type { CMSRecord } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function NewsDetailPage({ locale, slug }: { locale: 'id' | 'en', slug: string }) {
  const post = await getBySlug('posts', slug, locale)
  
  if (!post) {
    notFound()
  }

  const dateStr = post.publishedAt 
    ? new Date(post.publishedAt as string).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <article>
      <Section className="bg-white pb-0">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6 pt-8">
            <Link href={`/${locale}/${locale === 'id' ? 'berita' : 'news'}`} className="text-stone-500 hover:text-stone-900 text-sm">
              ← {locale === 'id' ? 'Kembali ke Berita' : 'Back to News'}
            </Link>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-stone-500">{dateStr}</span>
                {Boolean(post.category) && (
                  <span className="px-2 py-1 bg-stone-100 text-stone-700 font-medium rounded-full">
                    {typeof post.category === 'string' ? post.category : ((post.category as any)?.title?.id || (post.category as any)?.title?.en || (post.category as any)?.title || '')}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
                {post.title as string}
              </h1>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {Boolean(post.featuredImage) && (
              <div className="w-full aspect-video relative rounded-xl overflow-hidden shadow-sm mb-12 bg-stone-100 border border-stone-200">
                <MediaImage media={post.featuredImage as CMSRecord} fill className="object-cover" priority />
              </div>
            )}
            
            <div className="max-w-3xl mx-auto">
              {Boolean(post.excerpt) && (
                <p className="text-xl text-stone-600 leading-relaxed font-serif italic mb-8">
                  {post.excerpt as string}
                </p>
              )}
              
              <RichText content={post.content} />
            </div>
          </div>
        </Container>
      </Section>
    </article>
  )
}
