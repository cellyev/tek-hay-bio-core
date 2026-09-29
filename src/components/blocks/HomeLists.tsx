/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Container, Section } from '../ui/Layout'
import { MediaImage } from '../ui/MediaImage'
import Link from 'next/link'
import type { CMSRecord } from '@/types'

export function ServicesList({ services, locale }: { services: CMSRecord[], locale: 'id' | 'en' }) {
  if (!services || services.length === 0) return null
  
  return (
    <Section className="bg-stone-50">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              {locale === 'id' ? 'Layanan Kami' : 'Our Services'}
            </h2>
            <div className="w-16 h-1 bg-primary" />
          </div>
          <Link href={`/${locale}/layanan`} className="text-primary font-medium hover:underline hidden sm:block">
            {locale === 'id' ? 'Lihat Semua Layanan' : 'View All Services'} →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id as string} className="bg-white rounded-lg overflow-hidden border border-border shadow-sm group">
              <div className="aspect-[16/9] relative bg-stone-100 overflow-hidden">
                <MediaImage media={service.image as CMSRecord} fill sizes="(max-width: 768px) 100vw, 33vw" className="transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-xl text-stone-900">{service.title as string}</h3>
                <p className="text-stone-600 line-clamp-3">{service.shortDescription as string}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href={`/${locale}/layanan`} className="text-primary font-medium hover:underline">
            {locale === 'id' ? 'Lihat Semua Layanan' : 'View All Services'} →
          </Link>
        </div>
      </Container>
    </Section>
  )
}

export function ActivitiesList({ activities, locale }: { activities: CMSRecord[], locale: 'id' | 'en' }) {
  if (!activities || activities.length === 0) return null
  
  return (
    <Section className="bg-white border-t border-border">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              {locale === 'id' ? 'Kegiatan Mendatang' : 'Upcoming Activities'}
            </h2>
            <div className="w-16 h-1 bg-primary" />
          </div>
          <Link href={`/${locale}/kegiatan`} className="text-primary font-medium hover:underline hidden sm:block">
            {locale === 'id' ? 'Semua Kegiatan' : 'All Activities'} →
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <Link href={`/${locale}/kegiatan/${activity.slug}`} key={activity.id as string} className="group flex flex-col sm:flex-row lg:flex-col gap-6">
              <div className="w-full sm:w-2/5 lg:w-full aspect-[4/3] relative bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-border">
                <MediaImage media={activity.featuredImage as CMSRecord} fill sizes="(max-width: 1024px) 40vw, 33vw" className="transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold tracking-wider text-primary uppercase">
                  {activity.date ? new Date(activity.date as string).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </div>
                <h3 className="font-bold text-xl text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                  {activity.title as string}
                </h3>
                {Boolean(activity.location) && <div className="text-sm text-stone-500">📍 {activity.location as string}</div>}
                <p className="text-stone-600 line-clamp-2">{activity.shortDescription as string}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function NewsList({ posts, locale }: { posts: CMSRecord[], locale: 'id' | 'en' }) {
  if (!posts || posts.length === 0) return null
  
  return (
    <Section className="bg-stone-50 border-t border-border">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              {locale === 'id' ? 'Berita Terkini' : 'Latest News'}
            </h2>
            <div className="w-16 h-1 bg-primary" />
          </div>
          <Link href={`/${locale}/berita`} className="text-primary font-medium hover:underline hidden sm:block">
            {locale === 'id' ? 'Semua Berita' : 'All News'} →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/${locale}/berita/${post.slug}`} key={post.id as string} className="group space-y-4">
              <div className="aspect-[3/2] relative bg-stone-100 rounded-lg overflow-hidden border border-border">
                <MediaImage media={post.featuredImage as CMSRecord} fill sizes="(max-width: 768px) 100vw, 33vw" className="transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="space-y-2">
                <div className="text-xs text-stone-500">
                  {post.publishedAt ? new Date(post.publishedAt as string).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  {Boolean(post.category) && <span className="ml-2 px-2 py-1 bg-stone-200 rounded-full text-stone-700">{post.category as string}</span>}
                </div>
                <h3 className="font-bold text-xl text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title as string}
                </h3>
                <p className="text-stone-600 line-clamp-3">{post.excerpt as string}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
