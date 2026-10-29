// ============================================================
// AASA CP HOLDING COMPANY — Verified Corporate Data
// Source: aasa.ae (live extraction, October 2026)
// ============================================================

export const COMPANY = {
  name: 'AASA CP HOLDING COMPANY',
  shortName: 'aasa Group',
  tagline: 'A Trusted Partner in Infrastructure',
  heroHeadline: 'THE VERY BACKBONE OF REGIONAL DEVELOPMENT',
  heroSubline: 'A multinational business headquartered in Dubai, with a proud legacy of excellence spanning more than three decades.',
  mission: "Our mission is to be a trusted partner in infrastructure; providing innovative, high-quality products and services to our stakeholders while prioritizing safety, sustainability, and the communities we serve. We'll achieve this through a value engineering approach, deployment of technology, and a steadfast focus on excellence in all aspects of our delivery.",
  founded: '1990s',
  heritage: '30+',
  hq: {
    address: '20th Floor, Aspect Tower, Executive Towers Cluster',
    area: 'Business Bay',
    city: 'Dubai',
    country: 'UAE',
    lat: 25.1867,
    lng: 55.2644,
    full: '20th Floor - Aspect Tower - Executive Towers Cluster Business Bay, Dubai - UAE',
  },
  contact: {
    tel: '+971 42420333',
    telHref: 'tel:+97142420333',
    fax: '+971 65235551',
    email: 'info@aasa.ae',
    emailHref: 'mailto:info@aasa.ae',
  },
  copyright: '© 2026 AASA CP HOLDING COMPANY. All rights reserved.',
  regions: ['UAE', 'KSA', 'Qatar', 'India'],
};

export const STATS = [
  { value: '30+', label: 'Years of Excellence', sublabel: 'Legacy Since 1990s' },
  { value: '150+', label: 'Megaprojects Delivered', sublabel: 'Across GCC & India' },
  { value: '8', label: 'Business Divisions', sublabel: 'Fully Integrated Group' },
  { value: '25K+', label: 'Workforce Strength', sublabel: 'Skilled Professionals' },
];

