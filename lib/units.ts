// ============================================================
// Business-unit page content, taken from each unit's page on aasa.ae (aasa.ae/aasa-<unit>/).
// Visual identity (colour, 3D centrepiece, index) comes from BUSINESS_UNITS in constants.ts.
// Left out on purpose: rows aasa.ae hides on every device, the POWER "Telecom Services" card and
// POWER head-count stats that appear on other units' pages as template leftovers.
// ============================================================

export type UnitService = { title: string; description: string; points?: string[] };
export type UnitStat = { value: string; label: string };
export type UnitSector = { name: string; detail?: string };

export type UnitContent = {
  slug: string;
  logo: string;
  banner: string;
  gallery: string[];
  tagline: string;
  heroText: string;
  intro: string[];
  servicesHeading: 'Core Services' | 'Our Expertise';
  services: UnitService[];
  closing: { title: string; text: string };
  stats: UnitStat[];
  sectors: UnitSector[];
  sectorsIntro?: string;
  clients: string[];
};

const U = 'https://aasa.ae/wp-content/uploads';

export const UNIT_CONTENT: Record<string, UnitContent> = {
  'aasa-staffing': {
    slug: 'aasa-staffing',
    logo: `${U}/2025/09/aasaSTAFFING@4x.png`,
    banner: `${U}/2025/12/aasa-STAFFING-banner.jpg`,
    gallery: [
      `${U}/2025/12/warehouse-workers-checking-inventory-large-distribution-warehouse-storage.jpg`,
      `${U}/2025/12/panorama-pudong-business-reflection-sky-office.jpg`,
    ],
    tagline: 'Unlocking Talent to Power Business Growth',
    heroText:
      'aasa STAFFING unlocks talent potential to drive business growth across industries. From Oil & Gas and IT to Healthcare, Retail, and Financial Services, we provide comprehensive workforce solutions that match the right talent with your unique organizational needs.',
    intro: [
      'With over 30 years of experience, we deliver scalable, efficient, and compliant staffing solutions – empowering your business to focus on growth while we manage recruitment, workforce administration, and employee support.',
    ],
    servicesHeading: 'Our Expertise',
    services: [
      {
        title: 'PEO Services',
        description:
          'Simplify HR complexity and scale your workforce with our Professional Employer Organization (PEO) solutions. We handle employee administration, visa sponsorship, payroll, and labor law compliance - giving you flexibility and reducing operational burden.',
      },
      {
        title: 'Temporary Staffing',
        description:
          'Access qualified personnel on demand to meet project needs, seasonal peaks, or workforce gaps. Our solutions provide agility, cost-efficiency, and rapid deployment for short-term or specialized roles.',
      },
      {
        title: 'Managed Services',
        description:
          'Streamline non-core functions with expert support for customer service, data processing, finance, accounting, HR, legal process outsourcing, and supply chain management — improving efficiency and reducing overhead.',
      },
      {
        title: 'PRO Support',
        description:
          'Our dedicated PRO team handles licensing, visas, registrations, and legal requirements with precision, ensuring seamless compliance and administrative support for your workforce.',
      },
      {
        title: 'Employee Housing',
        description:
          'We provide optimized accommodation solutions for your workforce, securing quality housing at competitive rates while reducing your operational burden.',
      },
    ],
    closing: {
      title: 'Empowering Your Workforce',
      text: 'At aasa STAFFING, we combine deep industry knowledge, a vast talent network, and flexible workforce solutions to unlock strategic potential. We don’t just provide staff - we deliver the right people, at the right time, enabling your business to grow and succeed.',
    },
    stats: [],
    sectorsIntro: 'We serve a diverse range of sectors, delivering tailored staffing solutions to meet specialized talent needs:',
    sectors: [
      { name: 'IT & Technology', detail: 'Cybersecurity, AI, Cloud, ERP, Data Science' },
      { name: 'Oil & Gas', detail: 'Engineers, Technicians, QA/QC, HSE, Operators' },
      { name: 'Healthcare & Pharma', detail: 'Doctors, Nurses, Consultants, Regulatory Affairs' },
      { name: 'Retail & E-commerce', detail: 'Sales, Marketing, Store Management, Digital Talent' },
      { name: 'Banking, Finance & Fintech', detail: 'Investment Banking, Risk, Compliance, Digital Transformation' },
      { name: 'Hospitality', detail: 'Chefs, Event Managers, Customer Service' },
      { name: 'Manufacturing & Logistics', detail: 'Operators, Engineers, Supply Chain Specialists' },
      { name: 'Aerospace & Aviation', detail: 'Technicians, Operations, Flight Crew' },
    ],
    clients: [],
  },

  'aasa-power': {
    slug: 'aasa-power',
    logo: `${U}/2025/09/aasaPOWER@4x.png`,
    banner: `${U}/2025/11/energy-industries-hero.jpg`,
    gallery: [`${U}/2025/12/aasa-POWER-busniess-unit.jpg`],
    tagline: 'Engineering Excellence in Power Infrastructure',
    heroText:
      'aasa POWER is a trusted Engineering, Procurement, and Contracting partner serving clients across the Middle East. We deliver end-to-end power solutions covering the full spectrum from Low Voltage systems to Extra High Voltage (EHV) 400kV networks.',
    intro: [
      'Our approach combines engineering precision, technological excellence, and project efficiency to meet the highest standards of reliability and performance.',
      'With a proven record of successfully executing complex transmission and distribution projects, aasa POWER supports the region’s growing energy infrastructure with sustainable, future-ready solutions. Our focus on quality, safety, and timely delivery ensures every project meets client expectations and contributes to long-term operational success.',
    ],
    servicesHeading: 'Core Services',
    services: [
      {
        title: 'Transmission & Distribution Solutions',
        description: 'aasa POWER provides comprehensive EPC services across the entire power delivery chain. Our capabilities include:',
        points: [
          'Engineering, procurement, installation, testing, and commissioning of EHV cables up to 400kV',
          'Substation and underground cable works',
          'Medium and Low Voltage cable works with related civil construction',
          'Utility protection, diversion, and relocation works',
          'Engineering and design of power cable networks',
          'HVAC and PD testing, site acceptance, and recommissioning',
        ],
      },
      {
        title: 'Renewable Energy Integration',
        description: 'We support the transition to a cleaner energy future by offering:',
        points: [
          'Design and installation of rooftop solar PV systems for commercial and industrial clients',
          'Development of utility-scale solar farms from feasibility to construction',
          'Renewable energy feasibility studies and resource assessments',
          'Comprehensive operation and maintenance services',
          'EV charging station design and build solutions',
        ],
      },
      {
        title: 'Civil & Construction Works',
        description: 'Our civil and construction expertise ensures the strong foundations essential for power infrastructure projects, including:',
        points: [
          'Foundation works for lighting and substations',
          'Underground construction and reinstatement',
          'Open-cut and non-destructive road crossing works',
          'Excavation, backfilling, trough, and cover placements',
          'Surface reinstatement including asphalt, horticulture, and tile works',
        ],
      },
      {
        title: 'Testing & Commissioning',
        description: 'We guarantee the reliability and performance of every project through advanced testing and commissioning services, such as:',
        points: [
          'HVAC testing for 132kV cables and GIS bays',
          'Pre-commissioning and partial discharge testing for EHV systems',
          'Site acceptance testing and system recommissioning',
        ],
      },
      {
        title: 'Telecom Services',
        description: 'Reliable communication is critical to efficient power grid management. Our telecom capabilities include:',
        points: [
          'Fiber optic network supply, installation, and EPC delivery',
          'Civil works for crossings and protection',
          'Splicing, termination, and end-to-end testing',
          'SCADA and telecom automation for utility networks',
        ],
      },
    ],
    closing: {
      title: '',
      text: 'At aasa POWER, our commitment to excellence drives us to deliver every project with precision, safety, and integrity. We continue to shape the region’s power infrastructure with solutions that combine engineering innovation and long-term value - empowering progress across industries and communities.',
    },
    stats: [
      { value: '90+', label: 'Engineers' },
      { value: '21+', label: 'Jointers' },
      { value: '18+', label: 'Surveyor' },
      { value: '13+', label: 'Design and NOC' },
    ],
    sectors: [],
    clients: [],
  },

  'aasa-infra': {
    slug: 'aasa-infra',
    logo: `${U}/2025/09/aasaINFRA@4x.png`,
    banner: `${U}/2025/12/aasa-INFRA-banner.jpg`,
    gallery: [`${U}/2025/12/excavator-digging-ground-day-light-2.jpg`],
    tagline: 'Building the Region’s Future Through Integrated Infrastructure Excellence',
    heroText:
      'aasa INFRA is a core division of the aasa Group, delivering integrated infrastructure solutions that connect, build, and sustain the region’s development. With over three decades of expertise, we have earned a reputation for reliability, precision, and innovation across diverse engineering disciplines.',
    intro: [
      'From telecommunications and water networks to civil construction and renewable systems, aasa INFRA provides complete, end-to-end capabilities – managing every stage from design and engineering to execution and maintenance. Our commitment to quality, safety, and sustainability ensures that every project contributes to a smarter, more resilient future.',
    ],
    servicesHeading: 'Core Services',
    services: [
      {
        title: 'Telecom Infrastructure',
        description:
          'Design, construction, and maintenance of advanced communication networks, including fiber optic systems, data centers, in-building solutions, and SCADA automation. Our services span route surveying, trenching, ducting, testing, and commissioning - ensuring seamless connectivity and network reliability.',
      },
      {
        title: 'Water, Drainage & Sewerage Systems',
        description:
          'Comprehensive solutions for potable water, stormwater drainage, and sewerage networks. Leveraging advanced BIM modeling and sustainable design practices, we deliver efficient systems with minimal disruption, supporting both urban and industrial infrastructure.',
      },
      {
        title: 'Civil Construction',
        description:
          'Full-spectrum civil engineering and construction services covering substations, mixed-use developments, and industrial facilities. Backed by skilled professionals and state-of-the-art resources, AASA INFRA delivers projects from excavation and foundations through to structural works and high-quality finishes.',
      },
      {
        title: 'Renewable Energy Solutions',
        description:
          'Turnkey clean energy solutions integrating solar, wind, and hydrogen technologies. Our services cover feasibility studies, design, installation, and maintenance - including EV ecosystem planning and charging infrastructure - supporting the region’s transition to a sustainable energy future.',
      },
    ],
    closing: {
      title: '',
      text: 'At aasa INFRA, we bring technical excellence, innovation, and dedication to every project. Our multidisciplinary expertise enables us to deliver impactful, future-ready infrastructure that strengthens communities and drives sustainable growth across the Middle East.',
    },
    stats: [
      { value: '2900+', label: 'Completed Projects' },
      { value: '720+', label: 'Key Clients' },
    ],
    sectors: [],
    clients: [
      'Danube Properties', 'Abu Dhabi Ports', 'Hyundai E&C', 'Ajman Police', 'Hitachi', 'DAMAC Properties',
      'Emaar', 'Siemens', 'Meraas', "Laing O'Rourke", 'General Electric', 'DEWA', 'du', 'Nakheel',
      'Al-Futtaim', 'wasl', 'Sobha',
    ],
  },

  'aasa-mobility': {
    slug: 'aasa-mobility',
    logo: `${U}/2025/09/aasaMOBILITY@4x.png`,
    banner: `${U}/2025/12/aasa-MOBILITY-banner.jpg`,
    gallery: [`${U}/2025/12/Excavators-BG-4.jpg`],
    tagline: 'Reliable Heavy Equipment Solutions for Every Project',
    heroText:
      'aasa MOBILITY delivers reliable, high-quality heavy equipment rental solutions for construction, industrial, and infrastructure projects. With an extensively maintained fleet and a team of seasoned professionals, we ensure that every client has access to the right equipment – safely, efficiently, and on schedule.',
    intro: [
      'Our goal is to provide customized solutions that enhance productivity, reduce downtime, and support the successful execution of any project, no matter the scale or complexity.',
    ],
    servicesHeading: 'Core Services',
    services: [
      {
        title: 'Flexible Rental Options',
        description: 'Adaptable rental plans to match your project’s duration and needs - hourly, daily, weekly, or monthly.',
      },
      {
        title: 'Comprehensive Equipment Fleet',
        description: 'From excavators and bulldozers to cranes and loaders, we provide a wide range.',
      },
      {
        title: 'Expert Support',
        description: 'Our team offers 24/7 service, on-site visits, and experienced operators to ensure seamless project execution.',
      },
      {
        title: 'Reliable Performance',
        description: 'With dedicated support 365 days a year, AASA MOBILITY ensures your projects run smoothly, safely, and on time.',
      },
    ],
    closing: {
      title: 'Driving Projects Forward',
      text: 'At aasa MOBILITY, we combine equipment excellence, expert support, and tailored solutions to empower clients and keep projects moving efficiently. We don’t just rent machines - we deliver reliability, performance, and peace of mind.',
    },
    stats: [],
    sectors: [],
    clients: [],
  },

  'aasa-steel': {
    slug: 'aasa-steel',
    logo: `${U}/2025/09/aasaSTEEL@4x.png`,
    banner: `${U}/2025/12/aasa-STEEL-banner.jpg`,
    gallery: [`${U}/2025/12/steel-construction-beams-showcasing-industrial-strength.jpg`],
    tagline: 'Leading the Region in Steel Engineering and Fabrication',
    heroText: 'With over three decades of expertise, aasa STEEL is a trusted leader in steel engineering and fabrication across the region.',
    intro: [
      'We deliver innovative, precise, and durable steel solutions for government and private sector projects – from concept and design through fabrication, installation, and delivery.',
      'Our modern production facilities, skilled workforce, and integrated digital systems ensure consistent quality, on-time performance, and complete client confidence.',
    ],
    servicesHeading: 'Our Expertise',
    services: [
      {
        title: 'Design & Engineering',
        description:
          'Innovative structural solutions powered by advanced design software and 3D modeling. We handle every detail - from material optimization and connection design to fabrication drawings and traceability through our integrated fabrication management systems.',
      },
      {
        title: 'Fabrication',
        description:
          'Comprehensive steel fabrication services for heavy built-up assemblies, hot-rolled structures, secondary steel, and plate works. Each component is precisely cut, welded, and assembled under strict quality control to meet international standards.',
      },
      {
        title: 'Installation',
        description:
          'Expert site execution ensures safe and efficient erection of steel structures. Our teams manage logistics, installation, and final inspection with precision, ensuring smooth project delivery every time.',
      },
      {
        title: 'Project Management',
        description:
          'End-to-end project oversight with a focus on cost efficiency, timelines, and quality. From planning and procurement to risk assessment and quality assurance — we manage every stage with transparency and accountability.',
      },
      {
        title: 'Surface Treatment',
        description:
          'Comprehensive protective solutions including abrasive blasting, painting, coating, and galvanizing. We enhance both the performance and aesthetics of every steel component to ensure long-term durability.',
      },
      {
        title: 'Value Engineering & Consulting',
        description:
          'Optimizing performance, cost, and constructability through practical engineering insights. Our experts identify opportunities to enhance project efficiency without compromising safety or quality.',
      },
    ],
    closing: {
      title: 'Building Strength with Precision',
      text: 'At aasa STEEL, every project is driven by our commitment to engineering excellence, innovation, and client satisfaction. We turn complex steel challenges into enduring structures — built to last, built with integrity.',
    },
    stats: [
      { value: '50+', label: 'Ongoing Projects' },
      { value: '650', label: 'Delivered Projects' },
      { value: '300', label: 'Employees' },
      { value: '12000', label: 'Fabrication capacity Mt. per annum' },
    ],
    sectors: [],
    clients: [
      'ABB', 'ALEC', 'ASGC', 'Armani Hotel Dubai', 'Expo 2020 Dubai', 'Hitachi', 'Larsen & Toubro', 'Rimond',
      'Samsung Engineering', 'Arena – A Modon Company',
    ],
  },

  'aasa-tech': {
    slug: 'aasa-tech',
    logo: `${U}/2025/09/aasaTECH@4x.png`,
    banner: `${U}/2025/12/aasa-TECH-banner.jpg`,
    gallery: [`${U}/2025/12/programmer-data-center-using-ai-tech-tablet-close-up.jpg`],
    tagline: 'Driving Digital Innovation Across the UAE',
    heroText:
      'For nearly a decade, aasa TECH has been at the forefront of technological innovation in the UAE. As a division of the AASA Group, we empower businesses with best-in-class ICT solutions, integrated strategies, and cutting-edge technologies that enhance efficiency, security, and digital performance.',
    intro: [
      'Through strategic partnerships with industry leaders, we deliver solutions that go beyond products – crafting IT strategies, operational optimizations, and data-driven insights to keep organizations ahead in a rapidly evolving digital landscape.',
    ],
    servicesHeading: 'Our Expertise',
    services: [
      {
        title: 'Enterprise Networking',
        description: 'Design, implementation, and maintenance of scalable, high-performance networks that ensure seamless connectivity and optimized productivity.',
        points: ['Wired & wireless networking solutions', 'Unified communication platforms', 'Server & storage infrastructure', 'Passive network components'],
      },
      {
        title: 'Automation',
        description: 'Enhancing building operations through tailored automation solutions that improve efficiency, reduce costs, and enhance user experiences.',
        points: ['Lighting control systems', 'Home and guest room management systems (GRMS)', 'Building and facility management systems (BMS/FMS)'],
      },
      {
        title: 'Cybersecurity',
        description: 'Protecting digital assets and sensitive data with comprehensive, proactive security solutions.',
        points: [
          'Endpoint protection & EDR',
          'Network and infrastructure security (firewalls, DLP, NAC, SIEM)',
          'Application and web security (vulnerability scanning, WAF, access control)',
        ],
      },
      {
        title: 'Pro AV Solutions',
        description: 'Creating immersive audio-visual experiences that elevate communication and engagement.',
        points: ['Audio & visual solutions for events and meetings', 'Digital signage & IPTV', 'UC solutions and BYOD support'],
      },
      {
        title: 'ELV Solutions',
        description: 'Delivering integrated extra-low voltage systems that enhance building safety, security, and convenience.',
        points: ['Structured cabling and data center solutions', 'UPS, CCTV, and access control systems', 'Home automation and lighting control'],
      },
      {
        title: 'Managed IT Services',
        description: 'Comprehensive IT support to ensure reliable operations, minimize downtime, and allow organizations to focus on core business.',
        points: ['AMC services and 24/7 help desk support', 'On-site IT services and remote support', 'IT manpower outsourcing'],
      },
    ],
    closing: {
      title: 'Empowering Digital Transformation',
      text: 'At aasa TECH, we combine innovation, expertise, and strategy to deliver ICT solutions that drive business growth, operational efficiency, and secure digital environments. We don’t just provide technology — we create the roadmap to success in a connected world.',
    },
    stats: [
      { value: '65000+', label: 'Data Points' },
      { value: '5000', label: 'CCTV System' },
      { value: '1800 m²+', label: 'LED' },
      { value: '4500', label: 'Intercom device' },
    ],
    sectors: [],
    clients: [
      'Ajman Police', 'Dubai Airports', 'Dubai Police', 'Etisalat (e&)', 'Expo 2020 Dubai',
      'Ministry of Housing and Urban Affairs (India)', 'NEC', 'NBCC', 'Port of Fujairah',
    ],
  },

  'aasa-fm': {
    slug: 'aasa-fm',
    logo: `${U}/2025/09/aasaFM@4x.png`,
    banner: `${U}/2025/12/aasa-FM-banner.jpg`,
    gallery: [`${U}/2025/12/aasa-FM01.jpg`],
    tagline: 'Enhancing Spaces Through Integrated Facility Management Excellence',
    heroText:
      'At aasa FM, we understand that a well-maintained facility is the foundation of operational excellence. As a leading provider of integrated facility management services, we combine skilled teams, advanced processes, and technology to optimize every aspect of your space.',
    intro: [
      'Serving a diverse range of industries — from hospitality and healthcare to commercial and residential complexes — our 5,000+ professionals deliver tailored services that enhance safety, functionality, and efficiency, allowing clients to focus on their core business.',
    ],
    servicesHeading: 'Our Expertise',
    services: [
      {
        title: 'Hard FM Services',
        description: 'Ensuring your building’s infrastructure operates safely and efficiently with both preventive and reactive maintenance:',
        points: [
          'Mechanical, Electrical & Plumbing (MEP) systems',
          'HVAC system maintenance',
          'Civil and structural maintenance, including masonry, painting, carpentry, and chiller/district cooling plant upkeep',
          'Garbage chute and general facility infrastructure management',
        ],
      },
      {
        title: 'Soft FM Services',
        description: 'Creating hygienic, functional, and welcoming spaces that enhance productivity and wellbeing:',
        points: [
          'Car park, security, and visitor management',
          'Elevator, escalator, generator/UPS, and BMS maintenance',
          'Water tank cleaning, swimming pool maintenance, and water quality analysis',
          'Pest control, landscaping, irrigation, and gym equipment maintenance',
          'AC and kitchen duct cleaning',
        ],
      },
      {
        title: 'Specialized Services',
        description: 'Tailored solutions to meet unique facility needs and enhance operational excellence:',
        points: [
          'Deep cleaning, disinfection, and sanitization',
          'Manpower supply and office support',
          'External and internal specialized cleaning services',
        ],
      },
    ],
    closing: {
      title: 'Optimizing Spaces, Elevating Performance',
      text: 'At aasa FM, we take a holistic approach - integrating people, processes, and technology - to ensure facilities operate smoothly, safely, and efficiently. Our mission is to deliver exceptional facility management solutions that create productive, secure, and well-maintained environments for every client.',
    },
    stats: [
      { value: '100+', label: 'Active AMC Contracts' },
      { value: '850000 m²', label: 'Area Under Management' },
      { value: '350', label: 'FM Staff Deployed' },
      { value: '90%', label: 'Contract Renewal Rate' },
    ],
    sectors: [{ name: 'Hospitality' }, { name: 'Healthcare' }, { name: 'Commercial & Residential Complexes' }],
    clients: [
      'Abu Dhabi Ports', 'Aqaar', 'BESIX', 'Diamond Developers', 'Dubai Developments', 'DWMC', 'Emrill',
      'Hilton', 'Jumeirah Group', 'Palfinger Marine', 'Radisson Blu',
    ],
  },

  'aasa-access': {
    slug: 'aasa-access',
    logo: `${U}/2025/09/aasaASCEND@4x.png`,
    banner: `${U}/2025/12/aasa-ACCESS-banner.jpg`,
    gallery: [`${U}/2025/12/aasa-ACCESS01.jpg`],
    tagline: 'Specialized Rope Access Solutions for Challenging Environments',
    heroText:
      'aasa ACCESS delivers specialized rope access, inspection, and maintenance solutions for marine, offshore, oil & gas, civil construction, and structural maintenance industries worldwide.',
    intro: [
      'With extensive experience and highly trained technicians, we provide safe, efficient, and flexible access to even the most challenging structures — minimizing disruption while maintaining operational continuity and structural integrity.',
    ],
    servicesHeading: 'Core Services',
    services: [
      {
        title: 'Rope Access Services',
        description: 'Flexible and efficient rope access techniques for inspection, maintenance, and repair programs across onshore and offshore environments.',
      },
      {
        title: 'Corrosion Control',
        description: 'Comprehensive solutions to prevent, mitigate, and repair corrosion-related issues:',
        points: [
          'Surface preparation and application of protective coatings',
          'Abrasive blasting and high-pressure water jetting',
          'Cathodic protection installation and maintenance',
          'Corrosion monitoring, evaluation, and rehabilitation',
        ],
      },
      {
        title: 'Structural Maintenance & Repairs',
        description: 'Onshore and offshore services that enhance safety, durability, and performance:',
        points: [
          'Equipment maintenance and repair',
          'Structural cleaning, degreasing, and painting',
          'Rigging, lifting, welding, and fabrication',
          'Mechanical and electrical installation and repair',
          'Non-destructive testing (NDT) and inspections',
          'Rope access rescue services',
        ],
      },
    ],
    closing: {
      title: 'Precision Access, Maximum Efficiency',
      text: 'At aasa ACCESS, we combine technical expertise, safety, and innovation to provide tailored rope access and maintenance solutions. Our mission is to extend the life of critical assets while ensuring operational efficiency, safety, and minimal disruption to your projects.',
    },
    stats: [
      { value: '200+', label: 'Certified Rope Access Technicians' },
      { value: '10', label: 'New Build Marine Assets Delivered' },
      { value: '100', label: 'Projects Across Civil, Marine & Oil & Gas' },
      { value: '50', label: 'Iconic UAE Landmarks Executed' },
    ],
    sectors: [
      { name: 'Marine' },
      { name: 'Offshore' },
      { name: 'Oil & Gas' },
      { name: 'Civil Construction' },
      { name: 'Structural Maintenance' },
    ],
    clients: [],
  },
};
