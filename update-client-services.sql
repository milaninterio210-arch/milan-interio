-- =========================================================================
-- MILAN INTERIO — SERVICES & SCOPE UPDATE
-- 3 Core Pillars: INTERIOR, EXTERIOR, LANDSCAPE DESIGN & DEVELOPMENT
-- =========================================================================

-- Clear existing services and cascade to service_items
DELETE FROM public.service_items;
DELETE FROM public.services;

-- 1. Insert Services
INSERT INTO public.services (slug, title, description, display_order, image_url) VALUES
(
    'interior-design-space-planning',
    'Interior Design & Space Planning',
    'Milan Interio provides comprehensive interior design and space planning services focused on creating elegant, functional, and well-balanced environments. Our approach combines creative design, practical space utilization, premium materials, and attention to detail to develop interiors that reflect the client''s vision, lifestyle, and functional requirements. Our services include concept development, space planning, furniture layout, mood boards, material and finish selection, lighting concepts, colour coordination, detailed interior design, and 3D visualization. We coordinate design elements to ensure a seamless transition from concept to execution while maintaining quality, aesthetics, functionality, and budget considerations.',
    1,
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
),
(
    'residential-interiors',
    'Residential Interiors',
    'Milan Interio delivers bespoke residential interior solutions designed to create sophisticated, comfortable, and highly functional living spaces. We transform villas, apartments, and homes through a carefully coordinated approach that combines contemporary design, premium materials, personalized detailing, and practical space utilization. Our residential services include complete interior design, space planning, living and dining areas, bedrooms, kitchens, bathrooms, wardrobes, feature walls, custom furniture, lighting, flooring, ceiling treatments, and decorative finishes. From initial concept and 3D visualization to material selection and final execution, we provide an integrated design and fit-out solution tailored to each client''s lifestyle, preferences, and budget.',
    2,
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
),
(
    'commercial-office-interiors',
    'Commercial & Office Interiors',
    'Milan Interio provides innovative and professional interior design solutions for commercial and corporate environments, creating spaces that combine functionality, efficiency, brand identity, and contemporary aesthetics. We develop tailored interiors that support productivity, enhance customer experience, and create a strong professional impression. Our services include space planning, office layouts, reception areas, meeting and conference rooms, executive offices, workstations, retail spaces, showrooms, restaurants, cafés, and hospitality environments. From concept design and 3D visualization to material selection, detailed design, and complete fit-out execution, we deliver coordinated solutions that meet project requirements, quality standards, timelines, and budget expectations.',
    3,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
),
(
    'interior-fit-out',
    'Interior Fit-Out',
    'Milan Interio provides complete interior fit-out solutions, transforming design concepts into fully finished, functional, and visually refined spaces. Our turnkey approach integrates quality workmanship, premium materials, technical coordination, and detailed execution to achieve a seamless finish from start to completion. Our fit-out services include gypsum and false ceilings, partitions, flooring, wall finishes, painting, decorative finishes, glass and aluminium works, doors, joinery, carpentry, custom furniture, electrical and MEP works, lighting, and final finishing. We manage the complete execution process with careful attention to quality, coordination, safety, timelines, and project requirements.',
    4,
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
),
(
    'custom-furniture-joinery',
    'Custom Furniture & Joinery',
    'Milan Interio specializes in bespoke furniture and joinery solutions designed to complement the architectural character and interior aesthetics of each space. We combine refined design, quality materials, skilled craftsmanship, and functional detailing to create furniture that is both visually distinctive and built for long-term performance. Our services include custom wardrobes, walk-in closets, modular kitchens, TV units, feature walls, vanity units, reception counters, office furniture, storage solutions, doors, wall panelling, and other bespoke joinery works. From design development and material selection to fabrication, installation, and final finishing, we deliver carefully crafted solutions tailored to the client''s requirements, space, style, and budget.',
    5,
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80'
),
(
    'renovation-remodelling',
    'Renovation & Remodelling',
    'Milan Interio provides comprehensive renovation and remodelling solutions to transform existing spaces into modern, functional, and aesthetically refined environments. We carefully assess the existing condition of each space and develop practical design solutions that enhance functionality, appearance, comfort, and overall property value. Our services include residential and commercial renovations, kitchen and bathroom remodelling, space reconfiguration, flooring and ceiling upgrades, wall finishes, painting, lighting improvements, joinery and furniture replacement, electrical and MEP modifications, and complete interior refurbishment. From initial assessment and design development through execution and final handover, we ensure professional coordination, quality workmanship, attention to detail, and minimal disruption to the client.',
    6,
    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80'
),
(
    'project-management',
    'Project Management',
    'Milan Interio provides professional project management services to ensure the smooth, coordinated, and successful delivery of interior design and fit-out projects. We manage each stage of the project with a strong focus on quality, schedule, cost control, coordination, and client satisfaction. Our services include project planning and scheduling, design and technical coordination, material procurement, contractor and subcontractor coordination, site supervision, quality control, progress monitoring, documentation, safety coordination, snagging, and final handover. We maintain close coordination between clients, designers, consultants, suppliers, and site teams to ensure the project is delivered efficiently and in accordance with the approved design, specifications, budget, and timeline.',
    7,
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
),
(
    'exterior-design-development',
    'Exterior Design & Development',
    'Milan Interio provides comprehensive exterior design solutions that enhance the architectural character, functionality, and overall visual appeal of residential and commercial properties. We create distinctive exterior environments through thoughtful design, premium finishes, coordinated materials, and attention to architectural detailing. Our services include façade design, entrance and elevation design, outdoor living areas, landscaping concepts, boundary walls and gates, terraces, balconies, pergolas, car parking areas, outdoor lighting, paving, and decorative exterior elements. From concept development and 3D visualization to material selection and execution coordination, we deliver cohesive exterior solutions that complement the architecture and reflect the client''s vision.',
    8,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
),
(
    'landscape-design-development',
    'Landscape Design & Development',
    'Milan Interio transforms outdoor areas into carefully planned and visually engaging environments. Our landscape solutions integrate architecture, greenery, hardscape elements, outdoor furniture, lighting, and functional circulation to create comfortable and inviting outdoor spaces. We carefully balance greenery, materials, textures, lighting, circulation, and outdoor functionality to create landscapes that complement the surrounding architecture for residential villas and commercial spaces.',
    9,
    'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80'
);

