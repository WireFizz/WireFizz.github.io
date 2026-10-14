/*
  WIREFIZZ PORTFOLIO — easy project setup
  ---------------------------------------
  Put project screenshots inside assets/projects/.
  Each project can have 4+ screenshots in its `gallery` array. The first one is used
  as the project card cover. Clicking the cover opens a full gallery with thumbnails.
  These are illustrative demo concepts, not real client engagements.
*/
window.WIREFIZZ_PROJECTS = [
  {
    id: "flowboard-crm",
    title: "Flowboard — Lead Management",
    category: "Web Apps",
    type: "Demo concept",
    description: "A sample lead and admissions workspace that brings enquiries, follow-ups, and application progress into one clear view.",
    image: "assets/projects/flowboard-crm.svg",
    alt: "Flowboard CRM overview dashboard preview",
    gallery: [
      { src: "assets/projects/flowboard-crm.svg", label: "Overview", alt: "Lead management overview dashboard" },
      { src: "assets/projects/flowboard-crm-pipeline.svg", label: "Lead pipeline", alt: "Lead pipeline with new, contacted, qualified, and won columns" },
      { src: "assets/projects/flowboard-crm-lead-detail.svg", label: "Lead profile", alt: "Lead contact profile with recent activity and details" },
      { src: "assets/projects/flowboard-crm-reports.svg", label: "Reports", alt: "Lead conversion and source performance reports" }
    ],
    tags: ["React", "Flask", "PostgreSQL"],
    note: "Illustrative CRM interface with no login required to view the portfolio preview.",
    featured: true,
    demoUrl: "",
    sourceUrl: ""
  },
  {
    id: "pulse-analytics",
    title: "Pulse — Business Analytics",
    category: "Dashboards",
    type: "Demo concept",
    description: "A dark-mode analytics dashboard concept that brings revenue trends, audience signals, and performance indicators together.",
    image: "assets/projects/pulse-analytics.svg",
    alt: "Pulse business intelligence dashboard preview",
    gallery: [
      { src: "assets/projects/pulse-analytics.svg", label: "Overview", alt: "Pulse analytics overview with revenue and performance cards" },
      { src: "assets/projects/pulse-analytics-revenue.svg", label: "Revenue", alt: "Revenue trends and top product performance dashboard" },
      { src: "assets/projects/pulse-analytics-channels.svg", label: "Acquisition", alt: "Customer acquisition channel performance and audience engagement" },
      { src: "assets/projects/pulse-analytics-report.svg", label: "Reports", alt: "Custom report builder with monthly performance metrics" }
    ],
    tags: ["Python", "SQL", "Data Visualization"],
    note: "Sample dashboard images for portfolio presentation; all displayed metrics are fictional UI examples.",
    featured: true,
    demoUrl: "",
    sourceUrl: ""
  },
  {
    id: "northstar-website",
    title: "Northstar — Studio Website",
    category: "Websites",
    type: "Demo concept",
    description: "A calm, editorial-style website concept for a design studio, pairing confident typography with a distinctive visual story.",
    image: "assets/projects/northstar-website.svg",
    alt: "Northstar studio marketing website home page preview",
    gallery: [
      { src: "assets/projects/northstar-website.svg", label: "Homepage", alt: "Northstar studio website home page concept" },
      { src: "assets/projects/northstar-website-home.svg", label: "Hero section", alt: "Editorial studio homepage with featured visual and service links" },
      { src: "assets/projects/northstar-website-services.svg", label: "Services", alt: "Northstar services page with service cards" },
      { src: "assets/projects/northstar-website-work.svg", label: "Selected work", alt: "Northstar selected projects portfolio grid" }
    ],
    tags: ["HTML", "CSS", "JavaScript"],
    note: "Sample marketing website design. Replace the concept with real, client-approved screenshots when available.",
    featured: true,
    demoUrl: "",
    sourceUrl: ""
  },
  {
    id: "answerly-ai",
    title: "Answerly — AI Support Assistant",
    category: "AI & Automation",
    type: "Demo concept",
    description: "A sample AI support workspace with suggested prompts, a knowledge area, and a conversation-first interface.",
    image: "assets/projects/answerly-assistant.svg",
    alt: "Answerly AI support assistant workspace preview",
    gallery: [
      { src: "assets/projects/answerly-assistant.svg", label: "Overview", alt: "Answerly AI assistant workspace and suggested prompts" },
      { src: "assets/projects/answerly-assistant-conversation.svg", label: "Conversation", alt: "AI support conversation with grounded answer and source citation" },
      { src: "assets/projects/answerly-assistant-knowledge.svg", label: "Knowledge base", alt: "Assistant knowledge library and source coverage" },
      { src: "assets/projects/answerly-assistant-analytics.svg", label: "Analytics", alt: "AI assistant response quality and resolution analytics" }
    ],
    tags: ["Python", "REST API", "AI"],
    note: "Concept UI only; this preview does not connect to an AI service or real knowledge base.",
    featured: true,
    demoUrl: "",
    sourceUrl: ""
  }
];