export const BUSINESS_UNITS = [
  {
    id: 'staffing',
    slug: 'aasa-staffing',
    name: 'aasa STAFFING',
    tagline: 'Empowering Your Workforce',
    description: 'Strategic workforce empowerment and technical deployment. AASA Staffing connects skilled professionals with the GCC\'s most demanding infrastructure projects, ensuring the right talent is available at every stage of delivery.',
    href: 'https://aasa.ae/aasa-staffing/',
    color: '#38bdf8',
    accentColor: '#06b6d4',
    index: '01',
    geometry: 'constellation', // crystalline decentralized nodes
    sector: 'Human Capital',
  },
  {
    id: 'power',
    slug: 'aasa-power',
    name: 'aasa POWER',
    tagline: 'Delivering Reliable, Innovative Energy Solutions',
    description: 'From high-voltage substation networks to distributed energy systems and clean-power integration, AASA Power engineers the electrical backbone of regional development — reliably, safely, and at scale.',
    href: 'https://aasa.ae/aasa-power/',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    index: '02',
    geometry: 'torus', // magnetic induction coil with plasma core
    sector: 'Energy & Power',
  },
  {
    id: 'infra',
    slug: 'aasa-infra',
    name: 'aasa INFRA',
    tagline: 'Building Tomorrow\'s Infrastructure',
    description: 'Civil engineering excellence spanning highways, utility pipelines, urban transit corridors, and smart city foundations. AASA Infra transforms conceptual blueprints into enduring structures that define regional landscapes.',
    href: 'https://aasa.ae/aasa-infra/',
    color: '#8b5cf6',
    accentColor: '#a855f7',
    index: '03',
    geometry: 'viaduct', // cable-stayed infrastructure module
    sector: 'Civil & Infrastructure',
  },
  {
    id: 'mobility',
    slug: 'aasa-mobility',
    name: 'aasa MOBILITY',
    tagline: 'Reliable Equipment, Seamless Operations',
    description: 'Specialized heavy logistics, high-capacity equipment management, and intelligent transport solutions. AASA Mobility keeps complex construction and industrial operations moving with precision and zero downtime.',
    href: 'https://aasa.ae/aasa-mobility/',
    color: '#06b6d4',
    accentColor: '#22d3ee',
    index: '04',
    geometry: 'capsule', // aerodynamic maglev transport pod
    sector: 'Logistics & Mobility',
  },
  {
    id: 'steel',
    slug: 'aasa-steel',
    name: 'aasa STEEL',
    tagline: 'Engineering & Fabrication Excellence',
    description: 'High-performance structural steel fabrication that strengthens UAE\'s landmark developments. AASA Steel delivers precision-engineered frameworks, mega-trusses, and bespoke structural assemblies for the region\'s most iconic megaprojects.',
    href: 'https://aasa.ae/aasa-steel/',
    color: '#94a3b8',
    accentColor: '#cbd5e1',
    index: '05',
    geometry: 'truss', // geodesic space frame & structural lattice
    sector: 'Steel & Fabrication',
  },
  {
    id: 'tech',
    slug: 'aasa-tech',
    name: 'aasa TECH',
    tagline: 'Innovative Technology, Seamless Integration',
    description: 'Smart building IoT, integrated automation systems, cybersecurity infrastructure, and digital twin technology. AASA Tech brings the future to present-day engineering — connecting physical assets to intelligent digital networks.',
    href: 'https://aasa.ae/aasa-tech/',
    color: '#38bdf8',
    accentColor: '#67e8f9',
    index: '06',
    geometry: 'datacube', // quantum neural data cube with fiber optics
    sector: 'Technology & Automation',
  },
  {
    id: 'fm',
    slug: 'aasa-fm',
    name: 'aasa FM',
    tagline: 'Optimizing Facilities, Elevating Performance',
    description: 'Total integrated facility management — from preventive maintenance and energy optimization to asset lifecycle management. AASA FM ensures that the region\'s most critical assets operate at peak performance, always.',
    href: 'https://aasa.ae/aasa-fm/',
    color: '#34d399',
    accentColor: '#6ee7b7',
    index: '07',
    geometry: 'building', // smart building envelope with diagnostic rings
    sector: 'Facility Management',
  },
  {
    id: 'access',
    slug: 'aasa-access',
    name: 'aasa ACCESS',
    tagline: 'Precision Access, Maximum Efficiency',
    description: 'Certified industrial scaffolding, high-altitude access platforms, and specialized safety systems for complex construction environments. AASA Access provides the critical infrastructure behind infrastructure — enabling safe, precise, and efficient work at any elevation.',
    href: 'https://aasa.ae/aasa-access/',
    color: '#fb923c',
    accentColor: '#fdba74',
    index: '08',
    geometry: 'scaffold', // multi-tier precision scaffolding rig
    sector: 'Access & Safety',
  },
];

