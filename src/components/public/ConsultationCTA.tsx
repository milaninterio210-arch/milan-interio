import Link from "next/link";

interface ConsultationCTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export default function ConsultationCTA({
  eyebrow = "CONSULTATION",
  title = "Require custom joinery or custom layouts?",
  description = "Discuss your design and project parameters with our interior design team.",
  buttonText = "Start A Project",
  buttonHref = "/contact",
  className = "",
}: ConsultationCTAProps) {
  return (
    <section className={`px-4 ${className}`}>
      <div className="max-w-4xl mx-auto px-2 py-10 sm:p-16 text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" />
        <span className="text-eyebrow relative z-10">{eyebrow}</span>
        <h2 className="heading-editorial text-xl sm:text-2xl text-milan-ivory max-w-md mx-auto leading-snug relative z-10">
          {title}
        </h2>
        <p className="text-body max-w-md mx-auto text-sm relative z-10">
          {description}
        </p>
        <div className="pt-2 relative z-10">
          <Link
            href={buttonHref}
            className="inline-block border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-8 py-3.5 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
