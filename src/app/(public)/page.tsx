export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Phase 5: Hero, Milan Standard, Featured Project, Services, Process, Materials, Studio Preview, CTA */}
      <section className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-eyebrow mb-6">
            Interior Design | Fit-Out | Custom Joinery | Furniture
          </p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-milan-ivory mb-6">
            LUXURY, DESIGNED
            <br />
            AROUND YOU.
          </h1>
          <p className="text-body-lg max-w-xl mx-auto">
            Elevating Spaces. Defining Luxury.
          </p>
        </div>
      </section>
    </div>
  );
}
