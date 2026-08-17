export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <h1 className="heading-display text-2xl text-milan-ivory">
          MANAGE PROJECTS
        </h1>
      </header>
      <div className="bg-milan-primary border border-milan-border p-6 text-center text-milan-muted text-sm">
        No projects recorded yet.
      </div>
    </div>
  );
}
