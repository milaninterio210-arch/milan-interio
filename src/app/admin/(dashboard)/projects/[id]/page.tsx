interface AdminEditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <header className="pb-6 border-b border-milan-border">
        <h1 className="heading-display text-2xl text-milan-ivory">
          EDIT PROJECT REFERENCE: {id.slice(0, 8).toUpperCase()}
        </h1>
      </header>
      <div className="bg-milan-primary border border-milan-border p-6">
        <p className="text-xs text-milan-muted italic">
          Project updating fields and gallery management tools will populate in Phase 12 & 13.
        </p>
      </div>
    </div>
  );
}
