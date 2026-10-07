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
  },
];
