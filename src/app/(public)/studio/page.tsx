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

  // Fetch only published studio gallery items
  const { data: gallery } = await supabase
    .from("studio_gallery")
    .select("title, location, category, image_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-32 py-24 pb-32 px-6">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-eyebrow">ARCHIVE</p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory font-serif tracking-wide font-light">
          THE STUDIO
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto font-light">
          A physical visual narrative of textures, alignments, custom fixtures, and material junctions.
        </p>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto">
        {gallery && gallery.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {gallery.map((item, idx) => (
              <div
                key={idx}
                className="break-inside-avoid bg-milan-primary border border-milan-border p-4 space-y-3 group hover:border-milan-gold/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="overflow-hidden bg-milan-charcoal aspect-[3/4] relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="truncate">
                    <span className="text-milan-ivory block uppercase tracking-wider text-[10px]">
                      {item.title}
                    </span>
                    {item.location && (
                      <span className="text-milan-muted text-[9px] block">
                        {item.location}
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <span className="text-milan-gold text-[9px] tracking-widest uppercase border border-milan-gold/20 px-2 py-0.5">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="border border-milan-border bg-milan-charcoal/30 p-16 text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
            <p className="text-sm text-milan-muted font-light leading-relaxed">
              Our studio photography archive is currently being selected and curated.
            </p>
            <p className="text-xs text-milan-muted italic leading-relaxed">
              Visual coordinates of bespoke textures, materials, and installations will appear here soon.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-block border border-milan-gold bg-transparent text-milan-gold hover:bg-milan-gold hover:text-milan-primary px-8 py-4 text-xs tracking-widest font-semibold uppercase transition-all duration-300"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
