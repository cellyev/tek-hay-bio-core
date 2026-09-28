import React from "react";
import { getCollection } from "./queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container, Section } from "@/components/ui/Layout";
import { MediaImage } from "@/components/ui/MediaImage";

export async function GalleryPage({ locale }: { locale: "id" | "en" }) {
  // Fetch all media
  const mediaList = await getCollection("media", locale, {
    sort: "-updatedAt",
  });

  return (
    <>
      <PageHeader
        title={locale === "id" ? "Galeri Visual" : "Visual Gallery"}
        description={
          locale === "id"
            ? "Koleksi foto arsitektur, kegiatan, dan peninggalan sejarah."
            : "Photo collection of architecture, activities, and historical artifacts."
        }
      />
      <Section className="bg-stone-50">
        <Container>
          {mediaList.length === 0 ? (
            <div className="py-12 text-center text-stone-500 italic bg-white rounded-lg border border-stone-100 shadow-sm">
              {locale === "id"
                ? "Belum ada foto dalam galeri."
                : "No photos in the gallery yet."}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {mediaList.map((media) => (
                <div
                  key={media.id as string}
                  className="group relative aspect-square bg-stone-200 rounded-lg overflow-hidden border border-stone-200 shadow-sm"
                >
                  <MediaImage
                    media={media}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-white font-medium text-sm drop-shadow-md line-clamp-2">
                      {(media.title as string) ||
                        (media.alt as string) ||
                        "Tek Hay Bio"}
                    </span>
                    {Boolean(media.category) && (
                      <span className="text-stone-300 text-xs mt-1 uppercase tracking-wider">
                        {media.category as string}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