-- 2. Insert Service Items
WITH service_ids AS (SELECT id, slug FROM public.services)
INSERT INTO public.service_items (service_id, title, display_order) VALUES
-- 1. Interior Design & Space Planning
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Concept Design & Mood Boards', 1),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Space Planning & Layouts', 2),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), '3D Visualization & Photorealistic Rendering', 3),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Material & Finish Selection', 4),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Lighting & Furniture Planning', 5),

-- 2. Residential Interiors
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Luxury Villas', 1),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Apartments & Penthouse Interiors', 2),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Living & Dining Areas', 3),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Bedrooms & Dressing Rooms', 4),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Kitchens & Bathrooms', 5),

-- 3. Commercial & Office Interiors
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Corporate Offices', 1),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Retail & Showrooms', 2),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Restaurants & Cafés', 3),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Hospitality & Reception Areas', 4),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Meeting & Conference Rooms', 5),

-- 4. Interior Fit-Out
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Complete Turnkey Fit-Out', 1),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Gypsum & False Ceilings', 2),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Flooring & Wall Finishes', 3),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Painting & Decorative Finishes', 4),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Glass & Aluminium Works', 5),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Joinery & Carpentry', 6),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Electrical & MEP Works', 7),

-- 5. Custom Furniture & Joinery
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Bespoke Furniture', 1),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Modular Kitchens', 2),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Wardrobes & Walk-in Closets', 3),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'TV Units & Feature Walls', 4),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Reception & Office Furniture', 5),

-- 6. Renovation & Remodelling
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Villa Renovation', 1),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Office Renovation', 2),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Kitchen & Bathroom Remodelling', 3),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Space Upgrades', 4),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Existing Interior Modification', 5),

-- 7. Project Management
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Design Coordination', 1),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Material Procurement', 2),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Site Supervision', 3),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Contractor Coordination', 4),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Quality Control', 5),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Handover & Final Inspection', 6),

-- 8. Exterior Design & Development
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Architectural Elevation Concepts', 1),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Façade Design & Development', 2),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Entrance & Main Gate Design', 3),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Boundary Wall & Gate Design', 4),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Outdoor Living Areas', 5),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Terrace & Balcony Design', 6),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Pergolas & Canopies', 7),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Outdoor Kitchens & Seating Areas', 8),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Swimming Pool Surroundings', 9),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Paving & External Flooring', 10),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Driveways & Parking Areas', 11),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Outdoor Lighting Concepts', 12),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Decorative Architectural Features', 13),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'External Cladding & Finishes', 14),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Material & Colour Coordination', 15),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Exterior Renovation & Upgrading', 16),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), '3D Exterior Visualization', 17),

-- 9. Landscape Design & Development
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Landscape Concept Design', 1),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Garden & Green Area Planning', 2),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Softscape & Planting Design', 3),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Hardscape Design', 4),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Pathways & Walkways', 5),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Outdoor Seating Areas', 6),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Garden Features', 7),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Water Features & Fountains', 8),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Swimming Pool Landscape', 9),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Pergolas & Shaded Areas', 10),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Outdoor Kitchens & Entertainment Areas', 11),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Decorative Paving', 12),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Planters & Green Walls', 13),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Outdoor Lighting', 14),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Irrigation Coordination', 15),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Residential Villa Landscaping', 16),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Commercial & Hospitality Landscaping', 17),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Landscape Renovation & Upgrading', 18);
