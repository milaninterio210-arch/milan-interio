export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="pb-6 border-b border-milan-border">
        <h1 className="heading-display text-2xl text-milan-ivory">
          DASHBOARD OVERVIEW
        </h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2">
            PENDING INQUIRIES
          </h2>
          <p className="text-3xl font-light text-milan-ivory">-</p>
        </div>
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2">
            PORTFOLIO PROJECTS
          </h2>
          <p className="text-3xl font-light text-milan-ivory">-</p>
        </div>
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2">
            STUDIO IMAGES
          </h2>
          <p className="text-3xl font-light text-milan-ivory">-</p>
        </div>
      </div>
    </div>
  );
}
