import React from 'react'
import { getGlobal } from './queries'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container, Section } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { notFound } from 'next/navigation'

export async function ContactPage({ locale }: { locale: 'id' | 'en' }) {
  const contactInfo = await getGlobal('contact-information', locale)
  
  if (!contactInfo) {
    notFound()
  }

  const socialMedia = Array.isArray(contactInfo.socialMedia) ? contactInfo.socialMedia : []

  return (
    <>
      <PageHeader 
        title={locale === 'id' ? 'Kontak & Lokasi' : 'Contact & Location'}
        description={locale === 'id' ? 'Hubungi kami atau rencanakan kunjungan Anda ke Klenteng Tek Hay Bio.' : 'Get in touch or plan your visit to Tek Hay Bio Temple.'}
      />
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    {locale === 'id' ? 'Alamat' : 'Address'}
                  </h2>
                  <div className="w-12 h-1 bg-primary" />
                </div>
                <p className="text-lg text-stone-600 whitespace-pre-line leading-relaxed">
                  {contactInfo.address as string || 'Jl. Gang Pinggir No. 105-107, Kranggan, Semarang Tengah, Kota Semarang, Jawa Tengah 50137'}
                </p>
                {Boolean(contactInfo.googleMapsUrl) && (
                  <Button href={contactInfo.googleMapsUrl as string} variant="outline">
                    {locale === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps'}
                  </Button>
                )}
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    {locale === 'id' ? 'Jam Operasional' : 'Visiting Hours'}
                  </h2>
                  <div className="w-12 h-1 bg-primary" />
                </div>
                <p className="text-lg text-stone-600 whitespace-pre-line leading-relaxed">
                  {contactInfo.visitingHours as string || 'Setiap Hari\n06.00 - 18.00 WIB'}
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    {locale === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                  </h2>
                  <div className="w-12 h-1 bg-primary" />
                </div>
                <div className="space-y-4">
                  {Boolean(contactInfo.phone) && (
                    <p className="text-lg text-stone-600 flex items-center gap-3">
                      <span className="font-bold w-16">Telepon</span>
                      <a href={`tel:${contactInfo.phone as string}`} className="hover:text-primary transition-colors">{contactInfo.phone as string}</a>
                    </p>
                  )}
                  {Boolean(contactInfo.email) && (
                    <p className="text-lg text-stone-600 flex items-center gap-3">
                      <span className="font-bold w-16">Email</span>
                      <a href={`mailto:${contactInfo.email as string}`} className="hover:text-primary transition-colors">{contactInfo.email as string}</a>
                    </p>
                  )}
                  {socialMedia.map((social: Record<string, unknown>, idx: number) => (
                    <p key={idx} className="text-lg text-stone-600 flex items-center gap-3">
                      <span className="font-bold w-16 capitalize">{social.platform as string}</span>
                      <a href={social.url as string} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-primary">
                        {social.label as string}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 min-h-[400px] relative">
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-stone-500 bg-[url('/file.svg')] bg-center bg-no-repeat bg-[length:100px_100px] opacity-10">
                <span className="sr-only">Map Graphic</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-stone-200 text-center max-w-xs">
                   <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">Peta Lokasi</h3>
                   <p className="text-stone-600 text-sm mb-4">Integrasi Google Maps Embed dapat diletakkan di sini.</p>
                   {Boolean(contactInfo.googleMapsUrl) && (
                     <Button href={contactInfo.googleMapsUrl as string} variant="primary" className="w-full">
                       Navigasi
                     </Button>
                   )}
                 </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </>
  )
}
