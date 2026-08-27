import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { getGalleryItems } from "@/app/admin/gallery/actions";
import { MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Gallery — GLASSKID",
  description: "Photos and moments from GLASSKID.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Moments"
        title="Photo"
        accent="Gallery."
        description="A collection of moments, sessions, and places — some from the studio, some from the road."
      />

      <section className="mx-auto max-w-6xl px-6 pb-28">
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            Gallery is empty for now. Check back soon.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="glass-card group overflow-hidden">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={!item.imagePublicId}
                  />
                  {item.featured && (
                    <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold leading-snug">{item.title}</h2>
                    <span className="shrink-0 rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  {(item.location || item.takenAt) && (
                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                      {item.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" /> {item.location}
                        </span>
                      )}
                      {item.takenAt && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3" /> {item.takenAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}