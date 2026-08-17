import type { Metadata } from "next";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: title,
    description: `Learn about MILAN INTERIO's ${title} service — premium interior design and fit-out solutions.`,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      {/* Phase 6: Service detail with items, description, and imagery */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-eyebrow mb-6">Services</p>
          <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory mb-8">
            {slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </h1>
        </div>
      </section>
    </div>
  );
}
