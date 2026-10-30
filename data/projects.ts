import type { Figure, Note } from "./media";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  date: string;
  summary: string;
  tags: string[];
  overview: string;
  purpose?: string;
  problem?: string; // add your own text to show a "Problem" section
  how?: string[];
  role?: string[];
  learned?: string[]; // add your own notes to show "What I learned"
  repo?: string;
  // Optional, used by the dossier view only. Both are restatements of facts already in this file.
  pipeline?: { step: string; label: string }[];
  testing?: string[];
  /** Real screenshots, in the order they should be shown. */
  figures?: Figure[];
  /** Quiet notes about where the project stands or who it was built for. */
  notes?: Note[];
  /** Public links other than the source code. */
  links?: { href: string; label: string; hint: string }[];
};

export const projects: Project[] = [
  {
    slug: "ai-resume-analyzer",
    title: "AI Resume Analyzer",
    kind: "Personal project",
    date: "Oct 2026",
    summary:
      "Compares a resume against a job description using a locally hosted LLM, and generates feedback through structured JSON validation.",
    tags: ["Python", "Streamlit", "Ollama", "Llama 3.2", "Pydantic"],
    overview:
      "An AI-powered resume analysis tool that compares a resume against a job description using a locally hosted LLM. The application uses structured JSON validation with Pydantic to generate relevant resume feedback.",
    purpose:
      "The project explores how locally hosted LLMs can be used to provide practical resume analysis without relying on a cloud-hosted LLM API.",
    how: [
      "Takes a resume and a job description and compares them.",
      "Runs the analysis on Llama 3.2, hosted locally through Ollama. No cloud AI API is used.",
      "Uses structured JSON validation with Pydantic to generate relevant resume feedback.",
      "Built with Python and Streamlit.",
    ],
    role: ["Personally built the project."],
    repo: "https://github.com/troytenapasiwen/ai-resume-analyzer",
    figures: [
      {
        src: "/images/AI RESUME.png",
        alt: "AI Resume Analyzer interface: an uploaded resume summary on the left and a question-and-answer panel on the right.",
        width: 2880,
        height: 1634,
        caption: "Interface preview",
      },
    ],
    notes: [
      {
        tone: "status",
        label: "Ongoing project",
        text: "The public Streamlit link previews the interface only. Resume analysis needs the AI backend, which currently runs locally, so it is not available in the public demo.",
      },
    ],
    links: [
      {
        href: "https://ai-resume-analyzer-prototype.streamlit.app",
        label: "Open the interface preview",
        hint: "Streamlit, interface only",
      },
    ],
    pipeline: [
      { step: "Input", label: "Resume and job description" },
      { step: "Analysis", label: "Llama 3.2 via Ollama, hosted locally" },
      { step: "Validation", label: "Structured JSON with Pydantic" },
      { step: "Output", label: "Resume feedback" },
    ],
  },
  {
    slug: "reina-pabili-services",
    title: "REINA Pabili Services",
    kind: "Academic project · Capstone",
    date: "Sept 2024 – Nov 2025",
    summary:
      "A mobile and web food delivery platform developed as my capstone project.",
    tags: ["Node.js", "Express.js", "PostgreSQL", "Google Maps Directions API"],
    overview:
      "REINA Pabili Services is a mobile and web food delivery platform developed as my capstone project using Node.js, Express.js, PostgreSQL, and the Google Maps Directions API.",
    role: [
      "Initiated and coordinated the project.",
      "Managed timelines, tasks, requirements, and documentation.",
      "Contributed to development.",
      "Conducted functional, integration, performance, accessibility, compatibility, and security testing.",
    ],
    figures: [
      {
        src: "/images/REINA.png",
        alt: "REINA Pabili Services web app: the log-in screen with a promotional panel on the left and a welcome-back form on the right.",
        width: 2880,
        height: 1634,
        caption: "Web view",
      },
      {
        src: "/images/REINA.jpg",
        alt: "REINA Pabili Services mobile app: the dashboard listing restaurants with ratings, delivery times and prices.",
        width: 828,
        height: 1703,
        caption: "Mobile view",
      },
    ],
    notes: [
      {
        tone: "scope",
        label: "Service area",
        text: "Designed exclusively for Real, Infanta, and General Nakar, Quezon, Philippines.",
      },
      {
        tone: "status",
        label: "Project status",
        text: "Built as an academic capstone. Some third-party services (payments, Google Maps, email delivery and hosting) were not maintained after the project, so some functionality is no longer operational. The frontend and backend were redeployed on Vercel and Render for portfolio demonstration.",
      },
    ],
    testing: [
      "Functional",
      "Integration",
      "Performance",
      "Accessibility",
      "Compatibility",
      "Security",
    ],
    links: [
      {
        href: "https://reina-pabili-services.vercel.app",
        label: "Open project",
        hint: "Vercel portfolio demo, some services no longer operational",
      },
    ],
  },
];
