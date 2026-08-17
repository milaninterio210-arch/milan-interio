/* =========================================================================
   MILAN INTERIO — Type Definitions
   ========================================================================= */

// -------------------------------------------------------------------------
// Database Models
// -------------------------------------------------------------------------

export interface SiteSettings {
  id: string;
  brand_name: string;
  primary_tagline: string;
  supporting_tagline: string;
  design_philosophy: string;
  design_philosophy_explanation: string;
  contact_email: string | null;
  contact_phone: string | null;
  office_address: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  introduction: string | null;
  vision: string;
  mission: string;
  design_philosophy: string;
  why_milan: string | null;
  quality_commitment: string;
  our_promise: string;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  id: string;
  eyebrow: string | null;
  heading: string;
  subheading: string | null;
  background_image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Pillar {
  id: string;
  pillar_number: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  display_order: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  service_id: string;
  title: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Hospitality" | "Office" | "Retail";
  location: string | null;
  description: string;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  caption: string | null;
  created_at: string;
}

export interface Material {
  id: string;
  category: "Marble" | "Wood" | "Brass" | "Stone" | "Textiles" | "Glass";
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface StudioGalleryItem {
  id: string;
  title: string;
  location: string | null;
  category: "Residential" | "Commercial" | "Hospitality" | "Office" | "Retail" | null;
  image_url: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  message: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------------------------
// Component Props
// -------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
}

export const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "PROJECTS", href: "/projects" },
  { label: "PROCESS", href: "/process" },
  { label: "STUDIO", href: "/studio" },
  { label: "CONTACT", href: "/contact" },
];
