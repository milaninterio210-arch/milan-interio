import type { Metadata } from "next";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${title} Portfolio`,
    description: `Detailed case study of the ${title} interior design project by MILAN INTERIO.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  // Temporary local mock verification (until Phase 7 integrations are complete)
  // In real case, if project is not published or doesn't exist, we call notFound()
  const projectExists = false;

  if (!projectExists) {
    // Elegant fallback during design development
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <p className="text-eyebrow mb-4">Case Study</p>
          <h1 className="heading-display text-2xl sm:text-3xl text-milan-ivory mb-4">
            PROJECT NOT FOUND
          </h1>
          <p className="text-body mb-8 text-milan-muted">
            The requested portfolio project is currently in draft mode or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6">
      <article className="max-w-5xl mx-auto">
        <header className="mb-12">
          <p className="text-eyebrow mb-4">Project detail</p>
          <h1 className="heading-display text-4xl sm:text-5xl text-milan-ivory">
            {slug.replace(/-/g, " ").toUpperCase()}
          </h1>
        </header>
      </article>
    </div>
  );
}
