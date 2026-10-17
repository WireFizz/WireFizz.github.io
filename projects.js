/*
  WIREFIZZ PORTFOLIO — easy project setup
  Use the exact category label "Websites" for every website project so they share one filter.
  ---------------------------------------
  Put project screenshots inside assets/projects/.
  Each project can have 4+ screenshots in its `gallery` array. The first one is used
  as the project card cover. Clicking the cover opens a full gallery with thumbnails.
  These are illustrative demo concepts, not real client engagements.
*/
window.WIREFIZZ_PROJECTS = [
  {
    id: "assets-marketing-website",
    title: "Assets Marketing — Website",
    category: "Websites",
    description: "A modern real estate platform that brings property listings, client enquiries, site visits, and sales progress into one seamless experience.",
    image: "assets/projects/flowboard-crm.png",
    alt: "Flowboard CRM overview dashboard preview",
    gallery: [
      { src: "assets/projects/flowboard-crm.png", label: "Overview", alt: "Lead management overview dashboard" },
      { src: "assets/projects/flowboard-crm-pipeline.png", label: "Lead pipeline", alt: "Lead pipeline with new, contacted, qualified, and won columns" },
      { src: "assets/projects/flowboard-crm-lead-detail.png", label: "Lead profile", alt: "Lead contact profile with recent activity and details" },
      { src: "assets/projects/flowboard-crm-reports.png", label: "Reports", alt: "Lead conversion and source performance reports" }
    ],
    tags: ["React", "Flask", "PostgreSQL"],
    note: "Explore a modern real estate interface showcasing property listings, client enquiries, and sales management features.",
    featured: true,
    demoUrl: "",
    sourceUrl: "https://www.assetsmarketing.pk/yeh"
  },

  {
    id: "pulse-analytics",
    title: "Lead Management Software",
    category: "CRM/LMS",
    description: "A modern dark-mode dashboard that brings lead tracking, follow-ups, and application progress together in one organized workspace.",
    image: "assets/projects/pulse-analytics.png",
    alt: "Pulse business intelligence dashboard preview",
    gallery: [
      { src: "assets/projects/pulse-analytics.PNG", label: "Overview", alt: "Pulse analytics overview with revenue and performance cards" },
      { src: "assets/projects/pulse-analytics-revenue.png", label: "Revenue", alt: "Revenue trends and top product performance dashboard" },
      { src: "assets/projects/pulse-analytics-channels.png", label: "Acquisition", alt: "Customer acquisition channel performance and audience engagement" },
      { src: "assets/projects/pulse-analytics-report.png", label: "Reports", alt: "Custom report builder with monthly performance metrics" }
    ],
    tags: ["Python", "SQL", "Data Visualization"],
    note: "Preview the LMS dashboard interface with illustrative screens showcasing lead tracking, follow-ups, and application management. All displayed metrics are fictional examples for portfolio presentation..",
    featured: true,
    demoUrl: "",
    sourceUrl: "https://wirefizz-lms.vercel.app/"
  },
  {
    id: "northstar-website",
    title: "NOVA — E-COMMERCE",
    category: "Websites",
    description: "A modern e-commerce website concept that combines clean layouts, elegant typography, and intuitive product browsing to create a seamless online shopping experience.",
    image: "assets/projects/northstar-website.png",
    alt: "Northstar studio marketing website home page preview",
    gallery: [
      { src: "assets/projects/northstar-website.png", label: "Homepage", alt: "Northstar studio website home page concept" },
      { src: "assets/projects/northstar-website-home.png", label: "Hero section", alt: "Editorial studio homepage with featured visual and service links" },
      { src: "assets/projects/northstar-website-services.png", label: "Services", alt: "Northstar services page with service cards" },
      { src: "assets/projects/northstar-website-work.png", label: "Selected work", alt: "Northstar selected projects portfolio grid" }
    ],
    tags: ["HTML", "CSS", "JavaScript"],
    note: "A showcase of the NOVA e-commerce website concept, featuring product displays, modern layouts, and a streamlined shopping experience. Replace concept visuals with real, client-approved screenshots when available.",
    featured: true,
    demoUrl: "",
    sourceUrl: "https://wirefizz.github.io/NOVA/"
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
