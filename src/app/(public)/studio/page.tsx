import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio Archive",
  description:
    "Explore the MILAN INTERIO studio archive — a curated photography collection of luxury, architectural interior design elements.",
};

export default async function StudioPage() {
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("studio_gallery")
    .select("title, location, category, image_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <div className="py-20 sm:py-24">
      {/* Header */}
      <section className="px-6 text-center space-y-5 mb-16 sm:mb-24 animate-fade-up">
        <p className="text-eyebrow">ARCHIVE</p>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory max-w-3xl mx-auto">
          THE STUDIO
        </h1>
        <p className="text-body max-w-xl mx-auto text-sm sm:text-base">
          A visual narrative of textures, alignments, custom fixtures, and material junctions.
        </p>
      </section>

      {/* Gallery or Empty State */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          {gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="group border border-milan-border hover:border-milan-gold/20 transition-colors duration-300 overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-milan-charcoal overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] text-milan-ivory block truncate tracking-wide">
                        {item.title}
                      </span>
                      {item.location && (
                        <span className="text-[10px] text-milan-muted block truncate">
                          {item.location}
                        </span>
                      )}
                    </div>
                    {item.category && (
                      <span className="text-milan-gold text-[9px] tracking-widest uppercase border border-milan-gold/20 px-2 py-0.5 shrink-0">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-lg mx-auto text-center py-12 sm:py-16 space-y-5">
              <p className="text-sm text-milan-muted font-light leading-relaxed">
                Our studio photography archive is currently being curated.
              </p>
              <p className="text-xs text-milan-muted leading-relaxed">
                Visual coordinates of bespoke textures, materials, and installations will appear here.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary px-6 py-3 text-[10px] tracking-widest font-semibold uppercase transition-colors"
              >
                Request Consultation
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