export const PROJECTS = [
  {
    id: 'adnoc-abu-dhabi',
    title: 'Non-Fuel Facilities Project',
    client: 'ADNOC',
    location: 'Abu Dhabi, UAE',
    date: 'March 2022',
    category: 'Energy & Oil/Gas',
    href: 'https://aasa.ae/non-fuel-facilities-project-for-adnoc-in-abu-dhabi/',
    description: 'Critical downstream oil and gas infrastructure delivery for ADNOC across Abu Dhabi — a landmark project demonstrating AASA\'s capability in high-stakes energy sector construction and project management.',
    tags: ['Energy', 'Oil & Gas', 'Abu Dhabi', 'ADNOC'],
    featured: true,
    color: '#f59e0b',
  },
  {
    id: 'emirates-dwc',
    title: 'Site Office for Emirates New Engineering Facility',
    client: 'Emirates Airlines',
    location: 'Dubai World Central Airport, DWC',
    date: 'March 2022',
    category: 'Aviation & Megastructures',
    href: 'https://aasa.ae/',
    description: 'Comprehensive site office construction and management for the new Emirates Engineering Facility at Dubai World Central Airport — one of the most significant aviation infrastructure investments in UAE history.',
    tags: ['Aviation', 'Airport', 'Engineering Facility', 'DWC'],
    featured: true,
    color: '#8b5cf6',
  },
  {
    id: 'uae-steel-landmark',
    title: 'UAE Landmark Megaproject Structural Steel',
    client: 'Multiple UAE Developers',
    location: 'UAE (Dubai & Abu Dhabi)',
    date: 'December 2025',
    category: 'Infrastructure',
    href: 'https://aasa.ae/',
    description: 'AASA Steel delivering high-performance structural steel solutions that strengthen the UAE\'s most iconic landmark developments — precision-fabricated frameworks engineered for architectural ambition and structural permanence.',
    tags: ['Steel', 'Fabrication', 'Landmarks', 'UAE'],
    featured: true,
    color: '#94a3b8',
  },
  {
    id: 'gcc-telecom-grid',
    title: 'GCC Smart Grid & Telecom Network',
    client: 'Regional Authorities',
    location: 'GCC Region',
    date: 'Ongoing',
    category: 'Infrastructure',
    href: 'https://aasa.ae/',
    description: 'Regional smart power grid and telecom network infrastructure spanning the GCC — enabling the connected, data-driven future of the Arabian Gulf region through precision-engineered electrical and communications backbone systems.',
    tags: ['Telecom', 'Smart Grid', 'GCC', 'Infrastructure'],
    featured: false,
    color: '#38bdf8',
  },
];

export const LEADERSHIP_QUOTE = {
  text: 'Remember your roots and stay humble. Appreciate your work, and never forget the employees, colleagues, and family who have supported you through tough times. Maintain discipline in your actions and decisions, ensuring consistency and integrity. By embodying these principles, you will be guided to success in business.',
  attribution: 'AASA Group Leadership',
  role: 'Executive Leadership Philosophy',
};

export const SUSTAINABILITY = {
  headline: 'Sustainability is the driving force behind aasa Group\'s operations, woven into the very fabric of our corporate ethos.',
  body: 'Our organization is deeply committed to sustainability, taking actionable steps to reduce environmental impact, conserve resources, and promote eco-friendly practices.',
  pillars: [
    { label: 'Zero-Harm Safety Protocol', icon: 'shield', value: '0', unit: 'Fatality Target' },
    { label: 'Carbon Reduction Initiatives', icon: 'leaf', value: '40%', unit: 'Reduction Goal' },
    { label: 'Renewable Energy Integration', icon: 'zap', value: '1.2GW+', unit: 'Clean Capacity' },
    { label: 'ISO Certified Operations', icon: 'award', value: 'ISO 9001', unit: 'Certified' },
  ],
  href: 'https://aasa.ae/sustainability/',
};

export const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  {
    label: 'Business Units',
    href: '#business-units',
    children: BUSINESS_UNITS.map(u => ({ label: u.name, href: `#${u.id}` })),
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Sustainability', href: '#sustainability' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Careers', href: 'https://aasa.ae/careers/' },
  { label: 'Contact', href: '#contact' },
];

export const REGIONS = [
  { name: 'Dubai, UAE', subtitle: 'Global HQ', lat: 25.1867, lng: 55.2644, active: true, projects: 80 },
  { name: 'Abu Dhabi, UAE', subtitle: 'ADNOC Corridor', lat: 24.4539, lng: 54.3773, active: true, projects: 35 },
  { name: 'Riyadh, KSA', subtitle: 'Saudi Operations', lat: 24.6877, lng: 46.7219, active: true, projects: 20 },
  { name: 'Doha, Qatar', subtitle: 'Qatar Division', lat: 25.2854, lng: 51.5310, active: true, projects: 12 },
  { name: 'Mumbai, India', subtitle: 'India Office', lat: 19.0760, lng: 72.8777, active: true, projects: 8 },
];
